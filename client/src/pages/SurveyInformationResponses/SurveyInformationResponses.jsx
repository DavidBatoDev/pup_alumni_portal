import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './SurveyInformationResponses.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import { useMediaQuery } from 'react-responsive'; // Import useMediaQuery

const SurveyInformationResponses = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define media query for mobile responsiveness
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
        setResponses(responsesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  // Function to export table data as CSV
  const exportAsCSV = () => {
    if (!survey || responses.length === 0) return;

    // Create CSV headers
    const headers = [
      'Alumni Name',
      'Email',
      'Response Date',
      ...survey.questions.map((_, index) => `Question ${index + 1}`)
    ];

    // Format the response data for CSV
    const csvRows = responses.map((response) => {
      const row = [
        `${response.alumni_first_name} ${response.alumni_last_name}`,
        response.alumni_email,
        new Date(response.response_date).toLocaleDateString(),
        ...response.question_responses.map((qr) =>
          qr.response_text || qr.option_id ? qr.response_text || `Value - ${qr.option_value}` : 'No Response'
        )
      ];
      return row;
    });

    // Combine headers and rows for CSV content
    const csvContent = [
      headers.join(','), // Join headers with commas
      ...csvRows.map((row) => row.join(',')) // Join each row with commas
    ].join('\n'); // Separate each row with a newline

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `SurveyResponses_${surveyId}.csv`;
    a.click();

    // Cleanup the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`survey-info-responses-container ${isMobile ? 'mobile' : ''}`}>
      <AdminSidebar />

      {loading && <CircularLoader />}

      <div className={`survey-info-content ${isMobile ? 'mobile-content' : ''}`}>
        <h1 className="survey-info-title">{survey?.survey}</h1>
        <p className="survey-info-description">{survey?.description}</p>
        <div className={`survey-info-dates ${isMobile ? 'mobile-dates' : ''}`}>
          <span>Start Date: {new Date(survey?.start_date).toLocaleDateString()}</span>
          <span>End Date: {new Date(survey?.end_date).toLocaleDateString()}</span>
        </div>

        {/* Survey Questions Section */}
        <div className="survey-info-subtitle"> 
          <h2>Survey Questions</h2>
        </div>
        {survey?.questions.map((question, index) => (
          <div key={question.question_id} className={`survey-question ${isMobile ? 'mobile-question' : ''}`}>
            <h5>{index + 1}. {question.question_text}</h5>
            {(question.question_type === 'Multiple Choice' || question.question_type === 'Rating') && (
              <ul>
                {question.options.map((option) => (
                  <li key={option.option_id}>{option.option_text} - {option.option_value}</li>
                ))}
              </ul>
            )}
            {question.question_type === 'Open-ended' && <p>(Open-ended response)</p>}
          </div>
        ))}

        {/* Survey Responses Section */}
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='survey-info-subtitle '>Survey Responses</h2>

          {/* Export as CSV Button */}
          <div 
            className="export-as-csv-btn btn btn-light d-flex align-items-center"
            onClick={exportAsCSV} // Attach the export function to the button click
          >
            Export as CSV
          </div>
        </div>

        {/* Table of Responses */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>Alumni Name</th>
                <th>Email</th>
                <th>Response Date</th>
                {/* Display "Question 1", "Question 2", etc., instead of question names */}
                {survey?.questions.map((_, index) => (
                  <th key={index}>Question {index + 1}</th> 
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.length > 0 ? (
                responses.map((response) => (
                  <tr key={response.response_id}>
                    <td>{response.alumni_first_name} {response.alumni_last_name}</td>
                    <td>{response.alumni_email}</td>
                    <td>{new Date(response.response_date).toLocaleDateString()}</td>
                    {/* Render each question response in its corresponding cell */}
                    {response.question_responses.map((qr, index) => (
                      <td key={index}>
                        {qr.response_text || qr.option_id ? qr.response_text || `Value - ${qr.option_value}` : 'No Response'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3 + survey?.questions.length} className="text-center">
                    No responses available for this survey.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyInformationResponses;
