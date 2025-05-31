import React, { useEffect, useState } from "react";
import './About3.scss';
import { FaRobot, FaSearch, FaCogs } from 'react-icons/fa';

const About3 = () => {
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/Deepfake4.png';
    img.onload = () => {
      setBgImage("linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/assets/Deepfake4.png') no-repeat center center");
    };
  }, []);

  return (
    <div
      className="how-it-works-container"
      style={{
        background: bgImage || "#23329B", // fallback color until image loads
        backgroundSize: "cover",
        padding: "80px 0",
      }}
    >
      <div className="container">
        <h2 className="section-title">Curious to Know About Its Working?</h2>
        <div className="row">
          <div className="col-lg-4 col-md-12">
            <div className="feature-box">
              <FaRobot className="icong" />
              <h4 className="feature-title">AI-Powered Detection</h4>
              <p className="how-it-works-text">
                FakeCatcher AI utilizes state of the art datasets and models, identifying inconsistencies in visuals Images and Videos that humans can't easily detect.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="feature-box">
              <FaSearch className="icong" />
              <h4 className="feature-title">Detailed Analysis</h4>
              <p className="how-it-works-text">
                We analyze minute details like facial expressions, pixel-level changes, and audio patterns, ensuring precise identification of manipulated content.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="feature-box">
              <FaCogs className="icong" />
              <h4 className="feature-title">Continuous Loops</h4>
              <p className="how-it-works-text">
                The system continually improves by learning from new fake media samples, enhancing detection capabilities over time for even greater accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About3;
