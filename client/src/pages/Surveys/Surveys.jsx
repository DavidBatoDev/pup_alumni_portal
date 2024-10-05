import React, { useState, useEffect } from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import Navbar from "../../components/Navbar/Navbar";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Surveys.css"; // Updated CSS file for styling
import axios from "axios";
import SurveyCard from "../../components/SurveyCards/SurveyCards"; // Import the updated SurveyCard component

const Surveys = () => {
  const DummyData = [
    {
      title: "Survey 1",
      description: "Description of Survey 1",
      link: "/survey/1",
    },
    {
      title: "Survey 2",
      description: "Description of Survey 2",
      link: "/survey/2",
    },
    {
      title: "Survey 3",
      description: "Description of Survey 3",
      link: "/survey/3",
    },
    {
      title: "Survey 4",
      description: "Description of Survey 4",
      link: "/survey/4",
    }
  ];

  const [unansweredSurveysData, setUnansweredSurveysData] = useState([]);
  const [answerSurveyData, setAnswerSurveyData] = useState(DummyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch surveys from the API
    const fetchUnansweredSurveys = async () => {
      try {
        const response = await axios.get("/api/unanswered-surveys", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUnansweredSurveysData(response.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };

    const fetchAnsweredSurveys = async () => {
      try {
        const response = await axios.get("/api/answered-surveys", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAnswerSurveyData(response.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };

    fetchAnsweredSurveys();
    fetchUnansweredSurveys();
  }, []);

  return (
    <div>
      {/* Authenticated Navigation Bar */}
      <Navbar />

      {/* Banner Section */}
      <BannerSmall
        bannerTitle={"Surveys Page"}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Surveys", link: "/surveys" },
        ]}
      />

      {/* Main Survey Section */}
      <div className="survey-section">
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
              <div>Loading surveys...</div>
            ) : (
              <SurveyCard surveys={unansweredSurveysData} answered={false} />
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
              <div>Loading surveys...</div>
            ) : (
              <SurveyCard surveys={answerSurveyData} answered={true} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Surveys;
