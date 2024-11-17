import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './SurveyInformationResponses.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import { useMediaQuery } from 'react-responsive';

const SurveyInformationResponses = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  console.log(survey)

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const surveyResponse = await axios.get(`/api/admin/survey/${surveyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurvey(surveyResponse.data);

        const responsesResponse = await axios.get(`/api/admin/survey/${surveyId}/responses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Organize responses by alumni
        const organizedResponses = responsesResponse.data.data.sections.flatMap(section =>
          section.questions.flatMap(question =>
            question.responses.map(response => ({
              ...response,
              question_id: question.question_id,
              question_text: question.question_text,
            }))
          )
        );

        setResponses(organizedResponses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  // Function to group responses by alumni
  const groupResponsesByAlumni = () => {
    const grouped = {};

    responses.forEach(response => {
      const alumniKey = `${response.alumni_id}_${response.alumni_email}`;

      if (!grouped[alumniKey]) {
        grouped[alumniKey] = {
          alumni_name: `${response.alumni_first_name} ${response.alumni_last_name}`,
          alumni_email: response.alumni_email,
          response_date: new Date().toLocaleDateString(),
          answers: {},
        };
      }

      // Store each question's answer for the alumni
      grouped[alumniKey].answers[response.question_id] = response.response_text || response.option_text || 'No Response';
    });

    return Object.values(grouped);
  };

  // Prepare data for CSV export
  const exportAsCSV = () => {
    if (!survey || responses.length === 0) return;

    const headers = ['Alumni Name', 'Email', 'Response Date'];
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        headers.push(question.question_text);
      });
    });

    const csvRows = groupResponsesByAlumni().map(alumni => [
      alumni.alumni_name,
      alumni.alumni_email,
      alumni.response_date,
      ...survey.sections.flatMap(section =>
        section.questions.map(question => alumni.answers[question.question_id] || 'No Response')
      )
    ]);

    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.survey}_${surveyId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`survey-info-responses-container ${isMobile ? 'mobile' : ''}`}>
      <AdminSidebar />

      {loading ? <CircularLoader /> : (
        <div className={`survey-info-content ${isMobile ? 'mobile-content' : ''}`}>
          <h1 className="survey-info-title">{survey?.survey}</h1>
          <p className="survey-info-description">{survey?.description}</p>
          <div className={`survey-info-dates ${isMobile ? 'mobile-dates' : ''}`}>
            <span>Start Date: {new Date(survey?.start_date).toLocaleDateString()}</span>
            <span>End Date: {new Date(survey?.end_date).toLocaleDateString()}</span>
          </div>

          {/* Survey Sections and Questions */}
          {survey.sections.map(section => (
            <div key={section.section_id}>
              <h2 className="survey-info-subtitle">{section.section_title}</h2>
              <p>{section.section_description}</p>
              {section.questions.map(question => (
                <div key={question.question_id} className={`survey-question ${isMobile ? 'mobile-question' : ''}`}>
                  <h5>{question.question_text} <strong>{question.is_required ? '*' : ''} </strong></h5>
                  {(question.question_type === 'Multiple Choice' || question.question_type === 'Rating' || question.question_type === 'Dropdown') && (
                    <ul>
                      {question.options.map(option => (
                        <li key={option.option_id}>{option.option_text} - {option.option_value}</li>
                      ))}
                    </ul>
                  )}
                  {question.question_type === 'Open-ended' && <p>(Open-ended response)</p>}
                </div>
              ))}
            </div>
          ))}

          {/* Survey Responses Table */}
          <div className='d-flex justify-content-between align-items-center'>
            <h2 className='survey-info-subtitle'>Survey Responses</h2>
            <button className="btn export-as-csv-btn" onClick={exportAsCSV}>Export as CSV</button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Alumni Name</th>
                  <th>Email</th>
                  <th>Response Date</th>
                  {survey.sections.flatMap(section =>
                    section.questions.map(question => (
                      <th key={question.question_id}>{question.question_text}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {groupResponsesByAlumni().map((alumni, index) => (
                  <tr key={index}>
                    <td>{alumni.alumni_name}</td>
                    <td>{alumni.alumni_email}</td>
                    <td>{alumni.response_date}</td>
                    {survey.sections.flatMap(section =>
                      section.questions.map(question => (
                        <td key={question.question_id}>{alumni.answers[question.question_id] || 'No Response'}</td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyInformationResponses;
