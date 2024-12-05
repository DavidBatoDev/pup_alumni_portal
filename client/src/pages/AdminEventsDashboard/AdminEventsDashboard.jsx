import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventListing from '../../components/EventListing/EventListing';
import AdminEventsFormModal from '../../components/AdminEventsFormModal/AdminEventsFormModal';
import './AdminEventsDashboard.css';
import { useMediaQuery } from 'react-responsive';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import 'react-quill/dist/quill.snow.css';
import CustomAlert from '../../components/CustomAlert/CustomAlert';

const AdminEventsDashboard = () => {
  const [eventsList, setEventsList] = useState([]);
  const [inactiveEventsList, setInactiveEventsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showInactive, setShowInactive] = useState(false); // Toggle state

  const [error, setError] = useState(null); 
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const onClearError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        setEventsList(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.response?.data?.message || 'Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchInactiveEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events/inactive');
        setInactiveEventsList(response.data.events);
      } catch (error) {
        console.error('Error fetching inactive events:', error);
        setError(error.response?.data?.error || 'Failed to fetch inactive events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    fetchInactiveEvents();
  }, [updateSuccess]);

  const handleAddEvent = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setShowModal(true);
  };

  const handleEditEvent = (eventId) => {
    setIsEditing(true);
    setCurrentEventId(eventId);
    setShowModal(true);
  };

  const filteredEvents = (showInactive ? inactiveEventsList : eventsList).filter((eventItem) =>
    eventItem.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    setShowInactive(!showInactive);
  };

  return (
    <div className="admin-dashboard">
      {error && <CustomAlert message={error} severity="error" onClose={onClearError} />}
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
          
          {/* Toggle button */}
          <div className="ae-toggle-segmented-control">
            <button
              onClick={() => setShowInactive(false)}
              className={`ae-toggle-option ${!showInactive ? 'active' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setShowInactive(true)}
              className={`ae-toggle-option ${showInactive ? 'active' : ''}`}
            >
              Inactive
            </button>
          </div>

          <div className="admin-dashboard-events-list mt-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((eventItem) => (
                <EventListing key={eventItem.event_id} eventData={eventItem} onEdit={handleEditEvent} />
              ))
            ) : (
              <div className="no-events-created-message-container">
                <h3 className="text-center">No {showInactive ? 'Inactive' : 'Active'} Events Found.</h3>
                {!showInactive && (
                  <>
                    <p className="text-center">You have not added any events yet. Click the button below to add an event.</p>
                    <button className="btn btn-danger" onClick={handleAddEvent}>
                      Add Event
                    </button>
                  </>
                )}
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
        inactiveEventsList={inactiveEventsList}
        setEventsList={setEventsList}
        setInactiveEventsList={setInactiveEventsList}
        setUpdateSuccess={setUpdateSuccess}
        isMobile={isMobile}
      />
    </div>
  );
};

export default AdminEventsDashboard;
