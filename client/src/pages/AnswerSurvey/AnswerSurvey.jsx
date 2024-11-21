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
  
        // Restore saved state from localStorage
        const savedResponses = JSON.parse(localStorage.getItem(`survey_${surveyId}_responses`)) || {};
        const savedOtherResponses = JSON.parse(localStorage.getItem(`survey_${surveyId}_otherResponses`)) || {};
        const savedSection = parseInt(localStorage.getItem(`survey_${surveyId}_currentSection`)) || 0;
  
        setResponses(savedResponses);
        setOtherResponses(savedOtherResponses);
        setCurrentSection(savedSection);
      } catch (error) {
        console.error('Error fetching survey questions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSurveyQuestions();
  }, [surveyId]);

  useEffect(() => {
    localStorage.setItem(`survey_${surveyId}_responses`, JSON.stringify(responses));
    localStorage.setItem(`survey_${surveyId}_otherResponses`, JSON.stringify(otherResponses));
    localStorage.setItem(`survey_${surveyId}_currentSection`, currentSection);
  }, [surveyId, responses, otherResponses, currentSection]);



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
  
        // Clear saved data from localStorage
        localStorage.removeItem(`survey_${surveyId}_responses`);
        localStorage.removeItem(`survey_${surveyId}_otherResponses`);
        localStorage.removeItem(`survey_${surveyId}_currentSection`);
  
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
              <div className="as-question-title">{question.question_text} {question.is_required ? <span className='question-required-asterisk'>*</span> : ""}</div>
            </div>
            <div className="as-question-content">
              {question.question_type === 'Open-ended' ? (
                <textarea
                  className="form-control"
                  placeholder="Type your answer here..."
                  value={responses[question.question_id]?.response_text || ''}
                  onChange={(e) => handleTextChange(question.question_id, e.target.value)}
                  required
                />
              ) : question.question_type === 'Dropdown' ? (
                <div className="dropdown-options">
                  <select
                    className="form-select mb-3"
                    onChange={(e) => handleOptionChange(
                      question.question_id,
                      e.target.value, // This is the selected option's ID
                      question.options.find(opt => opt.option_id.toString() === e.target.value)?.option_text || '' // Match the option text
                    )}
                    value={responses[question.question_id]?.option_id || ''}
                    required
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option) => (
                      <option key={option.option_id} value={option.option_id}>
                        {option.option_text}
                      </option>
                    ))}
                  </select>

                  {/* Show additional input for "Others" if selected */}
                  {responses[question.question_id]?.option_id &&
                    question.options.find(opt => opt.option_id === parseInt(responses[question.question_id]?.option_id))?.option_text === 'Others' && (
                      <input
                        type="text"
                        className="as-option-others-input-text border-0 border-bottom"
                        placeholder="Please specify..."
                        value={otherResponses[question.question_id] || ''}
                        onChange={(e) => handleOtherTextChange(question.question_id, e.target.value)}
                      />
                    )}
                </div>
              ) : (
                <div className="multiple-choice-options">
                  {question.options.map((option) => (
                    <div key={option.option_id} className="option-item">
                      <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        value={option.option_id}
                        checked={responses[question.question_id]?.option_id === option.option_id}
                        onChange={() => handleOptionChange(question.question_id, option.option_id, option.option_text)}
                        required
                      />
                      <label>{option.option_text}</label>

                      {/* Show additional input for "Others" if selected */}
                      {option.option_text === 'Others' && responses[question.question_id]?.option_id === option.option_id && (
                        <input
                          type="text"
                          className="as-option-others-input-text border-0 border-bottom "
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
