import React from 'react';
import PropTypes from 'prop-types';
import './UserEventListing.css';
import fallbackImage from '../../assets/images/eventimage1.png';
import { Link } from 'react-router-dom';

const UserEventListing = ({ eventData }) => {
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const formattedTitle = eventData?.event_name.replace(/\s+/g, '-');

  console.log(eventData);

  // Truncate the description to a maximum of 200 characters
  const truncatedDescription =
    eventData?.description.length > 200
      ? `${eventData.description.substring(0, 200)}...`
      : eventData.description;

  return (
    <div className="event-listing-auth">
      {/* Date Section */}
      <div className="event-date-auth-section">
        <div className="event-date-month-auth">{month}</div>
        <div className="event-date-day-auth">{day}</div>
      </div>

      {/* Event Details */}
      <div className="event-image-and-details-auth">
        {/* Event Image */}
        <div className="event-image-container-auth">
          <img
            src={eventData.photos[0].photo_path || fallbackImage}
            alt={eventData.event_name || 'Event Image'}
            className="event-image-auth"
          />
        </div>

        {/* Event Information */}
        <div className="event-details-auth">
          <h5 className="event-title-auth">{eventData?.event_name}</h5>
          <p className="event-info-listing-auth">
            <strong>{eventData?.location}</strong> | <span>{eventDate.toDateString()}</span>
          </p>
          <p className="event-description-auth">{truncatedDescription}</p>
          <div className="event-additional-info-auth">
            <span className="event-type-auth">{eventData.type}</span>
            <Link to={`/events/${eventData?.event_id}`} className="btn more-info">
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

UserEventListing.propTypes = {
  eventData: PropTypes.object.isRequired,
};

export default UserEventListing;
