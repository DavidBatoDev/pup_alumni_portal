// src/components/EventAuth/EventAuth.jsx

import React, { useState, useRef, useEffect } from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import EventsFilterSection from '../EventsFilterSection/EventsFilterSection';
import './EventAuth.css';
import searchIcon from "../../assets/svgs/search-outline.svg";
import menuIcon from "../../assets/svgs/menu-outline.svg";

const EventAuth = ({ events }) => {
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
  const filterRef = useRef(null);

  const toggleFilterSection = () => setIsFilterSectionVisible(!isFilterSectionVisible);

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsFilterSectionVisible(false);
    }
  };

  useEffect(() => {
    if (isFilterSectionVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterSectionVisible]);

  return (
    <div className="container">
      <div className="events-card-container card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 event-header">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for an event"
              aria-label="Search for an event"
            />
            <button className="btn btn-outline-secondary">
              <img className="search-icon" src={searchIcon} alt="Search Icon" />
            </button>
          </div>

          <div className="filter-event-wrapper">
            <h3 className="text-muted">Upcoming Events: <span className="text-danger">{events.length}</span></h3>
            <div className="filter-search-section" onClick={toggleFilterSection}>
              <img src={menuIcon} alt="Menu Icon" />
              <div className="filter-search">Filter</div>
            </div>
          </div>
        </div>

        {/* Event Listings */}
        <div className="row">
          {events.map((event, index) => (
            <div key={index} className="col-12">
              <UserEventListing eventData={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Section Overlay */}
      {isFilterSectionVisible && (
        <div ref={filterRef} className={`filter-section-overlay ${isFilterSectionVisible ? 'slide-in' : ''}`}>
          <EventsFilterSection />
        </div>
      )}

      {/* Optional Overlay */}
      {isFilterSectionVisible && (
        <div className="overlay-background" onClick={() => setIsFilterSectionVisible(false)}></div>
      )}
    </div>
  );
};

export default EventAuth;
