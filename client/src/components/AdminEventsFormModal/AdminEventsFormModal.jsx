// src/components/EventFormModal/EventFormModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalContainer from '../ModalContainer/ModalContainer';
import CircularLoader from '../CircularLoader/CircularLoader';
import CustomAlert from '../CustomAlert/CustomAlert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for Quillimport './AdminEventsFormModal.css';
import '../../pages/AdminEventsDashboard/AdminEventsDashboard.css';

const AdminEventsFormModal = ({
  showModal,
  closeModal,
  isEditing,
  currentEventId,
  eventsList,
  setEventsList,
  setUpdateSuccess,
  isMobile,
}) => {
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
  const [uploading, setUploading] = useState(false); // Uploading state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state for fetching details

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
    setError(null);
  };

  // Fetch event details if editing
  useEffect(() => {

    const fetchEventDetails = async () => {
      if (isEditing && currentEventId) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/events/${currentEventId}`);
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
          setPhotosToDelete([]);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching event details:', error);
          setError('Failed to fetch event details: ' + error.response.data.message);
          setLoading(false);
        }
      } else {
        resetFormState();
      }
    };

    if (showModal) {
      fetchEventDetails();
      console.log("showModal:", showModal);
    }
  }, [isEditing, currentEventId, showModal]);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({ ...prevState, [name]: value }));
  };

  // handlePhotoChange function
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setTempPhotos((prevPhotos) => [...prevPhotos, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };
  // Handle photo removal
  const handleRemovePhoto = (index) => {
    const photoIdToDelete = specificEventPhotoIds[index];
    setPhotosToDelete((prevToDelete) => [...prevToDelete, photoIdToDelete]);
    setTempPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setSpecificEventPhotoIds((prevIds) => prevIds.filter((_, i) => i !== index));
  };

  // Handle form submission to save or update event
  const handleSaveEvent = async () => {
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
        const updatedEvent = response.data.event;
        if (isEditing) {
          const updatedEventList = eventsList.map((event) =>
            event.event_id === currentEventId ? { ...event, ...updatedEvent } : event
          );
          setEventsList(updatedEventList);
        } else {
          setEventsList((prevList) => [...prevList, updatedEvent]);
        }
        setUpdateSuccess(true);
        closeModal();
        resetFormState();
      }
      setLoading(false);
      setUploading(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response.data.message);
      setLoading(false);
      setUploading(false);
    }
  };

  // Handle event deletion
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
        setUpdateSuccess(true);
        closeModal();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      showModal={showModal}
      closeModal={closeModal}
      title={isEditing ? 'Edit Event' : 'Add New Event'}
      isMobile={isMobile}
    >
      <form className="events-form add-event-form">
        {/* Photo Upload Section */}
        {error && CustomAlert({ message: error, severity: 'error', onClose: () => setError(null) })}
        {uploading || loading && <CircularLoader />}

        <div className="events-form-row events-form-row-photos">
          <label className="events-form-label">
            Upload Photos:
            <input type="file" name="photos" className="events-form-input" multiple onChange={handlePhotoChange} />
          </label>

          <div className="photo-previews-container">
            {photoPreviews.length > 0 &&
              photoPreviews.map((preview, index) => (
                <div key={index} className="photo-preview-wrapper">
                  <img src={preview} alt="Preview" className="photo-preview" />
                  <button type="button" className="remove-photo-btn" onClick={() => handleRemovePhoto(index)}>
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Event Name & Date */}
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
            {!validation.event_name && <div className="invalid-feedback d-block">Event name is required.</div>}
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
            {!validation.event_date && <div className="invalid-feedback d-block">Event date must be in the future.</div>}
          </label>
        </div>

        {/* Location */}
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
            {!validation.location && <div className="invalid-feedback d-block">Location is required.</div>}
          </label>
        </div>

        {/* Type & Category */}
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
            {!validation.type && <div className="invalid-feedback d-block">Event type is required.</div>}
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
            {!validation.category && <div className="invalid-feedback">Please select a category.</div>}
          </label>
        </div>

        {/* Organization */}
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
            {!validation.organization && <div className="invalid-feedback d-block">Organization is required.</div>}
          </label>
        </div>

        {/* Description */}
        <div className="events-form-row events-form-row-5th">
          <label className="events-form-label">
            Description:
            <ReactQuill
              theme="snow"
              value={newEvent.description}
              onChange={(value) => setNewEvent((prev) => ({ ...prev, description: value }))}
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
            {!validation.description && (
              <div className="invalid-feedback d-block">
                A description about this event is required. Minimum of 30 characters (current length:{' '}
                {newEvent.description.length})
              </div>
            )}
          </label>
        </div>

        {/* Buttons */}
        <div className="events-form-row events-form-row-6th events-form-row--buttons">
          <button
            type="button"
            className="events-form-btn save-event-btn"
            onClick={handleSaveEvent}
            disabled={loading || uploading}
          >
            {isEditing ? 'Update Event' : 'Save Event'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="events-form-btn delete-event-btn"
              onClick={handleDeleteEvent}
              disabled={loading}
            >
              Delete Event
            </button>
          )}

        </div>
      </form>
    </ModalContainer>
  );

};

export default AdminEventsFormModal;