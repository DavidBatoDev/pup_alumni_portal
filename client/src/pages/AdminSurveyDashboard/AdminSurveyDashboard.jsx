// src/pages/AdminSurveyDashboard/AdminSurveyDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import SurveyListing from '../../components/SurveyListing/SurveyListing';
import './AdminSurveyDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminSurveyDashboard = () => {
  const navigate = useNavigate();
  const [surveysList, setSurveysList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch surveys when the component mounts
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        // Fetch surveys from the server with token
        const response = await axios.get('/api/admin/surveys', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setSurveysList(response.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Filter surveys based on the search term
  const filteredSurveys = surveysList.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-survey-dashboard">
      {loading && <CircularLoader />}

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
              <p>No surveys found matching your search. Click "Add Survey" to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyDashboard;
