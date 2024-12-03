// src/components/SurveyPopupModal/SurveyPopupModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalContainer from "../ModalContainer/ModalContainer";
import CustomAlert from "../CustomAlert/CustomAlert"; // Uncomment if using CustomAlert
import SurveyCard from "../SurveyCards/SurveyCards";
import "./SurveyPopupModal.css";
import api from "../../api";
import { useSelector } from "react-redux";

const SurveyPopupModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);

  // Fetch surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        if (!isAuthenticated) {
          setShowModal(false);
          return;
        }
        setLoading(true);
        const response = await api.get("/api/survey/unanswered-surveys");
        console.log("Unanswered Surveys: ", response.data.surveys);
        setSurveys(response.data?.surveys || []);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("showSurveyModal") === "true" &&
      location.pathname !== "/login"
    ) {
      setShowModal(true);
      localStorage.removeItem("showSurveyModal");
    }
  }, [location]);

  // Handle error logging
  useEffect(() => {
    if (error) {
      console.log("Error (SurveyPopupModal.jsx): ", error);
    }
  }, [error]);

  const handleRedirect = (surveyId) => {
    navigate(`/survey/${surveyId}`);
  };

  return (
    <ModalContainer
      showModal={showModal}
      closeModal={() => setShowModal(false)}
      title="Survey Notification"
    >
      {loading && <div>Loading...</div>}

      {/* Render error message if exists */}
      {error && (
        <div className="error-message">
          {error.message || "An error occurred."}
        </div>
      )}

      {!loading && !error && surveys.length > 0 && (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center my-4 gap-3">
            <div className="survey-popup-icon-container">
              <i className="survey-popup-icon fa-regular fa-2xl fa-bell"></i>
            </div>
            <h4>
              {surveys.length > 0
                ? `You have ${surveys.length} surveys to complete!`
                : "No new surveys available."}
            </h4>
          </div>
          <div className="survey-card-popup">
            {surveys?.length > 0 ? (
              <SurveyCard surveys={surveys} answered={false} />
            ) : (
              !loading && <p>No surveys available.</p>
            )}
          </div>
        </>
      )}

      {!loading && !error && surveys.length === 0 && (
        <p>No new surveys available at the moment.</p>
      )}

      {/* Optional: Uncomment and use CustomAlert for better error handling */}

      {error && (
        <CustomAlert
          severity="error"
          message={error.message || "An error occurred."}
          onClose={() => setError(null)}
        />
      )}
    </ModalContainer>
  );
};

export default SurveyPopupModal;
