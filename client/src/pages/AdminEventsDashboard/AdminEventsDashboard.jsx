import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventListing from '../../components/EventListing/EventListing';
import './AdminEventsDashboard.css';

const AdminEventsDashboard = () => {
  const [eventsList, setEventsList] = useState([]); // Use "eventsList" instead of "events"
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEventsList(response.data.events); // Update with "eventsList"
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    alert('Add Event functionality to be implemented.');
  };

  // Filter the eventsList based on the search term
  const filteredEvents = eventsList.filter((eventItem) =>
    eventItem.event_name.toLowerCase().includes(searchTerm.toLowerCase()) // Use "eventItem" instead of "event"
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          {/* Search Input Field */}
          <input
            type="text"
            placeholder="Search events..."
            className="admin-dashboard-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          />
          {/* Add Event Button */}
          <button className="admin-dashboard-btn" onClick={handleAddEvent}>
            + Add Event
          </button>
        </div>

        {/* Container for Event Listings */}
        <div className="admin-dashboard-events-container">
          <div className="admin-dashboard-events-list">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((eventItem) => (
                <EventListing key={eventItem.event_id} eventData={eventItem} /> // Use "eventItem" as the key
              ))
            ) : (
              <p>No events found matching your search. Click "Add Event" to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsDashboard;
