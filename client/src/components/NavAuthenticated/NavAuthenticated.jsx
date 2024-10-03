import React, { useState } from 'react';
import './NavAuthenticated.css';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import PupLogo from '../../assets/images/pup-logo.png';
import OtherLogo from '../../assets/images/graduate-logo.png';
import Bell from '../../assets/svgs/bell.svg';
import user from '../../assets/images/user.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to track the drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Handle link click and close drawer
  const handleNavLinkClick = (sectionId) => {
    setDrawerOpen(false); // Close drawer on link click

    if (location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Small delay to allow the page to navigate to the homepage
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
        {/* Hamburger button for mobile view */}
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={toggleDrawer}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Desktop menu */}
        <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('home')}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('events')}>Events</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('career')}>Career</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('discussion')}>Discussion</button>
            </li>
          </ul>
          {/* Notification bell icon */}
          <div className="auth-container">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/></svg>
            <div className="profile-container">
              <img clas src={user} alt="User" className="profile-image" />
            </div>
          </div>
          
        </div>
      </div>

      {/* Sidebar drawer for mobile view */}
      <div className={`drawer ${drawerOpen ? 'drawer-open' : 'none'}`}>
        {/* Close button inside the drawer */}
        <button className="drawer-close-btn" aria-label="Close Drawer" onClick={toggleDrawer}>
          &times;
        </button>
        <ul className="drawer-nav">
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('home')}>Home</button>
          </li>
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('events')}>Events</button>
          </li>
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('career')}>Career</button>
          </li>
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('discussion')}>Discussion</button>
          </li>
          {/* Notification bell icon */}
          <button className="btn btn-notification">
            <img src={Bell}/>
          </button>
          <button onClick={() => { setDrawerOpen(false); navigate('/login'); }} className="btn btn-nav-signin mt-3">Sign In</button>
        </ul>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}
    </nav>
  );
};

export default Navbar;
