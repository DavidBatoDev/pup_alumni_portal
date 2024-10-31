import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
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
  const [errors, setErrors] = useState({}); // Store validation errors
  const [alert, setAlert] = useState({ message: '', severity: '' }); // Alert state
  const lastQuestionRef = useRef(null); // Ref to track the last added question
  const [validation, setValidation] = useState({ // Store validation fields (survey information)
    title: true,
    description: true,
    start_date: true,
    end_date: true,
  });

  // Reset validation fields
  const resetValidation = () => {
    setValidation({
      title: true,
      description: true,
      start_date: true,
      end_date: true,
    });
  };

  const validateEndDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
  };

  // Validate survey fields
  const validateSurveyFields = () => {
    const { title, description, start_date, end_date } = survey;
    const updatedValidation = {
      title: title.trim().length > 0,
      description: description.trim().length > 0,
      start_date: start_date.trim().length > 0,
      end_date: end_date.trim().length > 0 && validateEndDate(start_date, end_date),
    };

    setValidation(updatedValidation);
    return Object.values(updatedValidation).every((field) => field);
  };

  const handleSurveyChange = (e) => setSurvey({ ...survey, [e.target.name]: e.target.value });

  // Add new question to the survey
  const addNewQuestion = () => {
    const newQuestion = { question_id: Date.now(), question_text: '', question_type: 'Open-ended', required: false, options: [] };
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: [...prevSurvey.questions, newQuestion],
    }));
  };

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [survey.questions.length]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];

    if (field === 'question_type') {
      if (value === 'Multiple Choice') {
        updatedQuestions[index].options = [{ option_id: Date.now(), option_text: '1st option', option_value: '1' }];
      } else if (value === 'Rating') {
        updatedQuestions[index].options = [
          { option_id: Date.now() + 5, option_text: 'Poorly', option_value: '1' },
          { option_id: Date.now() + 4, option_text: 'Unsatisfied', option_value: '2' },
          { option_id: Date.now() + 3, option_text: 'Neutral', option_value: '3' },
          { option_id: Date.now() + 2, option_text: 'Satisfied', option_value: '4' },
          { option_id: Date.now() + 1, option_text: 'Very Satisfied', option_value: '5' },
        ];
      } else {
        updatedQuestions[index].options = [];
      }
    }

    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Validate options to ensure no duplicate option_value exists in a question
  const validateOptions = (questionIndex) => {
    const question = survey.questions[questionIndex];
    const values = question.options.map((option) => option.option_value);
    const duplicateValue = values.find((val, idx) => values.indexOf(val) !== idx);

    if (duplicateValue) {
      setErrors({
        ...errors,
        [questionIndex]: `Duplicate option value found: ${duplicateValue}`,
      });
      setAlert({ message: `Duplicate option value found in Question ${questionIndex + 1}`, severity: 'error' });
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors[questionIndex];
      setErrors(updatedErrors);
      setAlert({ message: '', severity: '' });
    }
  };

  // Add an option to a specific question (if it's a multiple-choice or rating type)
  const addOptionToQuestion = (questionIndex) => {
    const updatedQuestions = [...survey.questions];
    const nextOptionValue = updatedQuestions[questionIndex].options.length + 1;
    updatedQuestions[questionIndex].options.push({ option_id: Date.now(), option_text: '', option_value: nextOptionValue });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Update an option's text or value and validate for duplicate values
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });

    // Validate options after setting a new option_value
    if (field === 'option_value') {
      validateOptions(questionIndex);
    }
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
    validateOptions(questionIndex);
  };

  // Format the survey data to match the API payload structure
  const formatSurveyPayload = () => {
    const formattedQuestions = survey.questions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      required: q.required,
      options: q.question_type === 'Multiple Choice' || q.question_type === 'Rating' ? q.options.map((o) => ({
        option_text: o.option_text,
        option_value: parseInt(o.option_value, 10),
      })) : [],
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
    const formattedSurvey = formatSurveyPayload();

    // Validate fields before sending
    if (!validateSurveyFields()) {
      setAlert({ message: 'Please fill out all required fields correctly.', severity: 'warning' });
      return;
    }

    try {
      const response = await axios.post('/api/admin/save-survey', formattedSurvey, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 201) {
        setAlert({ message: 'Survey saved successfully!', severity: 'success' });
        // Navigate back to the AdminSurveyDashboard with alert state after 2 seconds
        setTimeout(() => {
          navigate('/admin/survey-feedback', { state: { message: 'Survey created successfully!', severity: 'success' } });
        }, 2000);
      } else {
        setAlert({ message: 'Failed to save survey. Please try again.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      setAlert({ message: 'Error saving survey. Please try again.', severity: 'error' });
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ message: '', severity: '' });
  };

  // Cancel survey creation and navigate back
  const cancelSurveyCreation = () => {
    navigate('/admin/surveys');
  };

  return (
    <div className="create-survey-container">
      <AdminSidebar />

      <div className="create-survey-content">
        {/* CustomAlert for showing messages */}
        {alert.message && <CustomAlert message={alert.message} severity={alert.severity} onClose={handleCloseAlert} />}

        <div className="create-survey-header">
          <h2>Create New Survey</h2>
          <div className="create-survey-actions">
            <button className="btn btn-secondary" onClick={cancelSurveyCreation}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveSurvey} disabled={Object.keys(errors).length > 0}>
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
            className={`form-control ${!validation.title ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback d-block'>
            {validation.title ? '' : 'Title is required'}
          </div>
          <textarea
            name="description"
            value={survey.description}
            placeholder="Survey Description"
            onChange={handleSurveyChange}
            className={`form-control ${!validation.description ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback d-block'>
            {validation.description ? '' : 'Description is required'}
          </div>
          <div className="survey-date-fields">
            <input
              type="date"
              name="start_date"
              value={survey.start_date}
              onChange={handleSurveyChange}
              className={`form-control ${!validation.start_date ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback d-block'>
              {validation.start_date ? '' : 'Start date is required'}
            </div>
            <input
              type="date"
              name="end_date"
              value={survey.end_date}
              onChange={handleSurveyChange}
              className={`form-control ${!validation.end_date ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback d-block'>
              {validation.end_date ? '' : 'End date is required and must be after the start date'}
            </div>
          </div>
        </div>

        {/* Survey Questions Section */}
        <div className="survey-questions">
          <h3>Survey Questions</h3>
          {survey.questions.map((question, index) => (
            <div
              key={question.question_id}
              className="survey-question-card"
              ref={index === survey.questions.length - 1 ? lastQuestionRef : null}
            >
              <div className="question-top-bar" />
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
                  <option value="Open-ended">Open-ended</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Rating">Rating</option>
                </select>
              </div>

              {/* Display options if it's a multiple choice or rating question */}
              {(question.question_type === 'Multiple Choice' || question.question_type === 'Rating') && (
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
                      <select
                        value={option.option_value}
                        onChange={(e) => handleOptionChange(index, optionIndex, 'option_value', e.target.value)}
                        className={`form-control option-value-selector ${errors[index] ? 'error' : ''}`}
                      >
                        {Array.from({ length: question.options.length }, (_, i) => i + 1).map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-danger btn-sm remove-option-btn"
                        onClick={() => deleteOption(index, optionIndex)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  {errors[index] && <p className="error-text">{errors[index]}</p>}
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
