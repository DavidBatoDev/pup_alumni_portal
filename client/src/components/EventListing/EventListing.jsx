// EventListing.jsx
import React from 'react';
import './EventListing.css';
import eventImg from '../../assets/images/eventimage2.jpg'; // Update with the appropriate image path

const EventListing = ({ eventData }) => {
  // Extract date information to display it in a specific format
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });

  return (
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
            <strong>{eventData.location}</strong> - {eventData.event_date}
          </p>
          <p className="event-description">{eventData.description}</p>
        </div>
      </div>

      {/* Right-Aligned Content */}
      <div className="event-additional-info">
        <span className="event-type">Face-to-Face</span> {/* Placeholder event type */}
        {/* Placeholder for Edit Icon */}
        <span className="edit-icon">✎</span>
      </div>
    </div>
  );
};

export default EventListing;
