from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from huggingface_hub import hf_hub_download
import os
from pymongo import MongoClient
from mtcnn import MTCNN  
import cv2
from flask_bcrypt import generate_password_hash, check_password_hash
import logging
import numpy as np
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import tensorflow as tf
import psutil  # For monitoring memory usage
import gc  # For garbage collection

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)

# Initialize Flask app
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
UPLOAD_FOLDER = "static/uploads"
HEATMAP_FOLDER = "static/heatmaps"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(HEATMAP_FOLDER, exist_ok=True)

# Image preprocessing transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize image to 224x224
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Face detection setup
face_detector = MTCNN()

# Load models once during app initialization
def load_model_from_hf(repo_id, filename, num_classes):
    hf_api_token = os.getenv("HF_API_TOKEN")
    model_path = hf_hub_download(repo_id=repo_id, filename=filename, use_auth_token=hf_api_token)
    model = models.convnext_tiny(weights=None)
    in_features = model.classifier[2].in_features
    model.classifier[2] = nn.Linear(in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# Load your models
deepfake_model = load_model_from_hf(
    repo_id=os.getenv("HF_DEEPFAKE_REPO_ID"), 
    filename="DFDC.pth", 
    num_classes=2
)

cheapfake_model = load_model_from_hf(
    repo_id=os.getenv("HF_CHEAPFAKE_REPO_ID"), 
    filename="ORIG-TAMP.pth", 
    num_classes=1
)

# Image face detection function
def detect_face(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    faces = face_detector.detect_faces(image_rgb)
    face_count = sum(1 for face in faces if face.get("confidence", 0) > 0.90 and face.get("box", [0, 0, 0, 0])[2] > 30)
    return face_count

# Model prediction route
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    filename = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(filename)

    try:
        # Open and preprocess the image
        image = Image.open(filename).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)
    except Exception as e:
        return jsonify({"error": "Error processing image", "details": str(e)}), 500

    with torch.no_grad():
        # Get predictions for deepfake and cheapfake models
        deepfake_probs = torch.softmax(deepfake_model(image_tensor), dim=1)[0]
        deepfake_confidence_before = deepfake_probs[1].item() * 100
        cheapfake_confidence_before = torch.sigmoid(cheapfake_model(image_tensor)).item() * 100

    face_count = detect_face(filename)
    face_factor = min(face_count / 2, 1)

    # Adjusting confidence based on the number of detected faces
    if deepfake_confidence_before <= cheapfake_confidence_before:
        adjusted_deepfake_confidence = deepfake_confidence_before * (1 + 0.3 * face_factor)
        adjusted_cheapfake_confidence = cheapfake_confidence_before * (1 - 0.3 * face_factor)
    else:
        adjusted_deepfake_confidence = deepfake_confidence_before
        adjusted_cheapfake_confidence = cheapfake_confidence_before

    fake_type = "Deepfake" if adjusted_deepfake_confidence > adjusted_cheapfake_confidence else "Cheapfake"

    # Log memory usage
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    logging.info(f"Memory usage: {memory_info.rss / 1024 / 1024:.2f} MB")

    # Release GPU memory (if using GPU)
    torch.cuda.empty_cache()
    gc.collect()  # Garbage collection for CPU memory

    return jsonify({
        "prediction": "Fake",
        "fake_type": fake_type,
        "deepfake_confidence_before": f"{deepfake_confidence_before:.2f}%",
        "deepfake_confidence_adjusted": f"{adjusted_deepfake_confidence:.2f}%",
        "cheapfake_confidence_before": f"{cheapfake_confidence_before:.2f}%",
        "cheapfake_confidence_adjusted": f"{adjusted_cheapfake_confidence:.2f}%",
        "faces_detected": face_count,
        "image_url": url_for("static", filename=f"uploads/{file.filename}")
    })

# Heatmap generation function
def generate_heatmap(original_image_path, heatmap_save_path):
    try:
        img = Image.open(original_image_path).convert("L")  # Convert to grayscale
        img = img.resize((20, 20))  # Resize image for heatmap grid
        img_array = np.array(img)

        plt.figure(figsize=(10, 8))
        sns.heatmap(img_array, cmap="coolwarm", cbar=True, square=True, linewidths=0.5)
        plt.axis('off')
        plt.savefig(heatmap_save_path, bbox_inches='tight', pad_inches=0)
        plt.close()
    except Exception as e:
        logging.error(f"Heatmap generation failed for {original_image_path}: {e}")

# Heatmap API route
@app.route("/generate_heatmap", methods=["POST"])
def generate_heatmap_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename)
    original_image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(original_image_path)

    heatmap_filename = f"heatmap_{filename}"
    heatmap_path = os.path.join(HEATMAP_FOLDER, heatmap_filename)
    generate_heatmap(original_image_path, heatmap_path)

    return jsonify({
        "original_image_url": url_for("static", filename=f"uploads/{filename}", _external=True),
        "heatmap_image_url": url_for("static", filename=f"heatmaps/{heatmap_filename}", _external=True)
    })

# MongoDB connection
mongo_url = os.getenv("MONGO_URI")
client = MongoClient(mongo_url)
db = client['fakecatcherDB']
users_collection = db['users']
contacts_collection = db['contacts']

# Register API
@app.route('/Register', methods=['POST'])
def register():
    # User registration logic...
    pass

# Login API
@app.route('/Login', methods=['POST'])
def login():
    # User login logic...
    pass

# Contact API
@app.route('/Contact', methods=['POST'])
def contact():
    # Contact form submission logic...
    pass

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
