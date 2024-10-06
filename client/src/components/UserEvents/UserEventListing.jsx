// src/components/EventListing/EventListing.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './UserEventListing.css';
import eventImg from '../../assets/images/eventimage2.jpg'; // Replace with actual path
import { Link } from 'react-router-dom';

const EventListing = ({ eventData, onEdit }) => {
  // Extract date information to display it in a specific format
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });

  // Create a URL-friendly version of the event title
  const formattedTitle = eventData.title.replace(/\s+/g, '-'); // Replace spaces with hyphens

  return (
    <div className="event-listing-auth">
      {/* Left-Aligned Date Section */}
      <div className="event-date-auth-section">
        <div className="event-date-month-auth">{month}</div>
        <div className="event-date-day-auth">{day}</div>
      </div>

      {/* Image and Event Details */}
      <div className="event-image-and-details-auth">
        {/* Event Image */}
        <div className="event-image-container-auth">
          <img
            src={eventData.image || eventImg}
            alt={eventData.event_name || 'Event Image'}
            className="event-image-auth"
          />
        </div>

        {/* Event Information */}
        <div className="event-details-auth">
          <h5 className="event-title-auth">{eventData.title}</h5>
          <p className="event-info-listing-auth">
            <strong>{eventData.venue}</strong> | <span>{eventDate.toDateString()}</span> {/* Readable date format */}
          </p>
          <p className="event-description-auth">{eventData.details}</p>
          <div className="event-additional-info-auth">
            <span className="event-type-auth">{eventData.type}</span>
            {/* Link to a dynamic URL based on formatted event title */}
            <Link 
              to={`/events/${formattedTitle}`} 
              className="btn more-info" 
            >
              More Info
            </Link>
          </div>
        </div>
        
      </div>

      {/* Right-Aligned Content */}
      
    </div>
  );
};

// PropTypes validation for the component props
EventListing.propTypes = {
  eventData: PropTypes.object.isRequired, // Event data should be an object
  onEdit: PropTypes.func.isRequired,      // onEdit should be a function to handle editing
};

export default EventListing;
