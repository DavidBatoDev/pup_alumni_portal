// src/pages/AdminSurveyDashboard/AdminSurveyDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import SurveyListing from '../../components/SurveyListing/SurveyListing';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import './AdminSurveyDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminSurveyDashboard = () => {
  const navigate = useNavigate();
  const [surveysList, setSurveysList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', severity: '' }); // Unified state for alerts

  // Fetch surveys when the component mounts
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/surveys', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSurveysList(response.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load surveys. Please try again.';
        setStatus({ message: errorMessage, severity: 'error' }); // Set error message with severity
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Close the alert by resetting status
  const handleCloseAlert = () => setStatus({ message: '', severity: '' });

  // Filter surveys based on the search term
  const filteredSurveys = surveysList.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-survey-dashboard">
      {loading && <CircularLoader />}

      {/* Display CustomAlert component for any alerts */}
      {status.message && (
        <CustomAlert
          severity={status.severity}
          message={status.message}
          onClose={handleCloseAlert}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="admin-survey-dashboard-content">
        {/* Header Section */}
        <div className="admin-survey-dashboard-header">
          <input
            type="text"
            placeholder="Search surveys..."
            className="admin-survey-dashboard-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="admin-survey-dashboard-btn" onClick={() => navigate('/admin/create-survey')}>
            + Add Survey
          </button>
        </div>

        {/* Container for Survey Listings */}
        <div className="admin-survey-dashboard-surveys-container">
          <div className="admin-survey-dashboard-surveys-list">
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => (
                <SurveyListing key={survey.survey_id} surveyData={survey} />
              ))
            ) : (
              <div className='no-survey-created-message-container'>
                <h3 className="text-center">No surveys found.</h3>
                <p className='text-center'>
                  You have not created any surveys yet. Click the button below to create a new survey.
                </p>
                <button className="btn btn-danger" onClick={() => navigate('/admin/create-survey')}>
                  Create Survey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyDashboard;
