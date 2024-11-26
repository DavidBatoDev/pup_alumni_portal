import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./AuthenticatedNavbar.css";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import PupLogo from "../../assets/images/pup-logo.png";
import OtherLogo from "../../assets/images/graduate-logo.png";
import NotificationMenu from "../NotificationMenu/NotificationMenu";
import userIcon from "../../assets/images/user.png";

const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  // State to track the drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Handle link click and close drawer
  const handleNavLinkClick = (sectionId) => {
    navigate(`/${sectionId}`);
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
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleDrawer}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop menu */}
        <div
          className="collapse navbar-collapse d-none d-lg-block"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleNavLinkClick("events")}
              >
                Events
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleNavLinkClick("surveys")}
              >
                Surveys
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleNavLinkClick("alumni")}
              >
                Alumni
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleNavLinkClick("discussions")}
              >
                Discussions
              </button>
            </li>
          </ul>
          <div className="auth-container">
            <NotificationMenu />
            <div className="profile-container">
              {user ? (
                <Link to="/profile" className="profile-link">
                  <img
                    src={`http://localhost:8000/storage/${user?.profile_picture}`}
                    alt={`${user.first_name}'s profile`}
                    className="img-fluid rounded-circle navbar-profile-image"
                  />
                </Link>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-nav-signin ms-3"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar drawer for mobile view */}
      <div className={`drawer ${drawerOpen ? "drawer-open" : "none"}`}>
        {/* Close button inside the drawer */}
        <button
          className="drawer-close-btn"
          aria-label="Close Drawer"
          onClick={toggleDrawer}
        >
          &times;
        </button>
        <ul className="drawer-nav">
          <li className="drawer-item">
            <button
              className="drawer-link"
              onClick={() => handleNavLinkClick("events")}
            >
              Events
            </button>
          </li>
          <li className="drawer-item">
            <button
              className="drawer-link"
              onClick={() => handleNavLinkClick("surveys")}
            >
              Survey
            </button>
          </li>
          <li className="drawer-item">
            <button
              className="drawer-link"
              onClick={() => handleNavLinkClick("careers")}
            >
              Career
            </button>
          </li>
          <li className="drawer-item">
            <button
              className="drawer-link"
              onClick={() => handleNavLinkClick("discussions")}
            >
              Discussions
            </button>
          </li>
          {/* Notification bell icon */}
          <NotificationMenu />
          {/* <button className="btn btn-notification"> */}
          {/* </button> */}
          <a className="drawer-item">
            {user ? (
              <Link to="/profile" className="drawer-link">
                <img
                  src={`http://localhost:8000/storage/${user?.profile_picture}`}
                  alt={`${user.first_name}'s profile`}
                  className="img-fluid rounded-circle navbar-profile-image"
                />
              </Link>
            ) : (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/login");
                }}
                className="btn btn-nav-signin mt-3"
              >
                Sign In
              </button>
            )}
          </a>
        </ul>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}
    </nav>
  );
};

export default AuthenticatedNavbar;
