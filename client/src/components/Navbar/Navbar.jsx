import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to track current page

import PupLogo from '../../assets/images/pup-logo.png';
import OtherLogo from '../../assets/images/graduate-logo.png';

const Navbar = () => {

  // Use useNavigate to navigate to a different page
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavLinkClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // small delay to allow the page to navigate to the homepage
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-0 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex align-items-center">
            <img
              src={PupLogo}
              alt="PUP Logo"
              width="65"
              height="65"
              className="navbar-logo"
            />
            <img
              src={OtherLogo}
              alt="Other Logo"
              width="65"
              height="65"
              className="navbar-logo ms-2"
            />
          </div>
          <div className="header-title-container ms-3">
            <span className="header-title fw-bold cinzel">
              Polytechnic University of the Philippines
            </span>
            <span className="header-title fw-bold cinzel">
              Graduate School Alumni Portal .Dev
            </span>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('home')}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('events')}>Events</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('features')}>Features</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('about')}>About Us</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('contact')}>Contact</button>
            </li>
          </ul>
          <button onClick={() => navigate('/login')} className="btn btn-nav-signin ms-3">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
