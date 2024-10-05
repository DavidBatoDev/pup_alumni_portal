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
    type: '', // New field
    category: '', // New field
    organization: '', // New field
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
      type: '', // Reset new fields
      category: '',
      organization: '',
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
        type: eventDetails.type, // New field
        category: eventDetails.category, // New field
        organization: eventDetails.organization, // New field
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
      setNewEvent({
        event_name: '',
        event_date: '',
        location: '',
        description: '',
        type: '', // Reset new fields
        category: '',
        organization: '',
      }); // Reset form fields
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
        <div className="admin-events-dashboard-header">
          <input
            type="text"
            placeholder="Search events..."
            className="admin-events-dashboard-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="admin-events-dashboard-btn" onClick={handleAddEvent}>
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
              <div className='no-events-created-message-container'>
                <h3 className="text-center">No Events Found.</h3>
                <p className='text-center'>
                  You have add any events yet. Click the button below to add an event.
                </p>
                <button className="btn btn-danger" onClick={handleAddEvent}>
                  Add Event
                </button>
              </div>
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
        <form className="events-form add-event-form">

          {/* Row 1: Event Name and Event Date */}
          <div className="events-form-row events-form-row-1st">
            <label className="events-form-label events-form-label-name">
              Event Name:
              <input
                type="text"
                name="event_name"
                className="events-form-input events-form-name"
                value={newEvent.event_name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="events-form-label events-form-label-date">
              Event Date:
              <input
                type="date"
                name="event_date"
                className="events-form-input events-form-date"
                value={newEvent.event_date}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Row 2: Location */}
          <div className="events-form-row events-form-row-2nd">
            <label className="events-form-label events-form-label-location">
              Location:
              <input
                type="text"
                name="location"
                className="events-form-input events-form-location"
                value={newEvent.location}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Row 3: Type (Radio Buttons) and Category */}
          <div className="events-form-row events-form-row-3rd events-form-row--inline">
            <fieldset className="events-form-fieldset events-form-fieldset-type">
              <legend className="events-form-legend">Type:</legend>
              <label className="events-form-radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Face-to-face"
                  className="events-form-radio"
                  checked={newEvent.type === 'Face-to-face'}
                  onChange={handleChange}
                  required
                />
                Face-to-face
              </label>
              <label className="events-form-radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Virtual"
                  className="events-form-radio"
                  checked={newEvent.type === 'Virtual'}
                  onChange={handleChange}
                  required
                />
                Virtual
              </label>
              <label className="events-form-radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Hybrid"
                  className="events-form-radio"
                  checked={newEvent.type === 'Hybrid'}
                  onChange={handleChange}
                  required
                />
                Hybrid
              </label>
            </fieldset>

            <label className="events-form-label events-form-label--inline events-form-category">
              Category:
              <select
                name="category"
                className="events-form-select events-form-select-category"
                value={newEvent.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Career">Career</option>
                <option value="Social">Social</option>
                <option value="Faculty">Faculty</option>
                <option value="Student Engagement">Student Engagement</option>
                <option value="Service">Service</option>
              </select>
            </label>
          </div>

          {/* Row 4: Organization */}
          <div className="events-form-row events-form-row-4th">
            <label className="events-form-label">
              Organization:
              <input
                type="text"
                name="organization"
                className="events-form-input"
                value={newEvent.organization}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Row 5: Description */}
          <div className="events-form-row events-form-row-5th">
            <label className="events-form-label">
              Description:
              <textarea
                name="description"
                className="events-form-textarea"
                value={newEvent.description}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Save/Update and Delete Event Buttons */}
          <div className="events-form-row events-form-row-6th events-form-row--buttons">
            <button type="button" className="events-form-btn save-event-btn" onClick={handleSaveEvent}>
              {isEditing ? 'Update Event' : 'Save Event'}
            </button>
            {isEditing && (
              <button type="button" className="events-form-btn delete-event-btn" onClick={handleDeleteEvent}>
                Delete Event
              </button>
            )}
          </div>
        </form>
      </ModalContainer>


    </div>
  );
};

export default AdminEventsDashboard;
