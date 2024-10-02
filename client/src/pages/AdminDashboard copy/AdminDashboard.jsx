import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventCard from '../../components/EventCard/EventListing';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  console.log(events);

  const handleAddEvent = () => {
    alert('Add Event functionality to be implemented.');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="admin-dashboard-btn" onClick={handleAddEvent}>
            + Add Event
          </button>
        </div>

        {/* Event Cards Container */}
        <div className="admin-dashboard-events-container">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.event_id} event={event} />)
          ) : (
            <p>No events available. Click "Add Event" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
