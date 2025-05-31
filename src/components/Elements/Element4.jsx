import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Element4.scss';
import { GoArrowRight } from 'react-icons/go';

const Element4 = () => {
  const [loadVideo, setLoadVideo] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();  // Stop observing once loaded
        }
      },
      {
        rootMargin: '100px', // thoda early load karwana chaho to margin de sakte ho
      }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="element4-container container">
      <div className="row">
        <div
          className="col-md-6 d-flex justify-content-center align-items-center"
          ref={videoRef}
          style={{ minHeight: '300px' }}
        >
          {loadVideo ? (
            <iframe
              width="100%"
              height="300"
              src="/assets/trevor_sesli.webm"
              title="Fake Catcher AI Tool Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div style={{ width: '100%', height: '300px', backgroundColor: '#eee' }}>
              {/* Placeholder jab tak video load nahi hota */}
              Loading video...
            </div>
          )}
        </div>
        <div className="col-md-6 d-flex flex-column align-items-start">
          <h2 className="element4-heading">Detect Deepfakes with Our Advanced AI Tool</h2>
          <p className="element4-paragraph">
            Leverage cutting-edge AI technology to detect deepfakes and manipulated media with high accuracy. Our platform provides instant analysis to ensure content authenticity.
          </p>
          <a href="/Product" className="demo-link d-inline-flex align-items-center text-primary mt-3">
            Get a Demo now <GoArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Element4;
