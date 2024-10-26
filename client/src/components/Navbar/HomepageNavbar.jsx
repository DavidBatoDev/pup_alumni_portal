import React, { useState } from 'react';
import './HomepageNavbar.css';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import PupLogo from '../../assets/images/pup-logo.png';
import OtherLogo from '../../assets/images/graduate-logo.png';
import { useSelector } from 'react-redux';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import userIcon from '../../assets/images/user.png';

const HomepageNavbar = () => {
  const { user } = useSelector((state) => state.user);
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
              <button className="nav-link" onClick={() => handleNavLinkClick('features')}>Features</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('about')}>About Us</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleNavLinkClick('contact')}>Contact</button>
            </li>
          </ul>


          {
            user ? (
              <>
              <NotificationMenu />
              <Link to="/profile" className="nav-link">
              <img src={userIcon} alt="User" width="30" height="30" />
              </Link>

              </>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-nav-signin ms-3">Sign In</button>
            )
          }
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
            <button className="drawer-link" onClick={() => handleNavLinkClick('features')}>Features</button>
          </li>
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('about')}>About Us</button>
          </li>
          <li className="drawer-item">
            <button className="drawer-link" onClick={() => handleNavLinkClick('contact')}>Contact</button>
          </li>
          { user ? (
            <>
              <NotificationMenu />
              <Link to="/profile" className="drawer-link">
                <img src={userIcon}
                  alt="User"
                  width="30"
                  height="30"
                  />
              </Link>
            </>
          ) : (
            <button onClick={() => { setDrawerOpen(false); navigate('/login'); }} className="btn btn-nav-signin mt-3">Sign In</button>
          )}
        </ul>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}
    </nav>
  );
};

export default HomepageNavbar;
