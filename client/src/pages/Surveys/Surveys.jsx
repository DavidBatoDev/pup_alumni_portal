import React, { useState, useEffect } from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import AuthenticatedNav from "../../components/NavAuthenticated/NavAuthenticated";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Surveys.css"; // Updated CSS file for styling
import axios from "axios";
import SurveyCard from "../../components/SurveyCard/SurveyCard"; // Import the updated SurveyCard component

const Surveys = () => {
  const [surveysData, setSurveysData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch surveys from the API
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("/api/surveys", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); 
        setSurveysData(response.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div>
      {/* Authenticated Navigation Bar */}
      <AuthenticatedNav />
      
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
              <SurveyCard surveys={surveysData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surveys;
