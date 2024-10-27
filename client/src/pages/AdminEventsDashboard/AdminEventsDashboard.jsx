import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import EventListing from '../../components/EventListing/EventListing';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import './AdminEventsDashboard.css';
import { useMediaQuery } from 'react-responsive';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for Quill
import CustomAlert from '../../components/CustomAlert/CustomAlert';

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

  // validation fields
  const [validation, setValidation] = useState({
    event_name: true,
    event_date: true,
    location: true,
    description: true,
    type: true,
    category: true,
    organization: true,
  });

  const resetValidation = () => {
    setValidation({
      event_name: true,
      event_date: true,
      location: true,
      description: true,
      type: true,
      category: true,
      organization: true,
    });
  };

  const validateEventDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    return selectedDate >= currentDate;
  };

  const validateDescription = (description) => {
    return description.trim() !== '' && description.length >= 30;
  };

  const validateFields = () => {
    const newValidation = {
      event_name: newEvent.event_name.trim() !== '',
      event_date: validateEventDate(newEvent.event_date),
      location: newEvent.location.trim() !== '',
      description: validateDescription(newEvent.description),
      type: newEvent.type.trim() !== '',
      category: newEvent.category.trim() !== '',
      organization: newEvent.organization.trim() !== '',
    };

    setValidation(newValidation);
    return Object.values(newValidation).every((value) => value === true);
  };

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
    resetValidation();
    setShowModal(true);
  };

  
  // handlePhotoChange function
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setTempPhotos((prevPhotos) => [...prevPhotos, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  const handleRemovePhoto = (index) => {
    const photoIdToDelete = specificEventPhotoIds[index];
    setPhotosToDelete((prevToDelete) => [...prevToDelete, photoIdToDelete]);
    setTempPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  // Fetch event details and open modal for editing
  const handleEditEvent = async (eventId) => {
    setError(null);
    try {
      setLoading(true);
      console.log('Editing event:', eventId);
      const response = await axios.get(`/api/events/${eventId}`);
      const eventDetails = response.data.event;

      const existingPhotoUrls = eventDetails.photos.map((photo) => photo.photo_path);
      const existingPhotoIds = eventDetails.photos.map((photo) => photo.photo_id);

      console.log("responseEvent", eventDetails);

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
      setPhotosToDelete([]);

      setCurrentEventId(eventId);
      setIsEditing(true);
      resetValidation();
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  // Save or update the event
  const handleSaveEvent = async () => {
    setUpdateSuccess(false);
    setError(null);

    if (!validateFields()) {
      return;
    }

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

      photosToDelete.forEach((photoId) => {
        formData.append('photos_to_delete[]', photoId);
      });

      specificEventPhotoIds.forEach((photoId) => {
        formData.append('existing_photos[]', photoId);
      });

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
      setError(error.response.data.message);
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
    resetValidation();
    setPhotoPreviews([]);
    setTempPhotos([]);
    setSpecificEventPhotoIds([]);
    setPhotosToDelete([]);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({ ...prevState, [name]: value }));
  };

  const filteredEvents = eventsList.filter((eventItem) =>
    eventItem.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {error && <CustomAlert message={error} severity='error' onClose={onClearError}/>}
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
                      <button type="button" className="remove-photo-btn" onClick={() => handleRemovePhoto(index)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="events-form-row events-form-row-1st">
            <label className="events-form-label">
              Event Name:
              <input
                type="text"
                name="event_name"
                className={`events-form-input events-form-name form-control ${validation.event_name ? '' : 'is-invalid'}`}
                value={newEvent.event_name}
                onChange={handleChange}
                required
              />
              <div className='invalid-feedback d-block'>
                {!validation.event_name && "Event name is required."}
              </div>
            </label>

            <label className="events-form-label">
              Event Date:
              <input
                type="date"
                name="event_date"
                className={`events-form-input events-form-date form-control ${validation.event_date ? '' : 'is-invalid'}`}
                value={newEvent.event_date}
                onChange={handleChange}
                required
              />
              <div className='invalid-feedback d-block'>
                {!validation.event_date && "Event date must be in the future."}
              </div>
            </label>
          </div>

          <div className="events-form-row events-form-row-2nd">
            <label className="events-form-label">
              Location:
              <input
                type="text"
                name="location"
                className={`events-form-input events-form-location form-control ${validation.location ? '' : 'is-invalid'}`}
                value={newEvent.location}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback d-block">
                {!validation.location && "Location is required."}
              </div>
            </label>
          </div>

          <div className="events-form-row events-form-row-3rd events-form-row--inline">
            <fieldset className="events-form-fieldset">
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
              <div className="invalid-feedback d-block">
                {!validation.type && "Event type is required."}
              </div>
            </fieldset>

            <label className="events-form-label events-form-label--inline">
              Category:
              <select
              name="category"
              className={`events-form-select px-3 events-form-select-category ${!validation.category ? 'is-invalid' : ''}`}
              value={newEvent.category}
              onChange={handleChange} 
              required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Career">Career</option>
                <option value="Social">Social</option>
                <option value="Faculty">Faculty</option>
                <option value="Student Engagement">Student Engagement</option>
                <option value="Service">Service</option>
              </select>
              <div className="invalid-feedback">
                {!validation.category && "Please select a category."}
              </div>
            </label>
          </div>

          <div className="events-form-row events-form-row-4th">
            <label className="events-form-label">
              Organization:
              <input
              type="text" 
              name="organization"
              className={`events-form-input ${!validation.organization ? 'is-invalid' : ''}`}
              value={newEvent.organization}
              onChange={handleChange}
              required
              />
              <div className="invalid-feedback d-block">
                {!validation.organization && "Organization is required."}
              </div>
            </label>
          </div>

          <div className="events-form-row events-form-row-5th">
            <label className="events-form-label">
              Description:
              <ReactQuill
                theme="snow"
                value={newEvent.description}
                onChange={(value) =>
                  setNewEvent((prevState) => ({ ...prevState, description: value }))
                }
                style={{ height: '150px' }}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ align: [] }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
                formats={[
                  'bold',
                  'italic',
                  'underline',
                  'strike',
                  'list',
                  'bullet',
                  'indent',
                  'align',
                  'link',
                  'image',
                ]}
                className="events-form-quill"
              />
              <div className="invalid-feedback d-block">
                {!validation.description && `A description about this event is required. Minimum of 30 characters (current length: ${newEvent.description.length})`}
              </div>
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
