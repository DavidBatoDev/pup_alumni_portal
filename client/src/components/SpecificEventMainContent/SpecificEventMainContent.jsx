import React, { useState } from 'react';
import './SpecificEventMainContent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import CustomAlert from '../CustomAlert/CustomAlert';
import CircularLoader from '../CircularLoader/CircularLoader';

const SpecificEventMainContent = ({ eventId, title, details, date, venue, is_registered, is_active }) => {
  const [loading, setLoading] = useState(false); // State for loading
  const [alert, setAlert] = useState({ message: '', severity: '' }); // State for alert messages
  const navigate = useNavigate(); // Hook for navigation
  
  console.log('eventId:', eventId);

  // Function to handle RSVP click
  const handleRSVP = async () => {
    if (is_registered) {
      // If the user is already registered, display an alert and prevent further requests
      setAlert({ message: 'You are already registered for this event!', severity: 'info' });
      return; // Exit the function
    }

    try {
      setLoading(true); // Show loader
      const token = localStorage.getItem('token');

      // Make the POST request to register for the event
      const response = await axios.post(
        `/api/event/${eventId}/register`,
        {}, // No body required for this endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the Authorization header
          },
        }
      );

      // Handle success
      setLoading(false); // Hide loader
      setAlert({ message: 'You have successfully registered for the event!', severity: 'success' });

      // Navigate to /events page after a short delay
      setTimeout(() => navigate('/events'), 2000);
    } catch (error) {
      setLoading(false); // Hide loader

      // Check if the error is due to already being registered
      if (error.response && error.response.status === 400 && error.response.data === 'You are already registered on the event.') {
        setAlert({ message: 'You are already registered for this event!', severity: 'info' }); // Show info alert without changing the UI
      } else {
        setAlert({ message: 'Failed to register for the event. Please try again.', severity: 'error' });
      }

      console.error('RSVP Error:', error);
    }
  };

  console.log(is_active)

  return (
    <div className="specific-event-details-container">
      {/* Show loader when loading is true */}
      {loading && <CircularLoader />}

      {/* Display alert message */}
      {alert.message && (
        <CustomAlert
          severity={alert.severity}
          message={alert.message}
          onClose={() => setAlert({ message: '', severity: '' })} // Clear alert on close
        />
      )}

      <div className="specific-event-details">
        {/* About Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>About {title}</h1>
            {is_registered ? (
              is_active && <div className="rsvp">Registered</div>
            ) : (
              is_active && (
              <button className="rsvp-btn d-flex" onClick={handleRSVP}>
                RSVP NOW
              </button>
              )
            )}
          </div>
          <p className="specific-event-description" dangerouslySetInnerHTML={{ __html: details }} />
        </div>

        {/* Date and Location Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>Date: {date}</h1>
            <p>Location: {venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificEventMainContent;
