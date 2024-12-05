import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage2 from '../../assets/images/eventimage2.jpg';
import './EventHistory.css';
import EventsFilterSection from '../../components/EventsFilterSection/EventsFilterSection';
import EventAuth from '../../components/EventSectionAuth/EventAuth';
import api from '../../api';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import MainFooter from '../../components/MainFooter/MainFooter';

const EventHistory = () => {
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
    types: [],
    categories: [],
    organizations: []
  });
  const [isTabletView, setIsTabletView] = useState(window.innerWidth <= 1024); // Check if screen is tablet size
  const [maxVisibleCategories, setMaxVisibleCategories] = useState(4); // Max number of visible categories

  const updateView = () => {
    const screenWidth = window.innerWidth;
    setIsTabletView(screenWidth <= 1024); // Update state for tablet view
    if (screenWidth < 300) setMaxVisibleCategories(1);
    else if (screenWidth < 400) setMaxVisibleCategories(2);
    else if (screenWidth < 1024) setMaxVisibleCategories(3);
    else setMaxVisibleCategories(4);
  };

  // Add event listener for window resize to update view dynamically
  useEffect(() => {
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false); // Sidebar visibility state
  const filterRef = useRef(null); // Reference for the filter section container

  // Function to toggle the visibility of the filter sidebar
  const toggleFilterSection = () => setIsFilterSectionVisible(!isFilterSectionVisible);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/events/inactive");
        setEventsData(response.data.events);
        setFilteredEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = eventsData.filter(event => {
      const matchesSearchTerm = event?.event_name.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesStartDate = filters.startDate === '' || new Date(event?.event_date) >= new Date(filters.startDate);
      const matchesEndDate = filters.endDate === '' || new Date(event.event_date) <= new Date(filters.endDate);

      const matchesType = filters.types.length === 0 || filters.types.includes(event.type);
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(event.category);
      const matchesOrganization = filters.organizations.length === 0 || filters.organizations.includes(event.organization);

      return matchesSearchTerm && matchesStartDate && matchesEndDate && matchesType && matchesCategory && matchesOrganization;
    });

    setFilteredEvents(filtered);
  }, [filters, eventsData]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleClearError = () => setError(null);

  return (
    <div className="history-event-page">
      {loading && <CircularLoader />}
      <div className="background events-background"></div>
      <Navbar />
      <BannerSmall
        bannerTitle="Past Events"
        bannerImage={bannerImage2}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Event History", link: "/events" }
        ]}
      />
      {error && (
        <CustomAlert
          message={error}
          severity="error"
          onClose={handleClearError}
        />
      )}
      <div className="history-event-content glass">
        <div className="event-header">
          <h2>Recollecting Past Events</h2>
          <h5>Browse through our past events and relive the memories!</h5>
        </div>
        <div className="events-container d-flex gap-3 px-0">
          {!isTabletView && <EventsFilterSection filters={filters} onFilterChange={handleFilterChange} />}
          <EventAuth
            events={filteredEvents}
            isTabletView={isTabletView}
            maxVisibleCategories={maxVisibleCategories}
            toggleFilterSection={toggleFilterSection}
            setFilters={setFilters}
            filters={filters}
            handleFilterChange={handleFilterChange}
            eventHistoryView={true}
          />
        </div>
      </div>
      <div className="main-footer-wrapper">
        <MainFooter />
      </div>

      {/* Filter Section Overlay - Slides in from the left */}
      {isFilterSectionVisible && (
        <div ref={filterRef} className={`filter-section-overlay glass ${isFilterSectionVisible ? 'slide-in' : ''}`}>
          <EventsFilterSection filters={filters} onFilterChange={handleFilterChange} />
        </div>
      )
      }

      {/* Optional Overlay Background */}
      {
        isFilterSectionVisible && (
          <div className="overlay-background" onClick={() => setIsFilterSectionVisible(false)}></div>
        )
      }
    </div >
  );
};

export default EventHistory;
