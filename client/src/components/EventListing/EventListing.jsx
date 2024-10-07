// src/components/EventListing/EventListing.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './EventListing.css';
import eventImg from '../../assets/images/eventimage1.png'; // Replace with actual path

const EventListing = ({ eventData, onEdit }) => {
  // Extract date information to display it in a specific format
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });

  return (
    <div className="event-listing-wrapper"> {/* Wrap component */}
      <div className="event-listing">
        {/* Left-Aligned Date Section */}
        <div className="event-date-section">
          <div className="event-date-month">{month}</div>
          <div className="event-date-day">{day}</div>
        </div>

        {/* Image and Event Details */}
        <div className="event-image-and-details">
          {/* Event Image */}
          <div className="event-image-container">
            <img
              src={eventData.image || eventImg}
              alt={eventData.event_name || 'Event Image'}
              className="event-image"
            />
          </div>

          {/* Event Information */}
          <div className="event-details">
            <h5 className="event-title">{eventData.event_name}</h5>
            <p className="event-info-listing">
              <strong>{eventData.venue}</strong> | {eventDate.toDateString()} {/* Readable date format */}
            </p>
            <p className="event-description">{eventData.description}</p>
          </div>
        </div>

        {/* Right-Aligned Content */}
        <div className="event-additional-info">
          <span className="event-type">{eventData.type}</span>
          <span className="edit-icon" onClick={() => onEdit(eventData.event_id)}>✎</span>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation for the component props
EventListing.propTypes = {
  eventData: PropTypes.object.isRequired, // Event data should be an object
  onEdit: PropTypes.func.isRequired,      // onEdit should be a function to handle editing
};

export default EventListing;
