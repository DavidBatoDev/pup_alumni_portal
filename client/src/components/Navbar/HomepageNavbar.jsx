import React, { useState, useRef } from 'react';
import './HomepageNavbar.css';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import PupLogo from '../../assets/images/pup-logo.png';
import GraduateLogo from '../../assets/images/graduate-logo.png';
import BagongPilipinasLogo from '../../assets/images/bagong-pilipinas-logo.png';
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

  const navLinks = [
    { name: 'Home', section: 'home' },
    { name: 'Events', section: 'events' },
    { name: 'Features', section: 'features' },
    { name: 'About Us', section: 'about' },
    { name: 'Contact', section: 'contact' },
  ];

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
              src={GraduateLogo}
              alt="Graduate Logo"
              width="65"
              height="65"
              className="navbar-logo ms-2"
            />
            <img
              src={BagongPilipinasLogo}
              alt="Bagong Pipipinas Logo"
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
              Graduate School Alumni Engagement Portal System
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
            {navLinks.map((link) => (
              <li className="nav-item" key={link.section}>
                <button className="nav-link" onClick={() => handleNavLinkClick(link.section)}>
                  {link.name}
                </button>
              </li>
            ))}
            {user ? (
              <li className="nav-item d-flex">
                <NotificationMenu />
                <Link to="/profile" className="nav-link">
                  {user?.profile_picture
                    ? <img
                      src={user?.profile_picture ? `http://localhost:8000/storage/${user?.profile_picture}` : '/pfp.jpg'}
                      alt={`${user.first_name}'s profile`}
                      className="img-fluid rounded-circle navbar-profile-image"
                    /> :
                    <img
                      src={userIcon}
                      alt={`${user.first_name}'s profile`}
                      className="img-fluid rounded-circle navbar-profile-image"
                    />
                  }
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Sidebar drawer for mobile view */}
      <div className={`drawer ${drawerOpen ? 'drawer-open' : 'none'}`}>
        {/* Close button inside the drawer */}
        <button className="drawer-close-btn" aria-label="Close Drawer" onClick={toggleDrawer}>
          &times;
        </button>
        <ul className="drawer-nav">
          {navLinks.map((link) => (
            <li className="drawer-item" key={link.section}>
              <button className="drawer-link" onClick={() => handleNavLinkClick(link.section)}>
                {link.name}
              </button>
            </li>
          ))}
          {user ? (
            <li className="drawer-item" key={'profile'}>
              <NotificationMenu />
              <Link to="/profile" className="drawer-link">
                {user?.profile_picture
                  ? <img
                    src={user?.profile_picture ? `http://localhost:8000/storage/${user?.profile_picture}` : '/pfp.jpg'}
                    alt={`${user.first_name}'s profile`}
                    className="img-fluid rounded-circle navbar-profile-image"
                  /> :
                  <img
                    src={userIcon}
                    alt={`${user.first_name}'s profile`}
                    className="img-fluid rounded-circle navbar-profile-image"
                  />
                }
              </Link>
            </li>
          ) : (
            <li className="drawer-item" key={'login'}>
              <Link to="/login" className="drawer-link">Login</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}
    </nav>
  );
};

export default HomepageNavbar;
