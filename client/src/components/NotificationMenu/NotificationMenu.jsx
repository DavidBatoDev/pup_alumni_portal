import React, { useState, useRef, useEffect } from 'react';
import './NotificationMenu.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import NotificationItem from '../NotificationItem/NotificationItem';

const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);

  /////// dummy notifications ///////
  const dummyNotifications = [
    { id: 1, type: 'welcome', alert: 'Welcome!', title: 'Greeting new users upon their first login!', message: 'Welcome to the PUP Alumni Portal!', time: '2 hours ago', link: '/'},
    { id: 2, type: 'profileUpdate', alert: 'Profile Update Needed', title: 'Attention Graduate Alumni!',  message: 'Update your profile to stay connected.', time: '1 day ago', link: '/profile' },
    { id: 3, type: 'forumPost', alert: 'New Discussion', title: 'I just want to discuss with Graduate Alumni',  message: 'This will be a message for PUP Graduate alumni. I want to talk PUP graduate alumni', time: '3 days ago', link: '/forum' },
    { id: 4, type: 'directMessage', alert: 'New Message', title: 'hey  i want to talk to you', message: 'John Doe has been stalking your profile.', time: '4 days ago', link: '/discussions' },
    { id: 5, type: 'eventInvitation', alert: 'Event Invitation', title: 'PUP Alumni Homecoming Reunion', message: 'You are invited to the PUP Alumni Reunion. Please join.', time: '5 days ago', link:'/events' },
  ];
  //////////////////////////////////

  useEffect(() => {
    setNotifications(dummyNotifications);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
        document.querySelector('.notification-menu').classList.add('open');
    } else {
        document.querySelector('.notification-menu').classList.remove('open');
    }
  };

  return (
    <div className="notification-container" ref={menuRef}>
      <button onClick={toggleMenu} className="btn notification-button">
        {notifications.length > 0 ?
          <i className="fa-solid fa-bell shake"></i>
          :
          <i className="fa-regular fa-bell"></i>
        }
      </button>


      {isOpen && (
        <div className='notification-menu glass d-flex flex-column flex-start px-3 py-3 rounded gap-2'>

          {/* Notification Header & Controls */}
          <div className='notification-header d-flex flex-row align-content-center'>
            <div className='notification-title'>Your Notifications</div>
            <div className='flex-grow-1'></div>
            <button className='btn-close btn-light rounded fa-solid fa-times' onClick={toggleMenu}></button>
          </div>


          {/* Notification Content List */}
          { notifications.length > 0 ?
          (
            <div className='notification-list'>
            {
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification}/>
            ))
            }
            </div>
          ) : (
            <div className='notification-empty'>
              No new notifications
            </div>
          )
          }
        </div>
      )
      }

    </div>
  )
}

export default NotificationMenu;