import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Element11.scss';

const testimonials = [
  {
    quote: "Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.",
    name: "Ali Khan",
    profession: "Digital Marketer",
    image: "/assets/Oval.png",
    rating: 5,
  },
  {
    quote: "A must-have tool! This has helped me detect deepfakes efficiently and improved my workflow.",
    name: "Fatima Zahra",
    profession: "AI Researcher",
    image: "/assets/Oval.png",
    rating: 4,
  },
  {
    quote: "Incredible accuracy and easy to use. Highly recommended for professionals and beginners alike.",
    name: "Omar Farooq",
    profession: "Cybersecurity Expert",
    image: "/assets/Oval.png",
    rating: 5,
  },
];

const Element11 = () => {
  const [index, setIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState('60vh');

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerWidth <= 768 ? '160vh' : '60vh');
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const nextTestimonial = () => {
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="element11-container d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Testimonial Text */}
          <div className="col-12 col-md-8 text-left mb-4 mb-md-0">
            <p className="element11-paragraph">TESTIMONIAL</p>
            <h2 className="element11-heading">{testimonials[index].quote}</h2>
            <div className="text-container">
              <h3 className="element11-subheading">{testimonials[index].name}</h3>
              <p className="element11-subparagraph">{testimonials[index].profession}</p>
              {/* Render Stars for Rating */}
              <div>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < testimonials[index].rating ? '#f8b400' : '#ccc',
                      fontSize: '2rem',
                      marginRight: '8px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {/* Navigation Buttons */}
            <div className="testimonial-buttons mt-3">
              <button className="testimonial-btn" onClick={prevTestimonial}>&larr;</button>
              <button className="testimonial-btn" onClick={nextTestimonial}>&rarr;</button>
            </div>
          </div>

          {/* Right Side - Profile Picture */}
          <div className="col-4 d-none d-md-block text-right">
            <img src={testimonials[index].image} alt="Profile" className="testimonial-image img-fluid rounded-circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Element11;
