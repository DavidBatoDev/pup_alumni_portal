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
  const [showTable, setShowTable] = useState(false);  // Toggle state for the table

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
        // set the event data except the registered alumni

        setEventData({
          event_id: eventResponse.data.event.event_id,
          event_name: eventResponse.data.event.event_name,
          event_date: eventResponse.data.event.event_date,
          location: eventResponse.data.event.location,
          type: eventResponse.data.event.type,
          category: eventResponse.data.event.category,
          description: eventResponse.data.event.description
        })
        console.log('Event Information: ', eventResponse.data.event);
        
        const participantsResponse = await axios.get(`/api/admin/event/${eventId}/registered-alumni`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Participants Information: ', participantsResponse.data);

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

  // Function to export participant data as CSV
  const exportAsCSV = () => {
    if (participantData.length === 0) return;

    // Prepare CSV headers
    const headers = ['#', 'ID', 'First Name', 'Last Name', 'Email', 'Phone Number', 'Graduation Year', 'Registration Date'];
    
    // Map participant data into rows
    const csvRows = participantData.map((participant, index) => [
      index + 1,
      participant.alumni_id,
      participant.first_name,
      participant.last_name,
      participant.email,
      participant.phone_number || 'None Provided',
      participant.graduation_year,
      new Date(participant.registration_date).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventData.event_name}_${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

   // Toggle table visibility
   const toggleTableVisibility = () => {
    setShowTable(prev => !prev);
  };

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
          
          {/* Table and Export Button */}
          <div className='d-flex justify-content-between align-items-center'>
            <h2 className='survey-info-subtitle'>Participants</h2>
            <div className="d-flex gap-2">
              {/* Show Table Toggle Button */}
              <button className="btn btn-secondary" onClick={toggleTableVisibility}>
                {showTable ? 'Hide Table' : 'Show Table'}
              </button>
              <button className='btn export-as-csv-btn' onClick={exportAsCSV}>Export as CSV</button>
            </div>
          </div>

          {showTable && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpecificEvent;
