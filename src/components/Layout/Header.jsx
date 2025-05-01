import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Header.scss'; // Import the CSS file for styling

const Header = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  const headerStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
  };

  return (
    <>
      <header className="header">
        <div className="header-wrapper" style={headerStyle}>
          <Link to="/" className="logo1">
            <img src="\Assests\logo1.png" alt="logo1" className="logo-image1" />
          </Link>
          <nav className="navbar navbar-expand-lg">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNavbar}
              aria-expanded={isNavbarOpen ? "true" : "false"}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse justify-content-end ${isNavbarOpen ? 'show' : ''}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link active" onClick={closeNavbar}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/About" className="nav-link" onClick={closeNavbar}>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Product" className="nav-link" onClick={closeNavbar}>
                    Product
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Policy" className="nav-link" onClick={closeNavbar}>
                    Pricing
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Contact" className="nav-link" onClick={closeNavbar}>
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Login" className="nav-link" onClick={closeNavbar}>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Register"
                    className="nav-link"
                    style={{
                      backgroundColor: '#23329B',
                      color: 'white',
                      borderRadius: '10px',
                    }}
                    onClick={closeNavbar}
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
