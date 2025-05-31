import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Element.scss';

const Element = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setBgLoaded(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const containerStyle = bgLoaded
    ? {
        backgroundImage: "url('/assets/fg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        minHeight: '650px',
        position: 'relative',
        transition: 'background-image 0.5s ease-in',
      }
    : {
        // No background image initially, just a placeholder bg color or transparent
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        minHeight: '650px',
        position: 'relative',
      };

  const handleButtonClick = () => {
    navigate('/Product');
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className="element-container d-flex justify-content-center align-items-center"
    >
      <div className="overlay"></div>
      <div className="text-center">
        <h1 className="element-heading">
          Manage all your moments,
          <br />
          with our solution
        </h1>
        <p className="element-paragraph">Manage and Detect Deepfake & CheapFake.</p>
        <button
          className="element-button btn btn-dark"
          onClick={handleButtonClick}
        >
          Get a Free Demo Now
        </button>
      </div>
    </div>
  );
};

export default Element;
