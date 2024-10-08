// src/components/EventAuth/EventAuth.jsx

import React, { useState, useRef, useEffect } from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import EventsFilterSection from '../EventsFilterSection/EventsFilterSection';
import './EventAuth.css';
import searchIcon from "../../assets/svgs/search-outline.svg";
import menuIcon from "../../assets/svgs/menu-outline.svg";

const EventAuth = ({ events }) => {
  // Filter sidebar state management
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false); // Controls visibility of the filter overlay
  const [maxVisibleCategories, setMaxVisibleCategories] = useState(4); // State to track max visible categories based on screen size

  const filterRef = useRef(null);
  const containerRef = useRef(null);

  // Available categories
  const categories = ['Career', 'Social', 'Science', 'Computer'];

  // Update the max visible categories based on screen width
  const updateMaxVisibleCategories = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 400) {
      setMaxVisibleCategories(1); // Show only 1 category for very small screens
    } else if (screenWidth < 600) {
      setMaxVisibleCategories(2); // Show only 2 categories for small screens
    } else if (screenWidth < 768) {
      setMaxVisibleCategories(3); // Show 3 categories for medium screens
    } else {
      setMaxVisibleCategories(4); // Show all categories for larger screens
    }
  };

  useEffect(() => {
    updateMaxVisibleCategories();
    window.addEventListener('resize', updateMaxVisibleCategories);

    return () => {
      window.removeEventListener('resize', updateMaxVisibleCategories);
    };
  }, []);

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

  // State to track active filter categories (use a Set to store active categories)
  const [activeFilters, setActiveFilters] = useState(new Set());

  const handleFilterClick = (category) => {
    const newActiveFilters = new Set(activeFilters);
    if (newActiveFilters.has(category)) {
      newActiveFilters.delete(category); // Remove if already active
    } else {
      newActiveFilters.add(category); // Add if not active
    }
    setActiveFilters(newActiveFilters); // Update state with new set
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="events-card-container card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 event-header">
          {/* Search Bar */}
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

          {/* Categories and Filter Button */}
          <div className="filter-event-wrapper">
            {/* Render Filter Categories */}
            <div className="filter-search-categories">
              {categories.slice(0, maxVisibleCategories).map((category) => (
                <div
                  key={category}
                  className={`filter-search ${activeFilters.has(category) ? 'active' : ''}`}
                  onClick={() => handleFilterClick(category)}
                >
                  {category}
                </div>
              ))}
            </div>

            {/* Filter Menu Icon - Toggle Filter Overlay */}
            <div className="filter-search-section" onClick={toggleFilterSection}>
              <img src={menuIcon} alt="Menu Icon" />
              <div className="filter-search">All</div>
            </div>
          </div>

          {/* Upcoming Events Count */}
          <div className="filter-event-wrapper">
            <h3 className="text-muted">
              Upcoming Events: <span className="text-danger">{events.length}</span>
            </h3>
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

      {/* Filter Section Overlay - Slides in from the left */}
      {isFilterSectionVisible && (
        <div ref={filterRef} className={`filter-section-overlay ${isFilterSectionVisible ? 'slide-in' : ''}`}>
          <EventsFilterSection />
        </div>
      )}

      {/* Optional Overlay Background */}
      {isFilterSectionVisible && (
        <div className="overlay-background" onClick={() => setIsFilterSectionVisible(false)}></div>
      )}
    </div>
  );
};

export default EventAuth;
