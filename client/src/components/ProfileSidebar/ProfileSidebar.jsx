import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ProfileSidebar.css';
import { logout } from '../../store/userSlice';
import { useDispatch } from 'react-redux';

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.user);

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };


  return (
    <div className="profile-sidebar">
      {/* Sidebar Header */}
      <div className="profile-sidebar-header"></div>
      <div className="profile-sidebar-content h-100">
        {/* Profile Information */}
        <div className="d-flex gap-2 align-items-end h-auto profile-sidebar-account mt-2">
          <div className="profile-sidebar-image">
            <img
              src={`http://localhost:8000/storage/${user?.profile_picture}`}
              alt="Profile"
              className="rounded-circle img-fluid"
            />
          </div>
          <div className="d-flex flex-column justify-content-center h-auto w-auto">
            <h4 className="profile-sidebar-name">{`${user?.first_name} ${user?.last_name}`}</h4>
            <p className="profile-sidebar-id">{user?.alumni_id}</p>
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <div className="profile-sidebar-menu">
          <div className="profile-sidebar-links">
            <button className="scroll-button left rounded-circle" onClick={() => scroll('left')}><i className="scroll-arrow fa-solid fa-xs fa-chevron-left"></i></button>
            <ul ref={scrollRef} className="list-unstyled d-flex horizontal-scroll">
              {/* Using NavLink for automatic active state tracking */}
              <li>
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Profile Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/settings"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Profile Settings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/security"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Password & Security
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/notifications"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Notification Preferences
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/privacy"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Privacy Settings
                </NavLink>
              </li>
            </ul>
            <button className="scroll-button right rounded-circle" onClick={() => scroll('right')}><i className="scroll-arrow fa-solid fa-chevron-right fa-xs"></i></button>
          </div>
        </div>
        <div className="sidebar-divider"></div>
        <div className="flex-grow-1"></div>
        <div className="logout-container w-100 d-flex justify-content-center">
          {/* Log Out Button with Click Handler */}
          <button className="btn btn-link profile-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
