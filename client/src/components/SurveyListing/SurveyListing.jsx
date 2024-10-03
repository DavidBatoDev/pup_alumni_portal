// src/components/SurveyListing/SurveyListing.jsx

import React from 'react';
import './SurveyListing.css'; // Import the CSS file for styling

const SurveyListing = ({ surveyData }) => {
  const { title, description, creation_date, start_date, end_date, responses, status } = surveyData;

  // Utility function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine the status color
  const getStatusColor = () => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Completed':
        return 'blue';
      case 'Draft':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <div className="survey-listing-card">
      {/* Survey Header Section */}
      <div className="survey-listing-header">
        <h2 className="survey-listing-title">{title}</h2>
        <span className="survey-listing-date">Created: {formatDate(creation_date)}</span>
      </div>
      
      {/* Survey Description */}
      <p className="survey-listing-description">{description}</p>

      {/* Survey Details Table */}
      <div className="survey-listing-details">
        <div className="survey-listing-date-range">
          <span>{formatDate(start_date)} - {formatDate(end_date)}</span>
        </div>
        <div className="survey-listing-responses">
          <span>{responses} Responses</span>
        </div>
        <div className="survey-listing-status">
          <span className="survey-status-indicator" style={{ backgroundColor: getStatusColor() }}></span>
          <span className="survey-status-text">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default SurveyListing;
