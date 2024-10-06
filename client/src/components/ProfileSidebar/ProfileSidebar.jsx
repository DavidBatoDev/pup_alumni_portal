import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ProfileSidebar.css';
import { logout } from '../../store/userSlice';
import { useDispatch } from 'react-redux';

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user.user);

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
              src="https://via.placeholder.com/80"
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
        <div className="profile-sidebar-menu flex-grow-1">
          <ul className="list-unstyled d-flex flex-column h-100">
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
            <li className="sidebar-divider"></li>
            <li className="flex-grow-1"></li>
            <li className="logout-container">
              {/* Log Out Button with Click Handler */}
              <button className="btn btn-link profile-logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
