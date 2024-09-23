// src/components/AboutUsSection/AboutUsSection.jsx
import React from 'react';
import './AboutUsSection.css';
import aboutImage from '../../assets/images/about-us-image.jpg';

const AboutUsSection = () => {
  return (
    <div className="about-us-section glass">
      <div className="container about-us-container">
        <div className="about-us-text">
          <h2>ABOUT US</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra, erat vitae
            suscipit sollicitudin, enim nisi eleifend felis, vel mollis mauris nisl et enim nunc.
            Sed ac nulla a eros elementum consequat quis nec nibh. Phasellus vulputate urna
            ultricies, consectetur orci non, rhoncus ex. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed ac lectus odio.
          </p>
          <button className="learn-more-btn">Learn More</button>
        </div>
        <div className="about-us-image">
          <img src={aboutImage} alt="About Us" />
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
