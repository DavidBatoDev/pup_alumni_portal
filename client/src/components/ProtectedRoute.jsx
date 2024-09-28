// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
