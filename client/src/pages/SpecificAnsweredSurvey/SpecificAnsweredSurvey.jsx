import React, { useState, useEffect } from 'react';
import './SpecificAnsweredSurvey.css';
import '../AnswerSurvey/AnswerSurvey.css'
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
    }
  ]
};

// Dummy User Response Data
const dummyUserResponses = {
  1: { question_id: 1, option_id: 2, response_text: null }, // Chose "Satisfied"
  2: { question_id: 2, option_id: null, response_text: "Great product, but could use some improvements!" } // Open-ended response
};

const SpecificAnswerSurvey = () => {
  const [surveyData, setSurveyData] = useState(dummySurveyData);
  const [userResponses, setUserResponses] = useState(dummyUserResponses);

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

  return (
    <div className="answer-survey-container">

      <div className="as-back-btn-container ">
        {/* Back Button: link to admin/survey-feedback */}
        <Link className="as-back-btn text-decoration-none" to="/admin/survey-feedback">
          <i className="fas fa-arrow-left"></i>Back
        </Link>
      </div>

      <div className="survey-info">
        <h2 className="survey-title">{surveyData.survey}</h2>
        <p className="survey-description">{surveyData.description}</p>
      </div>

      {surveyData.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="as-survey-section">
          <div className="as-survey-question-card">
            <h3 className="section-title">{section.section_title}</h3>
            <p className="section-description">{section.section_description}</p>
          </div>

          {section.questions.map((question) => (
            <div
              key={question.question_id}
              className={`as-survey-question-card ${isUserAnswer(question.question_id, question.option_id, question.response_text) ? 'highlighted' : ''}`}
            >
              <div className="as-question-header">
                <div className="as-question-title">
                  {question.question_text}
                  {question.is_required && <span className='question-required-asterisk'>*</span>}
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
      ))}
    </div>
  );
};

export default SpecificAnswerSurvey;
