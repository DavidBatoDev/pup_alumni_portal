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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/events" element={<AdminEventsDashboard />} />
        <Route path="/admin/survey-feedback" element={<AdminSurveyDashboard />} />

        {/* Protected Routes  element={<ProtectedRoute />} */}
        <Route>
          <Route path="/event" element={<Events />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
