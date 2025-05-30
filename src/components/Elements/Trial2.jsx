import React, { useState } from "react";
import Swal from "sweetalert2";

const Trial2 = () => {
  const [image, setImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [heatmapImageUrl, setHeatmapImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedImage = e.target.files[0];
    const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (selectedImage && validImageTypes.includes(selectedImage.type)) {
      setImage(selectedImage);
      setErrorMessage("");
    } else {
      setImage(null);
      Swal.fire({
        icon: "error",
        title: "Invalid Image Format",
        text: "Only PNG, JPG, and JPEG images are allowed.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setErrorMessage("Please select a valid image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setErrorMessage("");
    setOriginalImageUrl("");
    setHeatmapImageUrl("");

    try {
      const response = await fetch("http://localhost:5000/generate_heatmap", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalImageUrl(data.original_image_url);
        setHeatmapImageUrl(data.heatmap_image_url);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to generate heatmap.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing the image.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{
          textAlign: "center",
          marginTop: "80px",
          marginBottom: "30px",
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1e3a8a",
        }}
      >
        Generate a Heatmap from your Image
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "16px",
          color: "#555",
          marginBottom: "40px",
        }}
      >
        Our AI will highlight manipulated areas in your uploaded image. Just upload and analyze!
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: "12px",
            fontSize: "16px",
            marginBottom: "20px",
            width: "90%",
            maxWidth: "320px",
            borderRadius: "8px",
            border: "2px solid #1e3a8a",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Generate Heatmap
        </button>
      </form>

      {loading && (
        <p style={{ textAlign: "center" }}>Processing image, please wait...</p>
      )}

      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}

      {originalImageUrl && heatmapImageUrl && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Original Image */}
            <div
              style={{
                flex: "1 1 300px",
                border: "3px solid #4CAF50",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={originalImageUrl}
                alt="Original"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "360px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Original Image
              </p>
            </div>

            {/* Heatmap Image */}
            <div
              style={{
                flex: "1 1 300px",
                border: "3px solid #FF5733",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={heatmapImageUrl}
                alt="Heatmap"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "360px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Generated Heatmap
              </p>
            </div>
          </div>

          {/* Detailed Color Explanation */}
          <div
            style={{
              marginTop: "30px",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              fontSize: "16px",
              color: "#444",
              lineHeight: "1.6",
            }}
          >
            <p>
              This heatmap is generated using a Grad-CAM technique applied to our AI deepfake detection model. It highlights regions in the image that contributed most to the model's prediction of manipulation.
            </p>
            <p>
              <strong>Color Legend:</strong>
            </p>
            <ul>
              <li>
                <span style={{ color: "#e74c3c", fontWeight: "bold" }}>Red</span>: Highest model attention and suspicion, indicating regions most likely manipulated.
              </li>
              <li>
                <span style={{ color: "#f39c12", fontWeight: "bold" }}>Orange</span>: Moderate suspicion, possibly manipulated areas.
              </li>
              <li>
                <span style={{ color: "#f1c40f", fontWeight: "bold" }}>Yellow</span>: Low to moderate attention, less suspicious.
              </li>
              <li>
                <span style={{ color: "#3498db", fontWeight: "bold" }}>Blue</span>: Minimal model attention, unlikely manipulated.
              </li>
              <li>
                <span style={{ color: "#27ae60", fontWeight: "bold" }}>Green</span>: Areas considered normal with very low suspicion.
              </li>
            </ul>
            <p>
              This visualization helps you understand which parts of the image the AI flagged as suspicious, with warmer colors indicating higher likelihood of manipulation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trial2;
