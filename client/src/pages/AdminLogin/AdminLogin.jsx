import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../../store/userSlice';
import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import './AdminLogin.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import CustomAlert from '../../components/CustomAlert/CustomAlert';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setValidationErrors({});
      setLoading(true);

      // Send a POST request to the backend for authentication
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      if (response.status !== 200) {
        const errorMessage = response.data.error
        console.log(errorMessage);
        setError(errorMessage);
      } 

      const { token, user } = response.data;

      dispatch(login({ user: user, role: 'admin' }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to the admin dashboard
      navigate('/admin/events');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(err.response);
        if (err.response.status === 422) {
          setValidationErrors(err.response.data.errors);
        } else if (err.response.status === 401) {
          setError(err.response.data.error);
        }
        else if (err.response.status === 500) {
          setError(err.response.data.error);
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
      {error && <CustomAlert severity="error" message={error} onClose={() => setError("")} />}
      <Navbar />
      <div className="background admin-login-background"></div>
      <div className="login-page">
        <BannerSmall bannerTitle="Admin Login" bannerImage={bannerImage} />
        <div className="admin-sign-in-glass-container glass">
          <div className="row justify-content-center">
            <div className="col-md-10 login-box p-5">
              <div className="row">
                {/* Left Column: Admin Login Form */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                  <h2 className="admin-welcome-text">Admin Panel Access</h2>
                  <p className="admin-login-description">
                    Please log in to access the administrative features and manage the platform effectively.
                  </p>

                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="txt-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="fas fa-user-shield"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="email"
                          placeholder="admin@example.com"
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

                    <button type="submit" className="btn btn-danger w-100">
                      Admin Sign In
                    </button>
                  </form>
                  <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                      <Link to="/login" className="forgot-password-link">
                        Are you an Alumni?
                      </Link>
                    </div>
                </div>

                {/* Right Column: Admin Support Section */}
                <div className="col-md-6 g-5 d-flex flex-column align-items-center justify-content-center admin-support-box">
                  <h2 className="txt-danger">Need Assistance?</h2>
                  <p className="text-center">
                    For technical support or account-related queries, please contact:{' '}
                    <a href="mailto:adminsupport@example.com">adminsupport@example.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
      {loading && <CircularLoader />}
    </>
  );
};

export default AdminLogin;
