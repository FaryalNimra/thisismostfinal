import React, { useState } from "react";
import "./Trial.scss";

const Trial = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Spinner animation ---
  const spinningAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const loaderContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: "100px",
  };

  // --- New Spinner Style with width and gradient lines ---
  const spinnerStyle = {
    border: "12px solid #e0e0e0", // Light gray background ring
    borderTop: "12px solid #00bcd4", // Neon Cyan gradient effect
    borderRight: "12px solid #ff4081", // Added secondary color for stylish effect
    borderBottom: "12px solid #7e57c2", // Soft purple line
    borderRadius: "50%",
    width: "140px", // Increased width for larger spinner
    height: "140px", // Increased height for better visibility
    animation: "spin 1s linear infinite",
    margin: "20px",
  };

  // --- Drag & Drop zone dynamic style ---
  const dragDropZoneStyle = {
    background: file ? "linear-gradient(45deg, #8e9eab, #c7e4e8)" : "#ffffff", // Green gradient on file drop
    border: "2px dashed #aaa",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  };

  const loadingTextStyle = {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
  };

  return (
    <div className="trial-container">
      <style>{spinningAnimation}</style>

      <div className="trial-content">
        <div className="left-section">
          <h1 className="trial-heading">Image Forgery Detection</h1>
          <p className="trial-paragraph">Upload an image to detect if it's a Deepfake or Cheapfake.</p>

          <div
            className="drag-drop-zone"
            style={dragDropZoneStyle}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p>Drag & Drop your image here</p>
            <p>or</p>
            <label htmlFor="file-upload" className="file-upload-label">
              Choose Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="trial-file-upload"
              onChange={handleFileChange}
            />
          </div>

          <button className="trial-upload-btn" onClick={handleUpload}>
            Detect Forgery
          </button>
        </div>

        <div className="right-section">
          {loading ? (
            <div style={loaderContainerStyle}>
              <div style={spinnerStyle}></div>
              <div style={loadingTextStyle}>Please wait while your image is uploading...</div>
            </div>
          ) : (
            !file ? (
              <div className="video-preview">
                <video width="100%" height="100%" controls autoPlay style={{ marginTop: "25px" }}>
                  <source src="/assets/trevor_sesli.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <p className="demo-text" style={{ color: "red", fontSize: "20px", marginTop: "5px" }}>
                  Use this Demo video to understand how the tool works
                </p>
              </div>
            ) : (
              result && (
                <div
                  className="trial-result"
                  style={{
                    opacity: result ? 1 : 0,
                    background: 'linear-gradient(45deg, #ff9e50, #fbc2d5)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '20px',
                    marginTop: '20px',
                    transform: 'translateY(-30px)',
                    animation: 'slideIn 0.5s ease-out forwards',
                  }}
                >
                  <div
                    className="result-heading"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                    }}
                  >
                    Detection Result
                  </div>
                  <div
                    className="result-details"
                    style={{
                      fontSize: '1rem',
                      color: '#f1f1f1',
                    }}
                  >
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Status:</strong> <span className="fake-type" style={{ fontWeight: 'bold', color: 'red' }}>{result.prediction}</span>
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Fake Type:</strong> <span className="fake-type" style={{ fontWeight: 'bold', color: 'red' }}>{result.fake_type}</span>
                    </p>
                    <p style={{ marginBottom: '10px' }}><strong>Deepfake Models Confidence:</strong> {result.deepfake_confidence_before}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Final Prediction:</strong> {Math.min(parseFloat(result.deepfake_confidence_adjusted), 99.5).toFixed(2)}%</p>
                    <p style={{ marginBottom: '10px' }}><strong>Cheapfake Models Confidence:</strong> {result.cheapfake_confidence_before}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Final Prediction:</strong> {result.cheapfake_confidence_adjusted}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Faces Detected:</strong> {result.faces_detected}</p>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>View More:</strong> 
                      <a 
                        href="/assets/Deepfakes_vs_Cheapfakes_Guide.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: 'yellow', textDecoration: 'underline' }}
                      >
                        Click on link
                      </a>
                    </p>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Trial;
