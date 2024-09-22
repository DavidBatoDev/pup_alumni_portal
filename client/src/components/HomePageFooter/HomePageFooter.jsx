// src/components/HomePageFooter/HomePageFooter.jsx
import React from 'react';
import './HomePageFooter.css';

const HomePageFooter = () => {
  return (
    <footer className="homepage-footer">
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
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
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fas fa-rss"></i></a>
              <a href="#"><i className="fab fa-spotify"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
