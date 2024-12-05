import React from 'react';
import { NavLink } from 'react-router-dom';
import './DiscussionNavbar.css';

const DiscussionNavbar = () => {
  return (
    <div className="discussion-navbar">
      <ul className="d-flex gap-2">
        <li>
          <NavLink to="/discussions" end className={({ isActive }) => `discussion-navbar-item ${isActive ? 'active' : ''}`}>Discussions</NavLink>
        </li>
        <li>
          <NavLink to="/events" className={({ isActive }) => `discussion-navbar-item ${isActive ? 'active' : ''}`}>Events</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default DiscussionNavbar;