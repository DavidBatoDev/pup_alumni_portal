import "./signUpForms.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AccountDetailsForm = ({ nextStep, prevStep, formData, handleChange }) => {
  const [emailEntered, setEmailEntered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [validation, setValidation] = useState({
    email: true,
    student_number: true,
    password: true,
    password_confirmation: true,
  });

  const validateFields = () => {
    const newValidation = {
      email: formData.email.trim() !== '' && /\S+@\S+\.\S+/.test(formData.email),
      student_number: formData.student_number.trim() !== '',
      password: formData.password.trim() !== '',
      password_confirmation: formData.password_confirmation.trim() !== '' && formData.password === formData.password_confirmation,
    };

    setValidation(newValidation);

    // Return true if all fields are valid
    return Object.values(newValidation).every(value => value === true);
  };

  const validateEmailField = () => {
    const emailValid = formData.email.trim() !== '' && /\S+@\S+\.\S+/.test(formData.email);
    setValidation(prevValidation => ({ ...prevValidation, email: emailValid }));
    return emailValid;
  };

  const handleNextClick = () => {
    if (emailEntered || validateEmailField()) { // Check email validation before proceeding
      // Dummy email verification function
      const emailVerification = () => {
        // Simulate an email verification process
        const emailExists = formData.email === 'existing@example.com'; // Dummy condition
        setIsEmailVerified(emailExists);
        setShowModal(true);
      };

      emailVerification();
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (isEmailVerified) {
      setEmailEntered(true);
    } else {
      setEmailEntered(true);
    }
  };

  const handleFinalNextClick = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <div className="form-section">
      {
        emailEntered
          ? <h3 className="section-title">ACCOUNT DETAILS</h3>
          :
          <>
            <h2 className="welcome-text mb-1">Welcome Alumni!</h2>
            <p className="login-description text-justify">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem incidunt ducimus quis sit? Ducimus quidem excepturi quos distinctio corporis fugit inventore aut, laudantium sunt, doloremque itaque harum quod? Maiores, molestiae!
            </p>
          </>
      }

      <div className="form-group">
        <label>
          Personal Email <span className="important-txt">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            type="email"
            className={`form-control ${validation.email ? '' : 'is-invalid'}`}
            name="email"
            placeholder="johndoe@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!validation.email && (
            <div className="invalid-feedback">Valid email is required</div>
          )}
        </div>
      </div>

      {emailEntered && (
        <>
          <div className="form-group">
            <label>
              Student Number <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                className={`form-control ${validation.student_number ? '' : 'is-invalid'}`}
                name="student_number"
                placeholder="200X-MN-XXXX-X"
                value={formData.student_number}
                onChange={handleChange}
              />
              {!validation.student_number && (
                <div className="invalid-feedback">Student number is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>
              Password <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <input
                type="password"
                className={`form-control ${validation.password ? '' : 'is-invalid'}`}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {!validation.password && (
                <div className="invalid-feedback">Password is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>
              Confirm Password <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <input
                type="password"
                className={`form-control ${validation.password_confirmation ? '' : 'is-invalid'}`}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              {!validation.password_confirmation && (
                <div className="invalid-feedback">Passwords must match</div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between">
        <Link to="/login" className="sign-in-link">Already have an account?</Link>
        {emailEntered ? (
          <button className="btn btn-danger" onClick={handleFinalNextClick}>Next</button>
        ) : (
          <button className="btn btn-danger" onClick={handleNextClick}>Verify Email</button>
        )}
      </div>

      {/* Modal */}
      <div className={`modal email-popup glass fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Your Identity</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {isEmailVerified
                ? <p>We found your information in our database. Is this you?</p> // Show the account details including name, batch, program, etc.
                : <p>No account associated with this email. Would you like to continue with the provided email?</p>
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{isEmailVerified ? "Cancel" : "Try Another Email"}</button>
              <button type="button" className="btn btn-danger" onClick={handleModalConfirm}>{isEmailVerified ? "Confirm" : "Continue"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsForm;
