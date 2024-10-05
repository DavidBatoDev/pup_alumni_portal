import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AnswerSurvey.css'; // Import the new CSS file for styling

const AnswerSurvey = () => {
  const { surveyId } = useParams(); // Extract survey ID from the URL
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null); // Store survey information
  const [responses, setResponses] = useState({}); // Store user responses
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch survey questions on component mount
  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {
        const response = await axios.get(`/api/survey/${surveyId}/questions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSurveyData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching survey questions:', error);
        setLoading(false);
      }
    };

    fetchSurveyQuestions();
  }, [surveyId]);

  // Handle changes for multiple-choice questions
  const handleOptionChange = (questionId, optionId) => {
    setResponses({ ...responses, [questionId]: { question_id: questionId, option_id: optionId, response_text: null } });
  };

  // Handle changes for open-ended questions
  const handleTextChange = (questionId, text) => {
    setResponses({ ...responses, [questionId]: { question_id: questionId, option_id: null, response_text: text } });
  };

  // Submit survey responses to the backend API
  const handleSubmit = async () => {
    const formattedResponses = Object.values(responses);
    console.log(JSON.stringify(formattedResponses));
    try {
      const response = await axios.post(`/api/survey/${surveyId}/submit`, { responses: formattedResponses }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 201) {
        alert('Survey submitted successfully!');
        navigate('/surveys'); // Redirect to surveys page after successful submission
      } else {
        console.error('Failed to submit survey:', response.data);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit the survey.');
    }
  };

  if (loading) {
    return <div className="loading">Loading survey questions...</div>;
  }

  return (
    <div className="answer-survey-container">
      <div className='as-back-btn-container'>
        <button>back</button>
      </div>
      {/* Survey Information */}
      <div className="survey-info">
        <h2 className="survey-title">{surveyData?.title}</h2>
        <p className="survey-description">{surveyData?.description}</p>
      </div>

      {/* Survey Questions Section */}
      <div className="survey-questions">
        <h3 className="survey-questions-header">Survey Questions</h3>
        {surveyData.questions.map((question, index) => (
          <div key={question.question_id} className="as-survey-question-card">
            <div className="as-question-top-bar" /> {/* Top bar styling */}
            <div className="as-question-header">
              <span className="as-question-index">{index + 1}.)</span>
              <div className="as-question-title">{question.question_text}</div>
            </div>
            {/* Display question based on its type */}
            <div className="as-question-content">
              {question.question_type === 'Open-ended' ? (
                <textarea
                  className="form-control"
                  placeholder="Type your answer here..."
                  onChange={(e) => handleTextChange(question.question_id, e.target.value)}
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

      {/* Submit Button */}
      <div className="submit-survey">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Survey
        </button>
      </div>
    </div>
  );
};

export default AnswerSurvey;
