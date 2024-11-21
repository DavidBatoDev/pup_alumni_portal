import React, { useState, useEffect } from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import Navbar from "../../components/Navbar/Navbar";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Surveys.css"; // Updated CSS file for styling
import axios from "axios";
import '../../global.css';
import SurveyCard from "../../components/SurveyCards/SurveyCards"; // Import the updated SurveyCard component
import CustomAlert from "../../components/CustomAlert/CustomAlert"; // Import CustomAlert
import SurveySearchBar from "../../components/SurveySearchBar/SurveySearchBar";
import echo from "../../echo"; 

const Surveys = () => {
  const [unansweredSurveysData, setUnansweredSurveysData] = useState([]);
  const [answerSurveyData, setAnswerSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle API errors

  useEffect(() => {
    // Fetch surveys from the API
    const fetchUnansweredSurveys = async () => {
      try {
        const response = await axios.get("/api/survey/unanswered-surveys", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUnansweredSurveysData(response.data.surveys);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnsweredSurveys = async () => {
      try {
        const response = await axios.get("/api/survey/answered-surveys", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAnswerSurveyData(response.data.surveys);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredSurveys();
    fetchUnansweredSurveys();
  }, []);

  useEffect(() => {
    echo.channel('alumni')
      .listen('SurveyCreated', (data) => {
        console.log(data)
        setUnansweredSurveysData((prevState) => {
          const alreadyExists = prevState.some((e) => e.survey_id === data.survey.survey_id);
          if (alreadyExists) return prevState;
          return [...prevState, data.survey];
        });
      });

    return () => {
      echo.leaveChannel('alumni');
    };
  }, []);

  // Clear the error message
  const handleClearError = () => setError(null);

  return (
    <div>
      {/* Authenticated Navigation Bar */}
      <Navbar />
      <div className="background login-background"></div>

      {/* Banner Section */}
      <BannerSmall
        bannerTitle={"Surveys Page"}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Surveys", link: "/surveys" },
        ]}
      />

      {/* Display CustomAlert if there's an error */}
      {error && (
        <CustomAlert
          message={error}
          severity="error"
          onClose={handleClearError} // Close alert handler
        />
      )}

      {/* Main Survey Section */}
      <div className="surveys-section glass">
        <div className="container">
          {/* Unanswered Surveys Section */}
          <div className="survey-header">
            <h2>Participate in Our Surveys</h2>
            <h5>
              Your feedback is valuable to us! Please take a few moments to complete any of the surveys listed below.
            </h5>
          </div>
          <div className="surveys-container">
            {loading ? (
              <div className="loading-surveys">
                <h3>Loading Surveys...</h3>
              </div>
            ) : (
              <div className="survey-list-container">
                <SurveySearchBar surveys={unansweredSurveysData} answered={false} />
                <SurveyCard surveys={unansweredSurveysData} answered={false} />
              </div>
            )}
          </div>

          <div className="line-seperator"></div>

          {/* Answered Surveys Section */}
          <div className="survey-header answered-section">
            {answerSurveyData.length > 0 && (
              <>
                <h2>Answered Surveys</h2>
                <h5>
                  Here are the surveys you have already completed. Thank you for your participation!
                </h5>
              </>
            )}
          </div>
          <div className="surveys-container">
            {loading ? (
              <div className="loading-surveys">
                <h3>Loading Surveys...</h3>
              </div>
            ) : (
              <div className="survey-list-container">
                <SurveySearchBar surveys={answerSurveyData} answered={true} />
                <SurveyCard surveys={answerSurveyData} answered={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surveys;
