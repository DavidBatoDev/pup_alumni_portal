// src/components/EventAuth/EventAuth.jsx

import React from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import './EventAuth.css'; // Custom CSS
import searchIcon from "../../assets/svgs/search-outline.svg"; // Update with the correct path
import eventImg from '../../assets/images/eventimage2.jpg'; // Update with the correct path

const EventAuth = () => {
  const eventsData = [
    {
      event_date: '2024-09-18',
      image: eventImg, // Replace with actual image paths
      title: 'PUP Alumni Homecoming 2024',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    },
    {
      event_date: '2024-09-18',
      image: eventImg, // Replace with actual image paths
      title: 'PUP Cultural Night',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Social · Cultural Performances · Food Stalls · Art Exhibits · Live Music',
      type: 'Face-to-Face',
      event_id: 2
    },
    {
      event_date: '2024-09-18',
      image: eventImg, // Replace with actual image paths
      title: 'PUP Cultural Night',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Social · Cultural Performances · Food Stalls · Art Exhibits · Live Music',
      type: 'Face-to-Face',
      event_id: 2
    },
    {
      event_date: '2024-09-18',
      image: eventImg, // Replace with actual image paths
      title: 'PUP Cultural Night',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Social · Cultural Performances · Food Stalls · Art Exhibits · Live Music',
      type: 'Face-to-Face',
      event_id: 2
    },
    {
      event_date: '2024-09-18',
      image: eventImg, // Replace with actual image paths
      title: 'PUP Cultural Night',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Social · Cultural Performances · Food Stalls · Art Exhibits · Live Music',
      type: 'Face-to-Face',
      event_id: 2
    }
  ];

  const handleEditEvent = (id) => {
    console.log(`Editing event with ID: ${id}`);
    // Add your edit event functionality here
  };

  return (
    <div className="container my-5">
      {/* Search Bar and Upcoming Events */}
      <div className="events-card-container card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 event-header">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for an event"
              aria-label="Search for an event"
            />
            <div className="btn btn-outline-secondary">
              <img className="search-icon" src={searchIcon} alt="Search Icon" />
            </div>
          </div>
          {/* Dynamically display the event count */}
          <h3 className="text-muted">Upcoming Events: <span className="text-danger">{eventsData.length}</span></h3>
        </div>

        {/* Map over the eventsData and render EventListing */}
        <div className="row">
          {eventsData.map((event, index) => (
            <div key={index} className="col-12 mb-4">
              <UserEventListing eventData={event}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventAuth;
