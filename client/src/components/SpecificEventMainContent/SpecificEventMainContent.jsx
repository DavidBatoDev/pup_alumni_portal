import React from 'react';
import './SpecificEventMainContent.css';

const SpecificEventMainContent = ({ title, details, date, venue }) => {
  return (
    <div className="specific-event-details-container">
      <div className="specific-event-details">
        {/* About Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>About {title}</h1>
            <button className="rsvp-btn d-flex">RSVP NOW</button>
          </div>
          <p className="specific-event-description">{details}</p>
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
