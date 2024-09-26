// src/pages/Login/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';
import '../../global.css';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="login-page">
        {/* Banner area */}
        <div className="banner-section">
          <h1 className="login-title">Login</h1>
        </div>

        {/* Login Box with two columns */}
        <div className=" glass-container glass">
          <div className="row justify-content-center">
            <div className="col-md-10 login-box p-5">
              <div className="row">
                {/* Left Column: Login Form */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                  <h2 className="welcome-text">Welcome Back!</h2>
                  <p className="login-description">
                    Log in to access exclusive alumni resources, connect with fellow graduates, and take advantage of our career support services. Your network and opportunities await you.
                  </p>
                  <form className="login-form">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Student Number or Personal Email <span className="txt-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="fas fa-user"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="email"
                          placeholder="20XX-MN-XXXX-X or johndoe@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password <span className="txt-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Link to="#" className="forgot-password-link">
                        Forgot password?
                      </Link>
                    </div>

                    <button onClick={() => navigate('/event')} type="submit" className="btn btn-danger w-100">Sign In</button>
                  </form>
                </div>

                {/* Right Column: Sign Up Section */}
                <div className="col-md-6 g-5 d-flex flex-column align-items-center justify-content-center sign-up-box">
                  <h2 className="txt-danger">Doesn't have an account yet?</h2>
                  <p className="text-center">
                    PUP Alumni Students, you can create an account here:
                  </p>
                  <Link to="/signup" className="btn btn-outline-danger">Sign Up</Link>
                  <p className="contact-support mt-3">
                    For questions/comments, please email <a href="mailto:help@pupalumniportal.dev">help@pupalumniportal.dev</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Login;
