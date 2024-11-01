import React, { useState, useEffect } from 'react';
import './AdminSpecificEvent.css';
import axios from 'axios';

import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import AdminEventsFormModal from '../../components/AdminEventsFormModal/AdminEventsFormModal';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';


const AdminSpecificEvent = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [participantData, setParticipantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formattedEventData, setFormattedEventData] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Fetch event details and open modal for editing
  const handleEditEvent = (eventId) => {
    setIsEditing(true);
    setCurrentEventId(eventId);
    setShowModal(true);
  };

  useEffect(() => {
    if (eventData) {
      // Format the event date and create a list of details
      const formattedData = [
        { label: 'Date', value: new Date(eventData.event_date).toLocaleDateString() },
        { label: 'Location', value: eventData.location },
        { label: 'Type', value: eventData.type },
        { label: 'Category', value: `${eventData.category} Category` }
      ];
      setFormattedEventData(formattedData);
    }
  }, [eventData]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {

        setLoading(true);
        const token = localStorage.getItem('token');

        const eventResponse = await axios.get(`/api/event/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEventData(eventResponse.data.event);
        console.log('Event Information: ', eventResponse.data.event);

        const participantsResponse = await axios.get(`/api/admin/event/${eventId}/registered-alumni`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setParticipantData(participantsResponse.data.registered_alumni);

        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching event data:', error);
        setAlert({ type: 'error', message: 'Error fetching event data' });
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [eventId, updateSuccess]);

  return (
    <div className='admin-specific-event'>
      {alert && <CustomAlert type={alert.type} message={alert.message} onClose={() => { setAlert({ type: '', severity: '' }) }} />}
      {loading && <CircularLoader />}

      <AdminSidebar />

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

      <div className="admin-specific-event-container">
        <div className="admin-specific-event-content">
          <div className='admin-specific-event-info'>
            <div className='d-flex flex-row justify-content-between align-content-end'>
              <div className='d-flex flex-row gap-2'>
                <h1 className='admin-specific-event-title'>{eventData?.event_name}</h1>
                <i className="edit-btn btn btn-light rounded-circle fa-regular fa-xl fa-pen-to-square" onClick={() => handleEditEvent(eventData.event_id)}></i>
              </div>
              <Link to="/admin/events" style={{ textDecoration: 'none' }}><i className="back-btn btn btn-light fa-solid fa-angle-left rounded-circle"></i></Link>
            </div>

            <div className="admin-specific-event-details-container" style={{ display: 'flex', gap: '1rem' }}>
              {formattedEventData.map((detail, index) => (
                <span key={index} className="admin-specific-event-details">
                  {detail.label}: {detail.value}
                </span>
              ))}
            </div>
            <p className='admin-specific-event-description' dangerouslySetInnerHTML={{__html: eventData?.description}}/>
          </div>
          {/* Table of Participants */}
          <div className='table-responsive'>
            <table className='table table-striped table-hover'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>ID</th>
                  <th scope='col'>First Name</th>
                  <th scope='col'>Last Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone Number</th>
                  <th scope='col'>Graduation Year</th>
                  <th scope='col'>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {participantData.length > 0 ?
                  (participantData.map((participant, index) => (
                    <tr key={index}>
                      <th scope='row'>{index + 1}</th>
                      <td>{participant.alumni_id}</td>
                      <td>{participant.first_name}</td>
                      <td>{participant.last_name}</td>
                      <td>{participant.email}</td>
                      <td>{participant.phone_number || 'None Provided'}</td>
                      <td>{participant.graduation_year}</td>
                      <td>{new Date(participant.registration_date).toLocaleDateString()}</td>
                    </tr>
                  )))
                  : <tr><td colSpan='8' className='text-center'>No Participants Registered</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};


export default AdminSpecificEvent;
