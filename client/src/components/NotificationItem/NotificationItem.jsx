import React from 'react';
import './NotificationItem.css';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  // Function to get the appropriate class name CSS styling based on the notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return 'fa-solid fa-champagne-glasses';
      case 'profileUpdate':
        return 'fa-regular fa-user';
      case 'surveyInvitation':
        return 'text-dark fa-regular fa-comment-dots';
      case 'directMessage':
        return 'text-dark fa-regular fa-envelope';
      case 'eventInvitation':
        return 'text-dark fa-regular fa-calendar';
      default:
        return 'text-dark';
    }
  };

  const handleNavigate = () => {
    navigate(notification.link);
  }

  return (
    <div className={`notification-item glass pmd-2 mb-3 rounded d-flex flex-row`}>
      <div className='notification-icon-container mx-2 my-2'>
        <i className={`notification-icon fa-xl ${getNotificationIcon(notification?.type)}`}></i>
      </div>
      <div className="flex-grow-1 flex-column d-flex flex-start align-items-start mx-1">
        <h5 className="notification-alert">{notification?.alert}</h5>
        <small className="notification-time">{notification?.time}</small>

        <div className='notification-content bg-gray d-flex mt-2 flex-column flex-start p-2 w-100'>
          <p className='notification-title'>{notification?.title}</p>
          <p className="notification-message">{notification?.message}</p>
          <button onClick={handleNavigate} className="btn btn-danger justify-content-center d-flex align-items-center">Read</button>
        </div>

      </div>
    </div>
  );
};

export default NotificationItem;
