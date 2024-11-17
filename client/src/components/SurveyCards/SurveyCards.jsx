import React from 'react';
import './SurveyCards.css'; // Import the updated CSS file for styling
import { useNavigate } from 'react-router-dom';

const SurveyCard = ({ surveys, answered, isRowLayout = true }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Search Bar and Available Surveys Count */}
      <div className="survey-card-container">
        {/* Render survey-card-grid only if surveys exist */}
        {surveys?.length > 0 ? (
          <div className={`survey-card-grid ${isRowLayout ? '' : 'survey-col-layout'}`}>
            {/* Map over the surveys data and render each survey card */}
            {surveys.map((survey, index) => (
              <div key={index} className={`survey-card-item ${isRowLayout ? '' : 'survey-col-item'}`}>
                <div className="survey-card-information">
                  <h4 className="survey-card-title">{survey.title}</h4>
                  <p className="survey-card-description">{survey.description}</p>
                </div>
                {!answered && (
                  <button
                    onClick={() => navigate(`/survey/${survey.survey_id}`)}
                    className="survey-card-btn-primary"
                  >
                    Take Survey
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Render fallback message when no surveys are available
          <div className="no-survey-message-container">
            <div className="no-survey-message">
              {answered ? (
                <>
                  <h1>You did not answer any surveys yet</h1>
                  <p>Help us improve our services by answering our surveys.</p>
                </>
              ) : (
                <>
                  <h1>No surveys available</h1>
                  <p>Please check back later for more surveys.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SurveyCard;
