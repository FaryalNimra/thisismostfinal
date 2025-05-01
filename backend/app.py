from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS  # Import CORS
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from huggingface_hub import hf_hub_download  # Make sure this import is included
import os
from mtcnn import MTCNN  
import cv2
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_cors import CORS
from pymongo import MongoClient
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import logging
from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt


# Setup logging
logging.basicConfig(level=logging.INFO)


app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for the Flask app

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Model Function
def load_model_from_hf(repo_id, filename, num_classes):
    model_path = hf_hub_download(repo_id=repo_id, filename=filename)
    model = models.convnext_tiny(weights=None)
    in_features = model.classifier[2].in_features
    model.classifier[2] = nn.Linear(in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

# Load Models
deepfake_model = load_model_from_hf("faryalnimra/DFDC-detection-model", "DFDC.pth", 2)  
cheapfake_model = load_model_from_hf("faryalnimra/ORIG-TAMP", "ORIG-TAMP.pth", 1)
realfake_model = load_model_from_hf("faryalnimra/RealFake", "real_fake.pth", 1)  # New model added (only loaded, not used)

# Image Preprocessing
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

face_detector = MTCNN()

def detect_face(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    faces = face_detector.detect_faces(image_rgb)
    face_count = sum(1 for face in faces if face.get("confidence", 0) > 0.90 and face.get("box", [0, 0, 0, 0])[2] > 30)
    return face_count

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    filename = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filename)

    try:
        image = Image.open(filename).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)
    except Exception as e:
        return jsonify({"error": "Error processing image", "details": str(e)}), 500

    with torch.no_grad():
        deepfake_probs = torch.softmax(deepfake_model(image_tensor), dim=1)[0]
        deepfake_confidence_before = deepfake_probs[1].item() * 100  
        cheapfake_confidence_before = torch.sigmoid(cheapfake_model(image_tensor)).item() * 100  

    face_count = detect_face(filename)
    face_factor = min(face_count / 2, 1)  

    if deepfake_confidence_before <= cheapfake_confidence_before:
        adjusted_deepfake_confidence = deepfake_confidence_before * (1 + 0.3 * face_factor)
        adjusted_cheapfake_confidence = cheapfake_confidence_before * (1 - 0.3 * face_factor)
    else:
        adjusted_deepfake_confidence = deepfake_confidence_before
        adjusted_cheapfake_confidence = cheapfake_confidence_before

    fake_type = "Deepfake" if adjusted_deepfake_confidence > adjusted_cheapfake_confidence else "Cheapfake"
    # Print the result to the terminal
    print(f"Prediction: Fake")
    print(f"Fake Type: {fake_type}")
    print(f"Deepfake Confidence Before: {deepfake_confidence_before:.2f}%")
    print(f"Deepfake Confidence Adjusted: {adjusted_deepfake_confidence:.2f}%")
    print(f"Cheapfake Confidence Before: {cheapfake_confidence_before:.2f}%")
    print(f"Cheapfake Confidence Adjusted: {adjusted_cheapfake_confidence:.2f}%")
    print(f"Faces Detected: {face_count}")
    print(f"Image URL: {url_for('static', filename=f'uploads/{file.filename}')}")

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

HEATMAP_FOLDER = "static/heatmaps"
os.makedirs(HEATMAP_FOLDER, exist_ok=True)


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}  # Allow these extensions
UPLOAD_FOLDER = "static/uploads"
HEATMAP_FOLDER = "static/heatmaps"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(HEATMAP_FOLDER, exist_ok=True)

# Check if the uploaded file has an allowed extension
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ✨ Heatmap generator (Grid based)
def generate_heatmap(original_image_path, heatmap_save_path):
    try:
        print(f"Opening image: {original_image_path}")  # Debug print
        img = Image.open(original_image_path).convert("L")  # Convert to Grayscale
        print(f"Image opened successfully: {original_image_path}")  # Debug print
        
        img = img.resize((20, 20))  # Resize to small grid (adjust as needed)
        print(f"Image resized to: {img.size}")  # Debug print

        img_array = np.array(img)

        plt.figure(figsize=(10, 8))
        sns.heatmap(img_array, cmap="coolwarm", cbar=True, square=True, linewidths=0.5)

        plt.axis('off')  # Hide axis if you want
        plt.savefig(heatmap_save_path, bbox_inches='tight', pad_inches=0)
        plt.close()
        print(f"Heatmap saved to: {heatmap_save_path}")  # Debug print
    except Exception as e:
        print(f"Heatmap generation failed for {original_image_path}: {e}")  # Print specific error

@app.route("/generate_heatmap", methods=["POST"])
def generate_heatmap_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Allowed types are .png, .jpg, .jpeg, .tif, .tiff"}), 400

    filename = secure_filename(file.filename)
    original_image_path = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        file.save(original_image_path)
        print(f"File saved to: {original_image_path}")  # Debug print
    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({"error": "Failed to save the file"}), 500

    heatmap_filename = f"heatmap_{filename}"
    heatmap_path = os.path.join(HEATMAP_FOLDER, heatmap_filename)
    
    generate_heatmap(original_image_path, heatmap_path)

    return jsonify({
        "original_image_url": url_for("static", filename=f"uploads/{filename}", _external=True),
        "heatmap_image_url": url_for("static", filename=f"heatmaps/{heatmap_filename}", _external=True)
    })


#MongoDB Atlantis from flask import Flask, request, jsonify


# MongoDB connection
client = MongoClient('mongodb+srv://fakecatcherai:sX_W9!SUigNS.ww@cluster0.pwyazjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['fakecatcherDB']
users_collection = db['users']
contacts_collection = db['contacts']

def is_valid_password(password):
    if (len(password) < 8 or
        not re.search(r'[A-Z]', password) or
        not re.search(r'[a-z]', password) or
        not re.search(r'[0-9]', password) or
        not re.search(r'[!@#$%^&*(),.?":{}|<>]', password)):
        return False
    return True

@app.route('/Register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({'email': email}):
        logging.warning(f"Attempted register with existing email: {email}")
        return jsonify({'message': 'Email already exists!'}), 400

    # ✅ Password constraints check
    if not is_valid_password(password):
        return jsonify({'message': 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'}), 400

    hashed_pw = generate_password_hash(password)
    users_collection.insert_one({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': hashed_pw
    })

    logging.info(f"New user registered: {first_name} {last_name}, Email: {email}")
    return jsonify({'message': 'Registration successful!'}), 201

# 🔵 Login Route
@app.route('/Login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        logging.warning(f"Failed login attempt for email: {email}")
        return jsonify({'message': 'Invalid email or password!'}), 401

    logging.info(f"User logged in successfully: {email}")
    return jsonify({'message': 'Login successful!'}), 200
@app.route('/ForgotPassword', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')

    # Check if passwords match
    if new_password != confirm_password:
        logging.warning(f"Password reset failed. Passwords do not match for email: {email}")
        return jsonify({'message': 'Passwords do not match!'}), 400

    # Check if the user exists
    user = users_collection.find_one({'email': email})
    if not user:
        logging.warning(f"Password reset attempt for non-existent email: {email}")
        return jsonify({'message': 'User not found!'}), 404

    # Hash the new password and update it
    hashed_pw = generate_password_hash(new_password)
    users_collection.update_one({'email': email}, {'$set': {'password': hashed_pw}})

    logging.info(f"Password successfully reset for email: {email}")
    return jsonify({'message': 'Password updated successfully!'}), 200




   

# 🟣 Contact Form Route (React Page: Contact)
@app.route('/Contact', methods=['POST'])
def contact():
    data = request.get_json()
    email = data.get('email')
    query = data.get('query')
    message = data.get('message')

    # Check if all fields are provided
    if not email or not query or not message:
        logging.warning(f"Incomplete contact form submission from email: {email}")
        return jsonify({'message': 'All fields are required!'}), 400

    # Insert the contact data
    contact_data = {
        'email': email,
        'query': query,
        'message': message
    }
    contacts_collection.insert_one(contact_data)

    logging.info(f"Contact form submitted successfully from email: {email}")
    return jsonify({'message': 'Your message has been sent successfully.'}), 200

if __name__ == '__main__':
    app.run(debug=True)
