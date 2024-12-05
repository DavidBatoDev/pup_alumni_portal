// src/App.js
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './global.css';
import Events from './pages/Events/Events';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminEventsDashboard from './pages/AdminEventsDashboard/AdminEventsDashboard';
import AdminSurveyDashboard from './pages/AdminSurveyDashboard/AdminSurveyDashboard';
import SurveyInformationResponses from './pages/SurveyInformationResponses/SurveyInformationResponses';
import AdminSpecificEvent from './pages/AdminSpecificEvent/AdminSpecificEvent';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';
import Surveys from './pages/Surveys/Surveys';
import AnswerSurvey from './pages/AnswerSurvey/AnswerSurvey';
import ProfileLayout from './components/ProfileLayout/ProfileLayout';
import ProfileOverview from './pages/Profile/ProfileOverview';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ProfilePasswordSecurity from './pages/Profile/ProfilePasswordSecurity';
import ProfileNotificationPreferences from './pages/Profile/ProfileNotificationPreferences';
import ProfilePrivacySettings from './pages/Profile/ProfilePrivacySettings';
import SpecificEvent from './pages/SpecificEvent/SpecificEvent';
import EventHistory from './pages/EventHistory/EventHistory';
import SpecificHistoryPage from './pages/SpecificHistoryPage/SpecificHistoryPage';
import Alumni from './pages/Alumni/Alumni';
import OtherProfile from './pages/Profile/OtherProfile';
import echo from './echo';
import SurveyPopupModal from './components/SurveyPopupModal/SurveyPopupModal';
import Discussions from './pages/Discussions/Discussions';
import SpecificDiscussion from './pages/SpecificDiscussion/SpecificDiscussion';
import SpecificAnsweredSurvey from './pages/SpecificAnsweredSurvey/SpecificAnsweredSurvey';
import api from './api';
import { useSelector } from 'react-redux';

function App() {
  const {user, role, isAuthenticated} = useSelector((state) => state.user);

  const [showSurvey, setShowSurvey] = useState(true);

  console.log(role != 'alumni');

  useEffect(() => {
    const fetchUnansweredSurveys = async () => {
      setShowSurvey(false);
      try {
        if (!isAuthenticated || role != 'alumni') return;
        const response = await api.get("/api/survey/unanswered-surveys");
        setShowSurvey(response.data?.surveys.length > 0);
      } catch (error) {
        setShowSurvey(false);
      }
    };

    fetchUnansweredSurveys();
  }, [user, role, isAuthenticated]);

  return (
    <Router>
      {showSurvey && <SurveyPopupModal />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes for Alumni */}
        <Route > {/*element={<ProtectedRoute allowedRoles={['alumni']} />*/}

            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<ProfileOverview />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="security" element={<ProfilePasswordSecurity />} />
              <Route path="notifications" element={<ProfileNotificationPreferences />} />
              <Route path="privacy" element={<ProfilePrivacySettings />} />
            </Route>

            {/* Alumni */}
            <Route path="/alumni" element={<Alumni />} />

            <Route path="/profile/:alumniId" element={<OtherProfile />} />

            {/* Survey */}
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/survey/:surveyId" element={<AnswerSurvey />} />

            {/* Events */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<SpecificEvent />} />
            <Route path="/events/events-history" element={<EventHistory />} />
            <Route path="/events/events-history/:eventId" element={<SpecificHistoryPage />} />

            {/* Threads */}
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/discussions/:threadId" element={<SpecificDiscussion />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminEventsDashboard />} />
          <Route path="/admin/events" element={<AdminEventsDashboard />} />
          <Route path="/admin/event/:eventId" element={<AdminSpecificEvent />} />
          <Route path="/admin/survey-feedback" element={<AdminSurveyDashboard />} />
          <Route path="/admin/survey/:surveyId" element={<SurveyInformationResponses />} />
          <Route path="/admin/create-survey" element={<CreateSurvey />} />
          <Route path="/admin/survey/answered" element={<SpecificAnsweredSurvey/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
