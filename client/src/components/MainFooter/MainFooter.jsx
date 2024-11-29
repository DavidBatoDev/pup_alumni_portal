// src/components/HomePageFooter/MainFooter.jsx
import React from 'react';
import './MainFooter.css';

const MainFooter = () => {
  return (
    <footer className="homepage-footer">
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">Contact Information</h4>
            <p>M.H Del Pilar Campus, Sta. Mesa, Manila, Philippines</p>
            <p>Email: gs@pup.edu.ph</p>
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">SOCIAL MEDIA</h4>
            <div className="footer-social-icons">
              <a href="https://www.facebook.com/PUPGSOfficial" target='_blank' className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="https://www.pup.edu.ph/PUPGS/" className="social-icon"><i class="fa fa-globe" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
