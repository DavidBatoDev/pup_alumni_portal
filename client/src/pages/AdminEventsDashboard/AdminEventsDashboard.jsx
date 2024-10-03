import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventListing from '../../components/EventListing/EventListing';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import './AdminEventsDashboard.css';
import { useMediaQuery } from 'react-responsive';
import CircularLoader from '../../components/CircularLoader/CircularLoader';

const AdminEventsDashboard = () => {
  const [eventsList, setEventsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
  const [currentEventId, setCurrentEventId] = useState(null); // Track current event ID being edited
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    event_date: '',
    location: '',
    description: '',
  });

  console.log('eventsList:', eventsList);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        setEventsList(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Open modal for adding a new event
  const handleAddEvent = () => {
    setIsEditing(false); // Set to false for adding a new event
    setNewEvent({
      event_name: '',
      event_date: '',
      location: '',
      description: '',
    });
    setShowModal(true);
  };

  // Fetch event details and open modal for editing
  const handleEditEvent = async (eventId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/event/${eventId}`);
      const eventDetails = response.data.event;

      // Populate the form fields with the event data
      setNewEvent({
        event_name: eventDetails.event_name,
        event_date: eventDetails.event_date,
        location: eventDetails.location,
        description: eventDetails.description,
      });
      setCurrentEventId(eventId);
      setIsEditing(true); // Set to true for editing mode
      setShowModal(true); // Open the modal
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setLoading(false);
    }
  };

  // Save or update the event
  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      if (isEditing) {
        // Update existing event
        const response = await axios.put(`/api/admin/event/${currentEventId}`, newEvent, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          // Update event in the list, and sort by event date
          const updatedEventList = eventsList.map((event) =>
            event.event_id === currentEventId ? { ...event, ...newEvent } : event
          );
          updatedEventList.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
          setEventsList(updatedEventList);
        }
      } else {
        // Save a new event
        const response = await axios.post('/api/admin/event', newEvent, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 201) {
          // Save event in the list, and sort by event date
          const newEvent = response.data.event;
          setEventsList((prevList) => [...prevList, newEvent]);
        }
      }
      setLoading(false);
      setShowModal(false);
      setNewEvent({ event_name: '', event_date: '', location: '', description: '' }); // Reset form fields
    } catch (error) {
      console.error('Error saving event:', error);
      setLoading(false);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/event/${currentEventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        // Remove event from the list
        const updatedEventList = eventsList.filter((event) => event.event_id !== currentEventId);
        setEventsList(updatedEventList);
        setShowModal(false); // Close the modal
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });

  const filteredEvents = eventsList.filter((eventItem) =>
    eventItem.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {loading && <CircularLoader />}

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <input
            type="text"
            placeholder="Search events..."
            className="admin-dashboard-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="admin-dashboard-btn" onClick={handleAddEvent}>
            + Add Event
          </button>
        </div>

        {/* Container for Event Listings */}
        <div className="admin-dashboard-events-container">
          <div className="admin-dashboard-events-list">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((eventItem) => (
                <EventListing key={eventItem.event_id} eventData={eventItem} onEdit={handleEditEvent} />
              ))
            ) : (
              <p>No events found matching your search. Click "Add Event" to create one.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Event */}
      <ModalContainer
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        title={isEditing ? 'Edit Event' : 'Add New Event'}
        isMobile={isMobile}
      >
        <form className="add-event-form">
          <label>
            Event Name:
            <input
              type="text"
              name="event_name"
              value={newEvent.event_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Event Date:
            <input
              type="date"
              name="event_date"
              value={newEvent.event_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleChange}
              required
            />
          </label>

          {/* Save/Update Event Button */}
          <button type="button" className="save-event-btn" onClick={handleSaveEvent}>
            {isEditing ? 'Update Event' : 'Save Event'}
          </button>

          {/* Delete Event Button (only show when editing) */}
          {isEditing && (
            <button type="button" className="delete-event-btn" onClick={handleDeleteEvent}>
              Delete Event
            </button>
          )}
        </form>
      </ModalContainer>
    </div>
  );
};

export default AdminEventsDashboard;
