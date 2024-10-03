import React from 'react';
import './SurveyCard.css'; // Import the updated CSS file for styling

const SurveyCard = ({ surveys }) => {
  return (
    <div className="survey-list-container my-5">
      {/* Search Bar and Available Surveys Count */}
      <div className="survey-card-container card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="survey-input-group input-group" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for a survey"
              aria-label="Search for a survey"
            />
          </div>
          {/* Dynamically display the survey count */}
          <h3 className="survey-text-muted text-muted">
            Available Surveys: <span className="survey-text-danger text-danger">{surveys.length}</span>
          </h3>
        </div>

        {/* Map over the surveys data and render each survey card */}
        <div className="survey-card-grid">
          {surveys.map((survey, index) => (
            <div key={index} className="survey-card-item">
              <div className="survey-information">
                <h4 className="survey-title">{survey.title}</h4>
                <p className="survey-description">{survey.description}</p>
              </div>
              <button className="survey-btn-primary">Take Survey</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
