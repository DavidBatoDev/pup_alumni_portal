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
            <p>Sta. Mesa, Manila, Philippines</p>
            <p>Email: pupalumni@pup.edu.ph</p>
            <p>Phone: 09 XXX XXX XXX</p>
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">SOCIAL MEDIA</h4>
            <div className="footer-social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-x-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="social-icon"><i className="fas fa-rss"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-spotify"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
