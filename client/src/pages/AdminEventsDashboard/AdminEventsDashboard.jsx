import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventListing from '../../components/EventListing/EventListing';
import AdminEventsFormModal from '../../components/AdminEventsFormModal/AdminEventsFormModal';
import './AdminEventsDashboard.css';
import { useMediaQuery } from 'react-responsive';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import 'react-quill/dist/quill.snow.css'; // Import styles for Quill
import CustomAlert from '../../components/CustomAlert/CustomAlert';

const AdminEventsDashboard = () => {
  const [eventsList, setEventsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [error, setError] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const onClearError = () => {
    setError(null);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        setEventsList(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [updateSuccess]);


  // Open modal for adding a new event
  const handleAddEvent = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    console.log('adding event');
    setShowModal(true);
  };


  // Fetch event details and open modal for editing
  const handleEditEvent = (eventId) => {
    setIsEditing(true);
    setCurrentEventId(eventId);
    console.log('editing event id:', eventId);
    setShowModal(true);
  };

  const filteredEvents = eventsList.filter((eventItem) =>
    eventItem.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {error && <CustomAlert message={error} severity='error' onClose={onClearError} />}
      {loading && <CircularLoader />}

      <AdminSidebar />

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

        <div className="admin-dashboard-events-container">
          <div className="admin-dashboard-events-list">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((eventItem) => (
                <EventListing key={eventItem.event_id} eventData={eventItem} onEdit={handleEditEvent} />
              ))
            ) : (
              <div className="no-events-created-message-container">
                <h3 className="text-center">No Events Found.</h3>
                <p className="text-center">You have not added any events yet. Click the button below to add an event.</p>
                <button className="btn btn-danger" onClick={handleAddEvent}>
                  Add Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminEventsFormModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        isEditing={isEditing}
        currentEventId={currentEventId}
        eventsList={eventsList}
        setEventsList={setEventsList}
        setUpdateSuccess={setUpdateSuccess}
        isMobile={isMobile}
      />

    </div>
  );
};

export default AdminEventsDashboard;
