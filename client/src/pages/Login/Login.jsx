import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../store/userSlice";
import Navbar from "../../components/Navbar/Navbar";
import "./Login.css";
import "../../global.css";
import MainFooter from "../../components/MainFooter/MainFooter";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from "../../assets/images/pup-login-banner.jpg";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ModalContainer from "../../components/ModalContainer/ModalContainer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validation, setValidation] = useState({
    email: true,
    password: true,
  });

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [navigate]);

  const onClearError = () => {
    setError("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/forgot-password", {
        email: forgotPasswordEmail,
      });
      if (response.data.success) {
        setForgotPasswordModal(false);
        setWaitingForResponse(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // make the email url encoded
      const emailUrl = encodeURIComponent(forgotPasswordEmail);

      console.log(emailUrl);

      const response = await axios.get(
        `/api/reset-password/${resetToken}?email=${emailUrl}`
      );
      if (response.data.success) {
        setWaitingForResponse(false);
        setChangePasswordModal(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to verify token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/reset-password/${resetToken}`, {
        email: forgotPasswordEmail,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      if (response.data.success) {
        setChangePasswordModal(false);
        setSuccessMessage(
          "Password changed successfully. Please log in with your new password."
        );
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to change password. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors
      setError("");
      setValidationErrors({});
      setLoading(true);

      // Send a POST request to the backend for authentication
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      // Destructure the token and user from the response
      const { token, user } = response.data;

      // Dispatch the login action to store user info in Redux
      dispatch(login({ user: user, role: "alumni" }));

      // Store the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("showSurveyModal", true);

      // Redirect to the events page
      navigate("/events");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) {
        // If there are validation errors from Laravel
        if (err.response.status === 422) {
          setValidationErrors(err.response.data.errors);
        } else if (err.response.status === 401) {
          // Handle login errors (invalid credentials)
          setError(err.response.data.message);
        } else {
          setError("Something went wrong, please try again.");
        }
      } else {
        setError("Network error, please try again later.");
      }
    }
  };

  const handleShowPasswordToggle = (setter) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setter((prevState) => !prevState);
  };

  return (
    <>
      {error && (
        <CustomAlert message={error} severity="error" onClose={onClearError} />
      )}
      {successMessage && (
        <CustomAlert
          message={successMessage}
          severity="success"
          onClose={() => setSuccessMessage("")}
        />
      )}
      <Navbar />
      <div className="background login-background"></div>
      <div className="login-page">
        {/* Banner area */}
        <BannerSmall bannerTitle={"Login"} bannerImage={bannerImage} title='Forgot Password' />
        <ModalContainer
          showModal={forgotPasswordModal}
          closeModal={() => setForgotPasswordModal(false)}
          hideHeader={true}
        >
          <div className="forgot-password-modal">
            <div className="forgot-password-modal--container">
              <h2 className="forgot-password-modal--title">Forgot Password?</h2>
              <p className="forgot-password-modal--description">
                Enter your email address below and we'll send you a code to
                reset your password.
              </p>
              <form
                className="forgot-password-modal--form"
                onSubmit={handleForgotPasswordSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn-danger w-100">
                    Send Reset Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalContainer>

        {/* modal for waiting for confrimation of the reset link */}

        <ModalContainer showModal={waitingForResponse} hideHeader={true} title='Forgot Password'>
          <div className="forgot-password-modal">
            <div className="forgot-password-modal--container">
              <h2 className="forgot-password-modal--title">
                Reset code Sent...
              </h2>
              <p className="forgot-password-modal--description">
                We have sent a token to your email. Please check your email and
                paste the token below.
              </p>
              <form
                className="forgot-password-modal--form"
                onSubmit={handleVerifyTokenSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="resetToken" className="form-label">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste the token here"
                  />

                  <button type="submit" className="btn btn-danger w-100 mt-3">
                    Verify Token
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalContainer>

        {/* modal for changing password */}
        <ModalContainer showModal={changePasswordModal} hideHeader={true} title='Forgot Password'>
          <div className="forgot-password-modal">
            <div className="forgot-password-modal--container">
              <h2 className="forgot-password-modal--title">Change Password</h2>
              <p className="forgot-password-modal--description">
                Enter your new password below.
              </p>
              <form
                className="forgot-password-modal--form"
                onSubmit={handleChangePasswordSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                    />
                    <span className="input-group-text bg-white" onMouseDown={handleShowPasswordToggle(setShowNewPassword)}>
                      <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                    />
                    <span className="input-group-text bg-white" onMouseDown={handleShowPasswordToggle(setShowConfirmPassword)}>
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn btn-danger w-100">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalContainer>

        {/* Login Box with two columns */}
        <div className="sign-in-glass-container glass">
          <div className="row justify-content-center">
            <div className="col-md-10 login-box p-5">
              <div className="row">
                {/* Left Column: Login Form */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                  <h2 className="welcome-text mb-1">Welcome Back!</h2>
                  <p className="login-description">
                    Log in to access exclusive alumni resources, connect with
                    fellow graduates, and take advantage of our career support
                    services. Your network and opportunities await you.
                  </p>

                  {/* Display validation errors */}
                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Student Number or Personal Email{" "}
                        <span className="txt-danger">*</span>
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
                        <div className="text-danger">
                          {validationErrors.email[0]}
                        </div>
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
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span className="input-group-text btn-show-password bg-white" onMouseDown={handleShowPasswordToggle(setShowPassword)}>
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                      </div>
                      {validationErrors.password && (
                        <div className="text-danger">
                          {validationErrors.password[0]}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div
                        className="forgot-password-link"
                        onClick={() => setForgotPasswordModal(true)}
                      >
                        Forgot Password?
                      </div>

                      <Link to="/admin/login" className="forgot-password-link">
                        Are you an Admin?
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
                    For questions/comments, please email{" "}
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
      {loading && <CircularLoader />}
    </>
  );
};

export default Login;
