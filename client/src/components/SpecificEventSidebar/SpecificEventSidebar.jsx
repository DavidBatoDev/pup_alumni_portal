import React from 'react';
import Calendar from '../../assets/svgs/calendar-outline.svg';
import Clock from '../../assets/svgs/time-outline.svg';
import People from '../../assets/svgs/people-outline.svg';
import Location from '../../assets/svgs/location-outline.svg';
import './SpecificEventSidebar.css';

const SpecificEventSidebar = ({ daysToGo, date, participants, venue, dateAnnounced, tags, organizers, heldBy, dressCode }) => {
  return (
    <aside className="specific-event-sidebar">
      <div className="sidebar-card">
        <div className="general-section">
          {/* Existing event date and details structure */}
          <div className="event-date-wrapper">
            <img src={Clock} alt="Clock Icon" />
            <h2>{daysToGo}</h2>
            <div className="days-to-go">
              <div className='event-date-daystogo'>days</div>
              <div className='event-date-daystogo'>to go</div>
            </div>
          </div>

          <div className="event-date-wrapper">
            <img src={Calendar} alt="Calendar Icon" />
            <div className="date-container d-flex flex-column">
              <div>{date}</div>
              <div>Duration: 1 day</div>
            </div>
          </div>

          <div className="event-date-wrapper">
            <img src={People} alt="People Icon" />
            <div className="date-container d-flex flex-column">
              <div>{participants} Participants</div>
              <div>(RSVP)</div>
            </div>
          </div>

          <div className="event-date-wrapper">
            <img src={Location} alt="Location Icon" />
            <div className="date-container d-flex flex-column">
              <div>{venue}</div>
            </div>
          </div>
        </div>

        <div className="additional-details">
          <div className="event-date-wrapper flex-column justify-content-start">
            <div><strong>Date Announced:</strong></div>
            <div>{dateAnnounced}</div>
          </div>

          <div className="event-date-wrapper flex-column justify-content-start">
            <div><strong>Held by:</strong></div>
            <div>{heldBy}</div>
          </div>

          <div className="event-date-wrapper flex-column justify-content-start">
            <div><strong>Organized by:</strong></div>
            <div>{organizers}</div>
          </div>

          <div className="event-date-wrapper flex-column justify-content-start">
            <div><strong>Dress Code:</strong></div>
            <div>{dressCode}</div>
          </div>

          {/* Using join to format the tags with space or commas */}
          <div className="event-date-wrapper flex-column justify-content-start">
            <div><strong>Tags:</strong></div>
            <div className="tags-container">
              {/* Convert tags array to a string with spaces */}
              <div className="tags">
                {tags.join(", ")}
              </div>
            </div>
          </div>
        </div>

        <div className="additional-details">
            <div><strong>Share Event:</strong></div>
            <a className="share-icons">
              <i class="fa fa-share" aria-hidden="true"></i>
              <i className="fab fa-facebook-square"></i>
              <i className="fab fa-x-twitter"></i>
            </a>
        </div>
      </div>
    </aside>
  );
};

export default SpecificEventSidebar;
