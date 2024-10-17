// src/components/Banner/Banner.jsx
import React from 'react';
import './Banner.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Banner = () => {
  const { user } = useSelector((state) => state.user);


  return (
    <div className="banner">
        <div className="banner-content">
            <h1 className="banner-hero-title">PUPGS ALUMNI</h1>
              {user?.user ? (
                <>
                  <p className="banner-hero-motto">Welcome back,  {user?.user.first_name}!</p>
                </>
              )
              : (
                <>
                  <p className="banner-hero-motto">Welcome to the PUP Alumni Graduate School Portal</p>
                  <br />
                  <p>Connect, Share, and Grow with our PUP Alumni Community</p>
                </>
              )}

            <div className="banner-buttons">
              {user ? (
                <>
                <Link to="/events" className="btn btn-register">View Events</Link>
                <Link to="/surveys" className="btn btn-signin">View Surveys</Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-register me-3">Register Now</Link>
                  <Link to="/login" className="btn btn-signin">Sign In</Link>
                </>
                )}
            </div>
        </div>
    </div>
  );
};

export default Banner;
