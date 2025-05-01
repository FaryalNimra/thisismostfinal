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
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginTop: "80px",
          marginBottom: "50px",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Upload Image and Generate Heatmap
      </h1>

      <form onSubmit={handleSubmit} style={{ textAlign: "center", marginBottom: "40px" }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: "8px",
            fontSize: "16px",
            marginBottom: "20px",
            width: "90%",
            maxWidth: "300px",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
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

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}

      {originalImageUrl && heatmapImageUrl && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",
            gap: "20px",
            margin: "0 auto",
            marginTop: "40px",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {/* Original Image Container */}
          <div
            style={{
              flex: "1 1 300px",
              textAlign: "center",
              border: "3px solid #4CAF50",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              minWidth: "280px",
              maxWidth: "100%",
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
              Your Original Image
            </p>
          </div>

          {/* Heatmap Container */}
          <div
            style={{
              flex: "1 1 300px",
              textAlign: "center",
              border: "3px solid #FF5733",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              minWidth: "280px",
              maxWidth: "100%",
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
              Your Heatmap
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trial2;
