// src/components/SurveyCard/SurveyCard.js

import React from 'react';
import './SurveyCard.css';

// Utility function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const SurveyCard = ({ survey }) => {
  const { title, description, creation_date, start_date, end_date } = survey;

  return (
    <div className="survey-card">
      <div className="survey-header">
        <h2>{title}</h2>
        <span className="survey-creation-date">Created: {formatDate(creation_date)}</span>
      </div>
      <p className="survey-description">{description}</p>
      <div className="survey-footer">
        <span className="survey-dates">Start: {formatDate(start_date)}</span>
        <span className="survey-dates">End: {formatDate(end_date)}</span>
      </div>
    </div>
  );
};

export default SurveyCard;
