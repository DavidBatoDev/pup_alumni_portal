import React from 'react';
import PropTypes from 'prop-types';
import './UserEventListing.css';
import fallbackImage from '../../assets/images/eventimage1.png';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const UserEventListing = ({ eventData }) => {
  const { user } = useSelector(state => state.user);
  const eventDate = new Date(eventData.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const formattedTitle = eventData?.event_name.replace(/\s+/g, '-');

  const eventImageRef = useRef();
  const eventDateInfoRef = useRef();


  const updateDatePosition = () => {
    if (eventImageRef.current && eventDateInfoRef.current) {
      const imageRect = eventImageRef.current.getBoundingClientRect();
      eventDateInfoRef.current.style.height = `${imageRect.height}px`;
    }
  };

  useEffect(() => {
    const handleImageLoad = () => {
      updateDatePosition();
    };

    const imageElement = eventImageRef.current;
    if (imageElement) {
      imageElement.addEventListener('load', handleImageLoad);
    }

    window.addEventListener('resize', updateDatePosition);

    return () => {
      if (imageElement) {
        imageElement.removeEventListener('load', handleImageLoad);
      }
      window.removeEventListener('resize', updateDatePosition);
    };
  }, []);

  useEffect(() => {
    updateDatePosition();
  }), [eventData];

  // Truncate the description to a maximum of 150 characters
  const truncatedDescription =
    eventData?.description?.length > 150
      ? `${eventData.description.substring(0, 150)}...`
      : eventData.description || '';

  return (
    <div className="event-listing-auth">
      {/* Date Section */}
      <div ref={eventDateInfoRef} className="event-date-auth-section d-flex flex-md-column flex-row gap-3 gap-md-0 justify-content-start justify-content-md-center  align-items-end align-items-md-center gap-1 px-md-5 px-3">
        <div className="event-date-month-auth p-0 m-0">{month}</div>
        <div className="event-date-day-auth p-0 m-0">{day}</div>
      </div>

      {/* Event Details */}
      <div className="d-flex w-100 event-details align-items-center flex-md-row flex-column gap-3">
        {/* Event Image */}

        <Link className="event-image-container-auth text-decoration-none" ref={eventImageRef} to={`/events/${eventData?.event_id}`}>
          <img
            src={eventData?.photos[0]?.photo_path || fallbackImage}
            // src={fallbackImage}
            alt={eventData?.event_name.substring(0, 5) || 'Event Image'}
            className="event-image-auth"
          />
        </Link>

        {/* Event Information */}
        <div className="event-information d-flex flex-column w-100">
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
