import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/pup-logo.png';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Event Management', path: '/admin/events', icon: 'fa-calendar-alt' },
    { name: 'Survey & Feedback', path: '/admin/survey-feedback', icon: 'fa-poll' },
    { name: 'Career Support', path: '/admin/career-support', icon: 'fa-briefcase' },
    { name: 'Chat & Discussions', path: '/admin/chat-discussions', icon: 'fa-comments' },
    { name: 'Volunteer & Donation', path: '/admin/volunteer-donation', icon: 'fa-hand-holding-heart' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-cog' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Mobile Navbar with a unique ID */}
      <nav className="navbar navbar-expand-lg navbar-dark as-navbar d-md-none">
        <Link to="/" className="navbar-brand">
          <img src={Logo} alt="Admin Logo" className="as-navbar-logo" />
        </Link>
        {/* Sidebar toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleSidebar}
          aria-controls="asAdminSidebarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Sidebar Menu for Mobile */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="asAdminSidebarContent">
          <div className="as-sidebar mobile-sidebar">
            <ul className="as-sidebar-menu navbar-nav">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={`as-sidebar-menu-item nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <Link to={item.path} className="nav-link" onClick={toggleSidebar}>
                    <i className={`fas ${item.icon} me-2`}></i>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Regular Sidebar for Desktop View */}
      <div className="as-sidebar d-none d-md-flex flex-column">
        <div className="as-sidebar-header">
        <Link to="/" className="navbar-brand">
          <img src={Logo} alt="Admin Logo" className="as-sidebar-logo" />
        </Link>
        </div>
        <ul className="as-sidebar-menu nav flex-column">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`as-sidebar-menu-item nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Link to={item.path} className="nav-link">
                <i className={`fas ${item.icon} me-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
