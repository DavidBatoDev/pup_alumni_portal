// src/components/Banner/Banner.jsx
import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
        <div className="banner-content">
            <h1>PUP ALUMNI</h1>
            <p>Welcome to PUP Alumni Portal.<br />Connect, Share, and Grow with our PUP Alumni Community</p>
            <div className="banner-buttons">
                <button className="btn btn-register me-3">Register Now</button>
                <button className="btn btn-signin">Sign In</button>
            </div>
        </div>
    </div>
  );
};

export default Banner;
