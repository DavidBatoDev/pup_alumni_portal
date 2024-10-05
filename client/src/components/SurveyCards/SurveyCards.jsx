import React from 'react';
import './SurveyCards.css'; // Import the updated CSS file for styling
import { useNavigate } from 'react-router-dom';

const SurveyCard = ({ surveys, answered }) => {
  const navigate = useNavigate();


  return (
    <div className="survey-list-container">
      {/* Search Bar and Available Surveys Count */}
      <div className="survey-card-container p-4 ">
        {surveys.length > 0 && (
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
          <h3 className="survey-text-muted">
            {!answered ? "Available Surveys: " : "Surveys Answered: "} <span className="survey-text-danger text-danger">{surveys.length}</span>
          </h3>
        </div>
        )}

        {/* Map over the surveys data and render each survey card */}
        <div className="survey-card-grid">
          {surveys.length > 0 ? surveys.map((survey, index) => (
            <div key={index} className="survey-card-item">
              <div className="survey-card-information">
                <h4 className="survey-card-title">{survey.title}</h4>
                <p className="survey-card-description">{survey.description}</p>
              </div>
              {
                !answered && (
                  <button onClick={() => navigate(`/survey/${survey.survey_id}`)} className="survey-card-btn-primary">Take Survey</button>
                )
              }
            </div>
          ))
        :
          (
            <div className='no-survey-message-container'>
              {answered ? (
                <>
                  <h1>You did not answer any surveys yet</h1>
                  <p>
                    help us improve our services by answering our surveys
                  </p>
                </>
              ) : (
                <>
                  <h1>No surveys available</h1>
                  <p>
                    Please check back later for more surveys
                  </p>
                </>
              )
              }
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
