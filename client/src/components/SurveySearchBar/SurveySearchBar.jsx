import React from 'react';

const SurveySearchBar = ({ surveys, answered, onSearch }) => {
  return (
    <>
      {/* Search Bar and Available Surveys Count */}
      {surveys?.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="survey-input-group input-group" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for a survey"
              aria-label="Search for a survey"
              onChange={onSearch}
            />
          </div>
          {/* Dynamically display the survey count */}
          <h3 className="survey-text-muted">
            {!answered ? "Available Surveys: " : "Surveys Answered: "} <span className="survey-text-danger text-danger">{surveys.length}</span>
          </h3>
        </div>
      )}
    </>
  );
};

export default SurveySearchBar;