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
  const [loading, setLoading] = useState(true);

  // Fetch survey questions on component mount
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

  // Handle changes for multiple-choice questions
  const handleOptionChange = (questionId, optionId) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { question_id: questionId, option_id: optionId, response_text: null },
    }));
  };

  // Handle changes for open-ended questions
  const handleTextChange = (questionId, text) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { question_id: questionId, option_id: null, response_text: text },
    }));
  };

  // Submit survey responses to the backend API
  const handleSubmit = async () => {
    const formattedResponses = Object.values(responses);
    try {
      const response = await api.post(`/api/survey/${surveyId}/submit`, { responses: formattedResponses });
      if (response.status === 201) {
        // Success alert message
        setStatus({ message: 'Survey submitted successfully!', severity: 'success' });
        setTimeout(() => navigate('/surveys'), 2000);  // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit survey. Please try again.';
      // Error alert message
      setStatus({ message: errorMessage, severity: 'error' });
    }
  };

  if (loading) return <CircularLoader />;

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
        <h2 className="survey-title">{surveyData?.title}</h2>
        <p className="survey-description">{surveyData?.description}</p>
      </div>

      <div className="survey-questions">
        <h3 className="survey-questions-header">Survey Questions</h3>
        {surveyData.questions.map((question, index) => (
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
                        onChange={() => handleOptionChange(question.question_id, option.option_id)}
                        required
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

      <div className="submit-survey">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Survey
        </button>
      </div>
    </div>
  );
};

export default AnswerSurvey;
