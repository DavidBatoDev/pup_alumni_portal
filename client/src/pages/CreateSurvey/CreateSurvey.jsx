import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './CreateSurvey.css';

const CreateSurvey = () => {
  const navigate = useNavigate();
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    questions: [],
  });

  // Handlers for survey fields
  const handleSurveyChange = (e) => setSurvey({ ...survey, [e.target.name]: e.target.value });

  // Add new question to the survey
  const addNewQuestion = () => {
    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        { question_id: Date.now(), question_text: '', question_type: 'Multiple Choice', required: false, options: [] }
      ]
    });
  };

  // Update a question's text or type
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Toggle required field for question
  const toggleRequired = (index) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index].required = !updatedQuestions[index].required;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Add an option to a specific question (if it's a multiple-choice type)
  const addOptionToQuestion = (questionIndex) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].options.push({ option_id: Date.now(), option_text: '', option_value: '' });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Update an option's text or value
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Delete a question
  const deleteQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Delete an option from a specific question
  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Format the survey data to match the API payload structure
  const formatSurveyPayload = () => {
    const formattedQuestions = survey.questions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      required: q.required,
      options: q.question_type === 'Multiple Choice' ? q.options.map((o) => ({
        option_text: o.option_text,
        option_value: parseInt(o.option_value, 10), // Ensure option_value is a number
      })) : []
    }));

    return {
      title: survey.title,
      description: survey.description,
      start_date: survey.start_date,
      end_date: survey.end_date,
      questions: formattedQuestions,
    };
  };

  // Save survey to the server with proper payload structure
  const saveSurvey = async () => {
    const formattedSurvey = formatSurveyPayload(); // Format the survey data

    try {
      const response = await axios.post('/api/admin/save-survey', formattedSurvey, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status !== 201) {
        console.log('Failed to save survey:', response.data);
      }
      navigate('/admin/survey-feedback'); // Redirect to dashboard after saving
    } catch (error) {
      console.log('Error saving survey:', error);
      alert('Failed to save the survey.');
    }
  };

  // Cancel survey creation and delete if necessary
  const cancelSurveyCreation = () => {
    if (window.confirm('Are you sure you want to cancel? This will discard all changes.')) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="create-survey-container">
      <AdminSidebar />

      <div className="create-survey-content">
        <div className="create-survey-header">
          <h2>Create New Survey</h2>
          <div className="create-survey-actions">
            <button className="btn btn-secondary" onClick={cancelSurveyCreation}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveSurvey}>
              Save Survey
            </button>
          </div>
        </div>

        {/* Survey Information */}
        <div className="survey-info">
          <input
            type="text"
            name="title"
            value={survey.title}
            placeholder="Survey Title"
            onChange={handleSurveyChange}
            className="form-control"
          />
          <textarea
            name="description"
            value={survey.description}
            placeholder="Survey Description"
            onChange={handleSurveyChange}
            className="form-control"
          />
          <div className="survey-date-fields">
            <input
              type="date"
              name="start_date"
              value={survey.start_date}
              onChange={handleSurveyChange}
              className="form-control"
            />
            <input
              type="date"
              name="end_date"
              value={survey.end_date}
              onChange={handleSurveyChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Survey Questions Section */}
        <div className="survey-questions">
          <h3>Survey Questions</h3>
          {survey.questions.map((question, index) => (
            <div key={question.question_id} className="survey-question-card">
              <div className="question-top-bar" /> {/* Colored Top Bar */}
              <div className="question-header">
                <span className="question-index">{index + 1}</span>
                <h4 className="question-title">Question {index + 1}</h4>
                <div className="question-controls">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteQuestion(index)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="question-content">
                <input
                  type="text"
                  value={question.question_text}
                  placeholder={`Question ${index + 1}`}
                  onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                  className="form-control"
                />
                <select
                  value={question.question_type}
                  onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                  className="form-control question-type-dropdown"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Open-ended">Open-ended</option>
                </select>
              </div>

              {/* Display options if it's a multiple choice question */}
              {question.question_type === 'Multiple Choice' && (
                <div className="survey-options">
                    {question.options.map((option, optionIndex) => (
                    <div key={option.option_id} className="option-input-group">
                        <div className="option-circle" />
                        <input
                        type="text"
                        value={option.option_text}
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(e) => handleOptionChange(index, optionIndex, 'option_text', e.target.value)}
                        className="option-input no-border"
                        />
                        <button
                        className="btn btn-danger btn-sm remove-option-btn"
                        onClick={() => deleteOption(index, optionIndex)}
                        >
                        ✖
                        </button>
                    </div>
                    ))}
                    <button className="btn add-option-btn" onClick={() => addOptionToQuestion(index)}>
                    + Add Option
                    </button>
                </div>
                )}
            </div>
          ))}
          <button className="btn btn-primary add-question-btn" onClick={addNewQuestion}>
            + Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
