import { useState, useEffect } from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import Navbar from "../../components/Navbar/Navbar";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Events.css";
import EventsFilterSection from "../../components/EventsFilterSection/EventsFilterSection";
import EventAuth from "../../components/EventSectionAuth/EventAuth";
import api from "../../api";
import echo from "../../echo";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import MainFooter from "../../components/MainFooter/MainFooter";

const Events = () => {
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

  useEffect(() => {
    echo.channel('alumni')
      .listen('EventCreated', (data) => {
        console.log(data)
        setEventsData((prevState) => {
          const alreadyExists = prevState.some((e) => e.event_id === data.events.event_id);
          if (alreadyExists) return prevState;
          return [...prevState, data.events];
        });
      });

    return () => {
      echo.leaveChannel('alumni');
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/events");
        setEventsData(response.data.events);
        setFilteredEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to fetch events. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtering logic based on user inputs
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

  // Handle filter updates from child component
  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  // Clear the error message
  const handleClearError = () => setError(null);

  return (
    <div className="events-page">
      {loading && <CircularLoader />}
      <div className="background events-background"></div>
      <Navbar />
      <BannerSmall
        bannerTitle={"Events Page"}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Events", link: "/event" },
        ]}
      />

      {error && (
        <CustomAlert
          message={error}
          severity="error"
          onClose={handleClearError}
        />
      )}

      <div className="events-content glass">
        <div className="event-header">
          <h2>You're MORE than WELCOME to attend.</h2>
          <h5>
            Join us for an exciting lineup of events designed to inspire, connect, and empower.
          </h5>
        </div>
        <div className="events-container container container-fluid d-flex gap-3">
          <EventsFilterSection filters={filters} onFilterChange={handleFilterChange} />
          <EventAuth events={filteredEvents} />
        </div>
      </div>
      <div className="main-footer-wrapper">
        <MainFooter />
      </div>
    </div>
  );
};

export default Events;
