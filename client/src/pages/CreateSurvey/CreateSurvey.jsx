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
    sections: [
      {
        section_title: '',
        section_description: '',
        questions: [
          {
            question_id: Date.now(),
            question_text: '',
            question_type: 'Open-ended',
            options: [],
          },
        ],
      },
    ]
  });
  const [errors, setErrors] = useState({}); // Store validation errors
  const [alert, setAlert] = useState({ message: '', severity: '' }); // Alert state
  const lastQuestionRef = useRef(null); // Ref to track the last added question
  const lastSectionRef = useRef(null);
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

  // Add new section to the survey
  const addNewSection = () => {
    const updatedSections = [...survey.sections];
    const newSection = { section_title: '', section_description: '', questions: [] };
    updatedSections.push(newSection);
    setSurvey({ ...survey, sections: updatedSections });

    setTimeout(() => {
      lastSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };
  

  // Add new question to the survey
  const addNewQuestion = (sectionIndex) => {
    const updatedSections = [...survey.sections];
    const newQuestion = { 
      question_id: Date.now(), 
      question_text: '', 
      question_type: 'Open-ended', 
      options: [] 
    };
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSurvey({ ...survey, sections: updatedSections });

    if (sectionIndex === survey.sections.length - 1) {
      setTimeout(() => {
        lastQuestionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [survey.sections.length]);

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex][field] = value;
    setSurvey({ ...survey, sections: updatedSections });
  };

  const handleQuestionChange = (sectionIndex, questionIndex, field, value) => {
    const updatedSections = [...survey.sections];
    if (field === 'question_type') {
      if (value === 'Multiple Choice') {
        updatedSections[sectionIndex].questions[questionIndex].options = [
          { option_id: Date.now(), option_text: '1st option', option_value: '1' }];
      } else if (value === 'Rating') {
        updatedSections[sectionIndex].questions[questionIndex].options = [
          { option_id: Date.now() + 5, option_text: 'Poorly', option_value: '1' },
          { option_id: Date.now() + 4, option_text: 'Unsatisfied', option_value: '2' },
          { option_id: Date.now() + 3, option_text: 'Neutral', option_value: '3' },
          { option_id: Date.now() + 2, option_text: 'Satisfied', option_value: '4' },
          { option_id: Date.now() + 1, option_text: 'Very Satisfied', option_value: '5' },
        ];
      } else {
        updatedSections[sectionIndex].questions[questionIndex].options = [];
      }
    }
    updatedSections[sectionIndex].questions[questionIndex][field] = value;
    setSurvey({ ...survey, sections: updatedSections });
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
  const addOptionToQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex].questions[questionIndex].options.push({ 
      option_text: '', 
      option_value: updatedSections[sectionIndex].questions[questionIndex].options.length + 1 
    });
    setSurvey({ ...survey, sections: updatedSections });
  };


  const handleOptionChange = (sectionIndex, questionIndex, optionIndex, field, value) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex].questions[questionIndex].options[optionIndex][field] = value;
    setSurvey({ ...survey, sections: updatedSections });

    // if (field === 'option_value') {
    //   validateOptions(questionIndex);
    // }
  };

  const deleteSection = (index) => {
    const updatedSections = survey.sections.filter((_, i) => i !== index);
    setSurvey({ ...survey, sections: updatedSections });
  };

  // Delete an option from a specific question
  const deleteQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex].questions = updatedSections[sectionIndex].questions.filter((_, i) => i !== questionIndex);
    setSurvey({ ...survey, sections: updatedSections });
  }

  // Delete an option from a specific question
  const deleteOption = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex].questions[questionIndex].options = updatedSections[sectionIndex].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setSurvey({ ...survey, sections: updatedSections });
  }


  // Format the survey data to match the API payload structure
  const formatSurveyPayload = () => ({
    title: survey.title,
    description: survey.description,
    start_date: survey.start_date,
    end_date: survey.end_date,
    sections: survey.sections.map((section) => ({
      section_title: section.section_title,
      section_description: section.section_description,
      questions: section.questions.map((question) => ({
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options.map((option) => ({
          option_text: option.option_text,
          option_value: option.option_value,
        })),
      })),
    })),
  });

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
        {alert.message && <CustomAlert message={alert.message} severity={alert.severity} onClose={() => setAlert({ message: '', severity: '' })} />}
        
        <div className="create-survey-header">
          <h2>Create New Survey</h2>
          <div className="create-survey-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/admin/surveys')}>Cancel</button>
            <button className="btn btn-primary" onClick={saveSurvey}>Save Survey</button>
          </div>
        </div>

        <div className="survey-info">
          <input
            type="text"
            name="title"
            value={survey.title}
            placeholder="Survey Title"
            onChange={handleSurveyChange}
          />
          <textarea
            name="description"
            value={survey.description}
            placeholder="Survey Description"
            onChange={handleSurveyChange}
          />
          <div className="survey-date-fields">
            <input
              type="date"
              name="start_date"
              value={survey.start_date}
              onChange={handleSurveyChange}
              className=""
            />
            <input
              type="date"
              name="end_date"
              value={survey.end_date}
              onChange={handleSurveyChange}
              className=""
            />
          </div>
        </div>

        <div className="survey-sections">

          {survey.sections.map((section, sectionIndex) => (
            <div key={section.section_id} className="survey-section-card" ref={sectionIndex === survey.sections.length - 1 ? lastSectionRef : null}>
              <div className='survey-section--num'>
                <h5>Section {sectionIndex + 1} of {survey.sections.length}</h5>
              </div>
              <div className='survey-section-info'>
                <div className='survey-section-info--row-1'>
                  <input
                    type="text"
                    value={section.section_title}
                    placeholder="Section Title"
                    onChange={(e) => handleSectionChange(sectionIndex, 'section_title', e.target.value)}
                    className=""
                  />
                  <button button className="" onClick={() => deleteSection(sectionIndex)}>🗑️</button>
                </div>
                <div className='survey-section-info--row-2'>
                <textarea
                    value={section.section_description}
                    placeholder="Section Description"
                    onChange={(e) => handleSectionChange(sectionIndex, 'section_description', e.target.value)}
                    className=""
                  />
                  
                </div>
              </div>
              
              <div className="section-questions">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.question_id} className="survey-question-card" ref={sectionIndex === survey.sections.length - 1 ? lastQuestionRef : null}>
                    <div className='survey-question-card--nav'>
                      <input
                        type="text"
                        value={question.question_text}
                        placeholder={`Question ${questionIndex + 1}`}
                        onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'question_text', e.target.value)}
                        className="survey-question--text"
                      />
                      <select
                        value={question.question_type}
                        onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'question_type', e.target.value)}
                        className="survey-question--select"
                      >
                        <option value="Open-ended">💬 Open-ended</option>
                        <option value="Multiple Choice">©️ Multiple Choice</option>
                      </select>
                    </div>
                    {question.question_type === 'Multiple Choice' && (
                      <div className="question-options">
                        {question.options.map((option, optionIndex) => (
                          <div key={option.option_id} className="option-input-group"> 
                            <div className='option-input-group--values'>
                              <input
                                type="text"
                                value={option.option_text}
                                placeholder={`Option ${optionIndex + 1}`}
                                onChange={(e) => handleOptionChange(sectionIndex, questionIndex, optionIndex, 'option_text', e.target.value)}
                                className=""
                              />
                            <select
                              value={option.option_value}
                              onChange={(e) => handleOptionChange(sectionIndex, questionIndex, optionIndex, 'option_value', e.target.value)}
                              className={`form-control option-value-selector ${errors[optionIndex] ? 'error' : ''}`}
                            >
                              {Array.from({ length: question.options.length }, (_, i) => i + 1).map((val) => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteOption(sectionIndex, questionIndex, optionIndex)}>✖</button>
                            </div>
                          </div>
                        ))}
                        <button className="btn add-option-btn" onClick={() => addOptionToQuestion(sectionIndex, questionIndex)}>+ Add Option</button>
                      </div>
                    )}
                    <button className="btn btn-outline-danger" onClick={() => deleteQuestion(sectionIndex, questionIndex)}>🗑️ Delete Question</button>
                  </div>
                ))}
                <button className="add-question-btn" onClick={() => addNewQuestion(sectionIndex)}>+ Add Question</button>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary add-section-btn" onClick={addNewSection}>+ Add Section</button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
