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
  const [isEditing, setIsEditing] = useState(false); 
  const [currentEventId, setCurrentEventId] = useState(null); 
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    event_date: '',
    location: '',
    description: '',
    type: '', 
    category: '', 
    organization: '',
  });

  const [tempPhotos, setTempPhotos] = useState([]); // Store newly uploaded photos
  const [photoPreviews, setPhotoPreviews] = useState([]); // Store preview URLs
  const [specificEventPhotoIds, setSpecificEventPhotoIds] = useState([]); // Store specific event photo IDs
  const [photosToDelete, setPhotosToDelete] = useState([]); // Track photos to delete
  const [uploading, setUploading] = useState(false); 
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
  }, [updateSuccess]);

  // Open modal for adding a new event
  const handleAddEvent = () => {
    setIsEditing(false); 
    setNewEvent({
      event_name: '',
      event_date: '',
      location: '',
      description: '',
      type: '',
      category: '',
      organization: '',
    });
    setTempPhotos([]);
    setPhotoPreviews([]);
    setSpecificEventPhotoIds([]);
    setPhotosToDelete([]);
    setShowModal(true);
  };

  // handlePhotoChange function
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setTempPhotos((prevPhotos) => [...prevPhotos, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  // Remove photo from temporary or existing photos
  const handleRemovePhoto = (index, isExisting) => {
    console.log('Removing photo at index:', specificEventPhotoIds[index]);
    // if (isExisting) {
    //   const photoIdToDelete = specificEventPhotoIds[index]; // Get photo ID of the existing photo
    //   console.log('Photo ID to delete:', photoIdToDelete);
    //   setPhotosToDelete((prevToDelete) => [...prevToDelete, photoIdToDelete]); // Add to photos to delete list
    //   setExistingPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index)); // Remove from UI
    //   setSpecificEventPhotoIds((prevIds) => prevIds.filter((_, i) => i !== index)); // Update specific event photo IDs
    // } else {
      const photoIdToDelete = specificEventPhotoIds[index]; 
      setPhotosToDelete((prevToDelete) => [...prevToDelete, photoIdToDelete]);
      setTempPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
      setPhotoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    // }
  };

  // Fetch event details and open modal for editing
  const handleEditEvent = async (eventId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${eventId}`);
      const eventDetails = response.data.event;

      const existingPhotoUrls = eventDetails.photos.map((photo) => photo.photo_path);
      const existingPhotoIds = eventDetails.photos.map((photo) => photo.photo_id);

      setNewEvent({
        event_name: eventDetails.event_name,
        event_date: eventDetails.event_date,
        location: eventDetails.location,
        description: eventDetails.description,
        type: eventDetails.type,
        category: eventDetails.category,
        organization: eventDetails.organization,
      });

      setPhotoPreviews(existingPhotoUrls); 
      setSpecificEventPhotoIds(existingPhotoIds); 
      setPhotosToDelete([]); // Reset the delete state

      setCurrentEventId(eventId);
      setIsEditing(true);
      setShowModal(true); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setLoading(false);
    }
  };

  // Save or update the event
  const handleSaveEvent = async () => {
    setUpdateSuccess(false);
    try {
      setLoading(true);
      setUploading(true);
      const formData = new FormData();
      formData.append('event_name', newEvent.event_name);
      formData.append('event_date', newEvent.event_date);
      formData.append('location', newEvent.location);
      formData.append('description', newEvent.description);
      formData.append('type', newEvent.type);
      formData.append('category', newEvent.category);
      formData.append('organization', newEvent.organization);

      // Send IDs for photos to delete
      photosToDelete.forEach((photoId) => {
        formData.append('photos_to_delete[]', photoId);
      });

      // Send IDs for existing photos that the user wants to keep
      specificEventPhotoIds.forEach((photoId) => {
        formData.append('existing_photos[]', photoId);
      });

      // Add new photos (files) to the FormData
      tempPhotos.forEach((photo) => {
        formData.append('photos[]', photo);
      });

      const response = isEditing
        ? await axios.post(`/api/admin/update-event/${currentEventId}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        : await axios.post('/api/admin/event', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });

      if (response.status === 200 || response.status === 201) {
        const newEvent = response.data.event;
        if (isEditing) {
          const updatedEventList = eventsList.map((event) =>
            event.event_id === currentEventId ? { ...event, ...newEvent } : event
          );
          setEventsList(updatedEventList);
        } else {
          setEventsList((prevList) => [...prevList, newEvent]);
        }
        setUpdateSuccess(true);
      }

      setLoading(false);
      setShowModal(false);
      resetFormState();
    } catch (error) {
      console.error('Error saving event:', error);
      setLoading(false);
      setUploading(false);
    }
  };

  const resetFormState = () => {
    setNewEvent({
      event_name: '',
      event_date: '',
      location: '',
      description: '',
      type: '',
      category: '',
      organization: '',
    });
    setPhotoPreviews([]);
    setTempPhotos([]);
    setSpecificEventPhotoIds([]);
    setPhotosToDelete([]);
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
        const updatedEventList = eventsList.filter((event) => event.event_id !== currentEventId);
        setEventsList(updatedEventList);
        setShowModal(false);
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

      <ModalContainer
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        title={isEditing ? 'Edit Event' : 'Add New Event'}
        isMobile={isMobile}
      >
        <form className="events-form add-event-form">
          <div className="events-form-row events-form-row-photos">
            <label className="events-form-label">
              Upload Photos:
              <input type="file" name="photos" className="events-form-input" multiple onChange={handlePhotoChange} />
            </label>

            <div className="photo-previews-container">
              {photoPreviews.length > 0 && (
                <>
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="photo-preview-wrapper">
                      <img src={preview} alt="Preview" className="photo-preview" />
                      <button type="button" className="remove-photo-btn" onClick={() => handleRemovePhoto(index, false)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="events-form-row events-form-row-1st">
            <label className="events-form-label events-form-label-name">
              Event Name:
              <input type="text" name="event_name" className="events-form-input events-form-name" value={newEvent.event_name} onChange={handleChange} required />
            </label>

            <label className="events-form-label events-form-label-date">
              Event Date:
              <input type="date" name="event_date" className="events-form-input events-form-date" value={newEvent.event_date} onChange={handleChange} required />
            </label>
          </div>

          <div className="events-form-row events-form-row-2nd">
            <label className="events-form-label events-form-label-location">
              Location:
              <input type="text" name="location" className="events-form-input events-form-location" value={newEvent.location} onChange={handleChange} required />
            </label>
          </div>

          <div className="events-form-row events-form-row-3rd events-form-row--inline">
            <fieldset className="events-form-fieldset events-form-fieldset-type">
              <legend className="events-form-legend">Type:</legend>
              <label className="events-form-radio-label">
                <input type="radio" name="type" value="Face-to-face" className="events-form-radio" checked={newEvent.type === 'Face-to-face'} onChange={handleChange} required />
                Face-to-face
              </label>
              <label className="events-form-radio-label">
                <input type="radio" name="type" value="Virtual" className="events-form-radio" checked={newEvent.type === 'Virtual'} onChange={handleChange} required />
                Virtual
              </label>
              <label className="events-form-radio-label">
                <input type="radio" name="type" value="Hybrid" className="events-form-radio" checked={newEvent.type === 'Hybrid'} onChange={handleChange} required />
                Hybrid
              </label>
            </fieldset>

            <label className="events-form-label events-form-label--inline events-form-category">
              Category:
              <select name="category" className="events-form-select events-form-select-category" value={newEvent.category} onChange={handleChange} required>
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Career">Career</option>
                <option value="Social">Social</option>
                <option value="Faculty">Faculty</option>
                <option value="Student Engagement">Student Engagement</option>
                <option value="Service">Service</option>
              </select>
            </label>
          </div>

          <div className="events-form-row events-form-row-4th">
            <label className="events-form-label">
              Organization:
              <input type="text" name="organization" className="events-form-input" value={newEvent.organization} onChange={handleChange} required />
            </label>
          </div>

          <div className="events-form-row events-form-row-5th">
            <label className="events-form-label">
              Description:
              <textarea name="description" className="events-form-textarea" value={newEvent.description} onChange={handleChange} required />
            </label>
          </div>

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
