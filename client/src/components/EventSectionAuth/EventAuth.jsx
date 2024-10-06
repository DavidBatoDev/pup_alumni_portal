// src/components/EventAuth/EventAuth.jsx

import React, { useState, useRef, useEffect } from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import EventsFilterSection from '../EventsFilterSection/EventsFilterSection';
import './EventAuth.css'; // Custom CSS
import searchIcon from "../../assets/svgs/search-outline.svg"; // Update with the correct path
import eventImg from '../../assets/images/eventimage2.jpg'; // Update with the correct path
import Menu from '../../assets/svgs/menu-outline.svg'; // Update with the correct path

const EventAuth = () => {
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
  const filterRef = useRef(null); // Reference for the filter section

  const eventsData = [
    {
      event_date: '2024-09-18',
      image: eventImg,
      title: 'PUP Alumni Homecoming 2024',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    },

    {
      event_date: '2024-09-18',
      image: eventImg,
      title: 'PUP Cultural Night',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    },

    {
      event_date: '2024-09-18',
      image: eventImg,
      title: 'PUP Alumni Homecoming 2024',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    },

    {
      event_date: '2024-09-18',
      image: eventImg,
      title: 'PUP Alumni Homecoming 2024',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    },

    {
      event_date: '2024-09-18',
      image: eventImg,
      title: 'PUP Alumni Homecoming 2024',
      venue: 'PUP Sta. Mesa, Manila Campus',
      details: 'Reunion · Registration · Welcome Speech · Alumni Awards · Dinner · Entertainment',
      type: 'Face-to-Face',
      event_id: 1
    }
    // Additional event data...
  ];

  const handleEditEvent = (id) => {
    console.log(`Editing event with ID: ${id}`);
  };

  const toggleFilterSection = () => {
    setIsFilterSectionVisible(!isFilterSectionVisible);
  };

  // Function to close the filter section when clicking outside of it
  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsFilterSectionVisible(false); // Close the filter section
    }
  };

  useEffect(() => {
    // Bind the event listener if filter section is visible
    if (isFilterSectionVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterSectionVisible]);

  return (
    <div className="container">
      <div className="events-card-container card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 event-header">
          <div className="input-group" style={{ maxWidth: '100%' }}>
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

          <div className="filter-event-wrapper">
            <h3 className="text-muted">Upcoming Events: <span className="text-danger">{eventsData.length}</span></h3>
            <div className="filter-search-section" onClick={toggleFilterSection}>
              <img src={Menu} alt="Menu Icon" />
              <div className="filter-search">Filter</div>
            </div>
          </div>
        </div>

        {/* Map over the eventsData and render EventListing */}
        <div className="row">
          {eventsData.map((event, index) => (
            <div key={index} className="col-12">
              <UserEventListing eventData={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Render Filter Section with animation */}
      {isFilterSectionVisible && (
        <div ref={filterRef} className={`filter-section-overlay ${isFilterSectionVisible ? 'slide-in' : ''}`}>
          <EventsFilterSection />
        </div>
      )}

      {/* Optional Overlay for clicking outside */}
      {isFilterSectionVisible && (
        <div className="overlay-background" onClick={() => setIsFilterSectionVisible(false)}></div>
      )}
    </div>
  );
};

export default EventAuth;
