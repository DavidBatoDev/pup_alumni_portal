import React from 'react';
import PropTypes from 'prop-types';
import './UserEventListing.css';
import fallbackImage from '../../assets/images/eventimage1.png';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserEventListing = ({ eventData }) => {
  const { user } = useSelector(state => state.user);
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const formattedTitle = eventData?.event_name.replace(/\s+/g, '-');

  // Truncate the description to a maximum of 150 characters
  const truncatedDescription =
    eventData?.description?.length > 150
      ? `${eventData.description.substring(0, 150)}...`
      : eventData.description || '';

  return (
    <div className="event-listing-auth">
      {/* Date Section */}
      <div className="event-date-auth-section d-flex flex-column justify-content-center align-items-center gap-1 px-5">
        <div className="event-date-month-auth p-0 m-0">{month}</div>
        <div className="event-date-day-auth p-0 m-0">{day}</div>
      </div>

      {/* Event Details */}
      <div className="d-flex event-details align-items-center flex-lg-row flex-column">
        {/* Event Image */}
        <div className="event-image-container-auth">
          <img
            src={eventData?.photos[0]?.photo_path || fallbackImage}
            // src={fallbackImage}
            alt={eventData?.event_name.substring(0, 5) || 'Event Image'}
            className="event-image-auth"
          />
        </div>

        {/* Event Information */}
        <div className="event-information w-auto flex-grow-1 d-flex flex-column flex-grow-1">
          <h5 className="event-title-auth" title={eventData?.event_name}>{eventData?.event_name}</h5>
          <p className="event-info-listing-auth">
            <strong>{eventData?.location}</strong>
            <span>{eventDate.toDateString()}</span>
          </p>
          <p className="event-description-auth d-flex flex-column w-100 wrap-text" dangerouslySetInnerHTML={{ __html: truncatedDescription }} />
        </div>
        <div className="event-info-action d-flex flex-column align-items-center h-100 justify-content-start">
          <span className="event-type-text">{eventData.type}</span>
          <Link to={`/events/${eventData?.event_id}`} className="btn more-info">
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

UserEventListing.propTypes = {
  eventData: PropTypes.object.isRequired,
};

export default UserEventListing;
