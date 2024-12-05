import React, { useState, useEffect } from 'react';
import './SpecificAnsweredSurvey.css';
import '../AnswerSurvey/AnswerSurvey.css';
import { Link } from 'react-router-dom';

// Dummy Survey Data
const dummySurveyData = {
    survey: "Customer Satisfaction Survey",
    description: "We want to hear your thoughts on our product.",
    sections: [
      {
        section_title: "Section 1: Product Feedback",
        section_description: "Please rate your experience with the product.",
        questions: [
          {
            question_id: 1,
            question_text: "How satisfied are you with the product?",
            question_type: "Multiple Choice",
            options: [
              { option_id: 1, option_text: "Very Satisfied" },
              { option_id: 2, option_text: "Satisfied" },
              { option_id: 3, option_text: "Neutral" },
              { option_id: 4, option_text: "Dissatisfied" },
              { option_id: 5, option_text: "Very Dissatisfied" }
            ],
            is_required: true,
          },
          {
            question_id: 2,
            question_text: "Any additional feedback?",
            question_type: "Open-ended",
            is_required: false,
          }
        ]
      },
      {
        section_title: "Section 2: Customer Service",
        section_description: "Please rate your experience with our customer service.",
        questions: [
          {
            question_id: 3,
            question_text: "How would you rate your overall customer service experience?",
            question_type: "Multiple Choice",
            options: [
              { option_id: 1, option_text: "Excellent" },
              { option_id: 2, option_text: "Good" },
              { option_id: 3, option_text: "Average" },
              { option_id: 4, option_text: "Poor" },
            ],
            is_required: true,
          },
          {
            question_id: 4,
            question_text: "What could we do to improve our customer service?",
            question_type: "Open-ended",
            is_required: false,
          }
        ]
      }
    ]
  };
  
  // Dummy User Response Data
  const dummyUserResponses = {
    1: { question_id: 1, option_id: 2, response_text: null }, // Chose "Satisfied"
    2: { question_id: 2, option_id: null, response_text: "Great product, but could use some improvements!" }, // Open-ended response
    3: { question_id: 3, option_id: 2, response_text: null }, // Chose "Good" for customer service
    4: { question_id: 4, option_id: null, response_text: "Faster response time would be appreciated." } // Open-ended response
  };
  

const SpecificAnsweredSurvey = () => {
  const [surveyData, setSurveyData] = useState(dummySurveyData);
  const [userResponses, setUserResponses] = useState(dummyUserResponses);
  const [currentSection, setCurrentSection] = useState(0);  // Active section state

  useEffect(() => {
    // Simulate fetching survey data and user responses
    setSurveyData(dummySurveyData);
    setUserResponses(dummyUserResponses);
  }, []);

  const isUserAnswer = (questionId, optionId, responseText) => {
    const response = userResponses[questionId];
    if (responseText) {
      return responseText === response.response_text; // Check if it's an open-ended match
    }
    return response.option_id === optionId; // Check if it's a multiple choice match
  };

  // Handle section navigation
  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < surveyData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  return (
    <div className="answer-survey-container">
      <div className="as-back-btn-container">
        {/* Back Button: link to admin/survey/:surveyId */}
        <Link to="/admin/survey-feedback" className="as-back-btn text-decoration-none">
          <i className="fas fa-chevron-left"></i>
          <span>Back</span>
        </Link>
      </div>

      <div className="survey-info">
        <h2 className="survey-title">{surveyData.survey}</h2>
        <p className="survey-description">{surveyData.description}</p>
      </div>

      {/* Display Current Section */}
      {surveyData.sections[currentSection] && (
        <div className="as-survey-section">
          <div className="as-survey-question-card">
            <h3 className="section-title">
              {surveyData.sections[currentSection].section_title}
            </h3>
            <p className="section-description">
              {surveyData.sections[currentSection].section_description}
            </p>
          </div>

          {surveyData.sections[currentSection].questions.map((question) => (
            <div
              key={question.question_id}
              className={`as-survey-question-card ${isUserAnswer(question.question_id, question.option_id, question.response_text) ? 'highlighted' : ''}`}
            >
              <div className="as-question-header">
                <div className="as-question-title">
                  {question.question_text}
                  {question.is_required && <span className="question-required-asterisk">*</span>}
                </div>
              </div>

              <div className="as-question-content">
                {question.question_type === 'Open-ended' ? (
                  <textarea
                    className="form-control"
                    value={userResponses[question.question_id]?.response_text || ''}
                    readOnly
                  />
                ) : (
                  <div className="multiple-choice-options">
                    {question.options.map((option) => (
                      <div
                        key={option.option_id}
                        className={`option-item ${isUserAnswer(question.question_id, option.option_id, '') ? 'highlighted' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.question_id}`}
                          value={option.option_id}
                          checked={userResponses[question.question_id]?.option_id === option.option_id}
                          readOnly
                        />
                        <label>{option.option_text}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section Navigation */}
      <div className="section-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
        >
          Previous Section
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNextSection}
          disabled={currentSection === surveyData.sections.length - 1}
        >
          Next Section
        </button>
      </div>
    </div>
  );
};

export default SpecificAnsweredSurvey;
