import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useParams, useNavigate } from 'react-router-dom';
import './AnswerSurvey.css';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import CircularLoader from '../../components/CircularLoader/CircularLoader';

const AnswerSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    message: '',
    severity: '',
  });
  const [surveyData, setSurveyData] = useState(null);
  const [responses, setResponses] = useState({});
  const [otherResponses, setOtherResponses] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {
        const response = await api.get(`/api/survey/${surveyId}/questions`);
        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching survey questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyQuestions();
  }, [surveyId]);

  const handleCloseAlert = () => setStatus({ message: '', severity: '' });

  const handleOptionChange = (questionId, optionId, optionText) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { question_id: questionId, option_id: optionId, response_text: optionText === 'Others' ? '' : null },
    }));

    // Show input for "Others" if selected, otherwise clear it
    if (optionText === 'Others') {
      setOtherResponses((prev) => ({ ...prev, [questionId]: '' }));
    } else {
      setOtherResponses((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleTextChange = (questionId, text) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { question_id: questionId, option_id: null, response_text: text },
    }));
  };

  const handleOtherTextChange = (questionId, text) => {
    setOtherResponses((prev) => ({
      ...prev,
      [questionId]: text,
    }));
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { question_id: questionId, option_id: responses[questionId].option_id, response_text: text },
    }));
  };

  const handleSubmit = async () => {
    const formattedResponses = Object.values(responses);
    try {
      const response = await api.post(`/api/survey/${surveyId}/submit`, { responses: formattedResponses });
      if (response.status === 201) {
        setStatus({ message: 'Survey submitted successfully!', severity: 'success' });
        setTimeout(() => navigate('/surveys'), 2000);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit survey. Please try again.';
      setStatus({ message: errorMessage, severity: 'error' });
    }
  };

  const handleNextSection = () => {
    if (currentSection < surveyData.sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  if (loading) return <CircularLoader />;

  const currentSectionData = surveyData.sections[currentSection];

  return (
    <div className="answer-survey-container">
      {status.message && (
        <CustomAlert
          message={status.message}
          severity={status.severity}
          onClose={handleCloseAlert}
        />
      )}

      <div className="as-back-btn-container">
        <button className="as-back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <div className="survey-info">
        <h2 className="survey-title">{surveyData?.survey}</h2>
        <p className="survey-description">{surveyData?.description}</p>
      </div>

      <div className="as-survey-section">
        <h3 className="section-title">{currentSectionData.section_title}</h3>
        <p className="section-description">{currentSectionData.section_description}</p>

        {currentSectionData.questions.map((question, index) => (
          <div key={question.question_id} className="as-survey-question-card">
            <div className="as-question-top-bar" />
            <div className="as-question-header">
              <span className="as-question-index">{index + 1}.)</span>
              <div className="as-question-title">{question.question_text}</div>
            </div>
            <div className="as-question-content">
              {question.question_type === 'Open-ended' ? (
                <textarea
                  className="form-control"
                  placeholder="Type your answer here..."
                  onChange={(e) => handleTextChange(question.question_id, e.target.value)}
                  required
                />
              ) : (
                <div className="multiple-choice-options">
                  {question.options.map((option) => (
                    <div key={option.option_id} className="option-item">
                      <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        value={option.option_id}
                        onChange={() => handleOptionChange(question.question_id, option.option_id, option.option_text)}
                        required
                      />
                      <label>{option.option_text}</label>
                      {/* Show additional input if "Others" is selected */}
                      {option.option_text === 'Others' && responses[question.question_id]?.option_id === option.option_id && (
                        <input
                          type="text"
                          className="as-option-others-input-text border-0 border-bottom mx-3"
                          placeholder="Please specify..."
                          value={otherResponses[question.question_id] || ''}
                          onChange={(e) => handleOtherTextChange(question.question_id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="section-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
        >
          Previous Section
        </button>
        <button className="btn btn-primary" onClick={handleNextSection}>
          {currentSection === surveyData.sections.length - 1 ? 'Submit Survey' : 'Next Section'}
        </button>
      </div>
    </div>
  );
};

export default AnswerSurvey;
