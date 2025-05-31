import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Element5.scss';
import { GoArrowRight } from 'react-icons/go';

const Element5 = () => {
  return (
    <div className="element5-container container">
      <div className="row">
        <div className="col-md-6 order-2 order-md-1 d-flex flex-column align-items-start">
          <h2 className="element5-heading">Track Fake Content & Assign Actions Fast</h2>
          <p className="element5-paragraph">
            Get real-time insights on detected deepfakes with this platform, offering detailed analysis of manipulated content, its source, and suggested actions.
          </p>
          <a href="/Product" className="demo-link1">
            Try it Now <GoArrowRight className="demo-icon1" />
          </a>
        </div>
        <div className="col-md-6 order-1 order-md-2 d-flex justify-content-center align-items-center">
          <img
            src="/assets/Deepfake4.png"
            alt="AI Tool"
            className="img-fluidhf"
            loading="lazy"  // <-- lazy loading enabled here
          />
        </div>
      </div>
    </div>
  );
};

export default Element5;
