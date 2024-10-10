import React from 'react';
import Calendar from '../../assets/svgs/calendar-outline.svg';
import Clock from '../../assets/svgs/time-outline.svg';
import People from '../../assets/svgs/people-outline.svg';
import Location from '../../assets/svgs/location-outline.svg';
import './SpecificHistoryEventSidebar.css';

const SpecificHistoryEventSidebar = ({ daysToGo, date, participants, venue, organizers, type }) => {
  return (
    <aside className="specific-event-sidebar">
      <div className="sidebar-card">
        {/* Days to go */}
        <div className="event-date-wrapper">
          <img src={Clock} alt="Clock Icon" />
          <h2>{daysToGo}</h2>
          <div className="days-to-go">
            <div className='event-date-daystogo'>days</div>
            <div className='event-date-daystogo'>ago</div>
          </div>
        </div>

        {/* Event Date */}
        <div className="event-date-wrapper">
          <img src={Calendar} alt="Calendar Icon" />
          <div className="date-container d-flex flex-column">
            <div>{date}</div>
            <div>Duration: 1 day</div>
          </div>
        </div>

        {/* Participants */}
        <div className="event-date-wrapper">
          <img src={People} alt="People Icon" />
          <div className="date-container d-flex flex-column">
            <div>{participants} Participants</div>
            <div>(RSVP)</div>
          </div>
        </div>

        {/* Location */}
        <div className="event-date-wrapper">
          <img src={Location} alt="Location Icon" />
          <div className="date-container d-flex flex-column">
            <div>{venue}</div>
          </div>
        </div>

        {/* Organizer */}
        <div className="event-date-wrapper flex-column justify-content-start">
          <div><strong>Organized by:</strong></div>
          <div>{organizers}</div>
        </div>

        {/* Event Type */}
        <div className="event-date-wrapper flex-column justify-content-start">
          <div><strong>Event Type:</strong></div>
          <div>{type}</div>
        </div>
      </div>
    </aside>
  );
};

export default SpecificHistoryEventSidebar;
