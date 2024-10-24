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
        <h2 className="survey-info-subtitle">Survey Questions</h2>
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
        <h2 className="survey-info-subtitle">Survey Responses</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>Alumni Name</th>
                <th>Email</th>
                <th>Response Date</th>
                {survey?.questions.map((question) => (
                  <th key={question.question_id}>{question.question_text}</th>
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
                    {response.question_responses.map((qr) => (
                      <td key={qr.question_id}>
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
