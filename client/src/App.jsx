// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/signup';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './global.css';
import Events from './pages/Events/Events';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminEventsDashboard from './pages/AdminEventsDashboard/AdminEventsDashboard';
import AdminSurveyDashboard from './pages/AdminSurveyDashboard/AdminSurveyDashboard';
import SurveyInformationResponses from './pages/SurveyInformationResponses/SurveyInformationResponses';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';
import Surveys from './pages/Surveys/Surveys';
import AnswerSurvey from './pages/AnswerSurvey/AnswerSurvey';
import Profile from './pages/Profile/Profile';
import ProfileLayout from './components/ProfileLayout/ProfileLayout';
import ProfileOverview from './pages/Profile/ProfileOverview';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ProfilePasswordSecurity from './pages/Profile/ProfilePasswordSecurity';
import ProfileNotificationPreferences from './pages/Profile/ProfileNotificationPreferences';
import ProfilePrivacySettings from './pages/Profile/ProfilePrivacySettings';
import SpecificEvent from './pages/SpecificEvent/Specificevent'; // Ensure the path is correct


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes for Alumni */}
        <Route > {/*element={<ProtectedRoute allowedRoles={['alumni']} />*/}
            {/* Profile */}
            <Route path="/old-profile" element={<Profile />} />
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<ProfileOverview />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="security" element={<ProfilePasswordSecurity />} />
              <Route path="notifications" element={<ProfileNotificationPreferences />} />
              <Route path="privacy" element={<ProfilePrivacySettings />} />
            </Route>

            {/* Survey */}
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/survey/:surveyId" element={<AnswerSurvey />} />

            {/* Events */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventTitle" element={<SpecificEvent />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminEventsDashboard />} />
          <Route path="/admin/events" element={<AdminEventsDashboard />} />
          <Route path="/admin/survey-feedback" element={<AdminSurveyDashboard />} />
          <Route path="/admin/survey/:surveyId" element={<SurveyInformationResponses />} />
          <Route path="/admin/create-survey" element={<CreateSurvey />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
