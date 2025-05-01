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

    try {
      const response = await fetch("http://localhost:5000/generate_heatmap", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalImageUrl(data.original_image_url);
        setHeatmapImageUrl(data.heatmap_image_url);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
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
              marginTop: "40px",
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

          {/* Explanation */}
          <div
            style={{
              marginTop: "30px",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
              The heatmap highlights regions in the image that the AI model
              associates with potential deepfake manipulation.{" "}
              <span style={{ color: "#e74c3c", fontWeight: "bold" }}>Red</span>{" "}
              and{" "}
              <span style={{ color: "#f39c12", fontWeight: "bold" }}>
                orange
              </span>{" "}
              areas indicate zones with higher suspicious activity. These
              visual cues help identify facial features or artifacts often
              modified in fake media generation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trial2;
