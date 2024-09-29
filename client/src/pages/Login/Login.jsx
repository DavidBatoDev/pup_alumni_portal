import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../../store/userSlice';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';
import '../../global.css';
import MainFooter from '../../components/MainFooter/MainFooter';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors
      setError('');
      setValidationErrors({});

      // Send a POST request to the backend for authentication
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      console.log(response.data);

      // Destructure the token and user from the response
      const { token, user } = response.data;

      // Dispatch the login action to store user info in Redux
      dispatch(login(user));

      // Store the token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to the events page
      navigate('/event');
    } catch (err) {
      console.log(err);

      if (err.response) {
        // If there are validation errors from Laravel
        if (err.response.status === 422) {
          setValidationErrors(err.response.data.errors);
        } else if (err.response.status === 401) {
          // Handle login errors (invalid credentials)
          setError(err.response.data.message);
        } else {
          setError('Something went wrong, please try again.');
        }
      } else {
        setError('Network error, please try again later.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className = "background login-background"></div>
      <div className="login-page">
        {/* Banner area */}
        <div className="banner-section">
          <h1 className="login-title">Login</h1>
        </div>

        {/* Login Box with two columns */}
        <div className="sign-in-glass-container glass">
          <div className="row justify-content-center">
            <div className="col-md-10 login-box p-5">
              <div className="row">
                {/* Left Column: Login Form */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                  <h2 className="welcome-text">Welcome Back!</h2>
                  <p className="login-description">
                    Log in to access exclusive alumni resources, connect with fellow graduates, and take advantage of our career support services. Your network and opportunities await you.
                  </p>

                  {/* Show general error message if login fails */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Display validation errors */}
                  <form className="login-form" onSubmit={handleSubmit}>
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      {validationErrors.email && (
                        <div className="text-danger">{validationErrors.email[0]}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password <span className="txt-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {validationErrors.password && (
                        <div className="text-danger">{validationErrors.password[0]}</div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Link to="#" className="forgot-password-link">
                        Forgot password?
                      </Link>
                    </div>

                    <button type="submit" className="btn btn-danger w-100">
                      Sign In
                    </button>
                  </form>
                </div>

                {/* Right Column: Sign Up Section */}
                <div className="col-md-6 g-5 d-flex flex-column align-items-center justify-content-center sign-up-box">
                  <h2 className="txt-danger">Don't have an account yet?</h2>
                  <p className="text-center">
                    PUP Alumni Students, you can create an account here:
                  </p>
                  <Link to="/signup" className="btn btn-outline-danger">
                    Sign Up
                  </Link>
                  <p className="contact-support mt-3">
                    For questions/comments, please email{' '}
                    <a href="mailto:help@pupalumniportal.dev">
                      help@pupalumniportal.dev
                    </a>
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
