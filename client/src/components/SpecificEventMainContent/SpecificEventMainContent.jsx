import React from 'react';
import './SpecificEventMainContent.css';

const SpecificEventMainContent = ({ title, details, schedule, guidelines, date, venue }) => {
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
          
          {/* Schedule of Activities */}
          <p className='mt-3'><strong>Schedule of Activities:</strong></p>
          {/* Render each schedule item in a separate paragraph */}
          <div className="event-schedule">
            {schedule.map((item, index) => (
              <p key={index} className="schedule-item">{item}</p>
            ))}
          </div>
        </div>

        {/* Guidelines Section */}
        {guidelines && (
          <div className="specific-event-details-wrapper">
            <div className="details-header">
                <h1>Guidelines</h1>
            </div>
          
            {/* Render each guideline item with separate breaks */}
            <div className="event-guidelines">
              {guidelines.map((guideline, index) => (
                <p key={index} className="guideline-item">{guideline}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificEventMainContent;
