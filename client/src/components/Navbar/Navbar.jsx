// src/components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

// import the logos
import PupLogo from '../../assets/images/pup-logo.png';
import OtherLogo from '../../assets/images/graduate-logo.png'; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-0 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex align-items-center">
            {/* PUP logo */}
            <img
              src={PupLogo}
              alt="PUP Logo"
              width="65"
              height="65"
              className="navbar-logo"
            />
            {/* Other logo */}
            <img
              src={OtherLogo}
              alt="Other Logo"
              width="65"
              height="65"
              className="navbar-logo ms-2"
            />
          </div>
          {/* Title text */}
          <div className="header-title-container ms-3">
            <span className="header-title fw-bold">
              Polytechnic University of the Philippines
            </span>
            <span className="header-title fw-bold">
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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/features">Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
          <button className="btn btn-nav-signin ms-3">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
