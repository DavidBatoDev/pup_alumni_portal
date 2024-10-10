import "./signUpForms.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AccountDetailsForm = ({ nextStep, prevStep, formData, handleChange }) => {

  const [validation, setValidation] = useState({
    student_number: true,
    email: true,
    password: true,
    password_confirmation: true,
  });

  const validateFields = () => {
    const newValidation = {
      student_number: formData.student_number.trim() !== '',
      email: formData.email.trim() !== '' && /\S+@\S+\.\S+/.test(formData.email),
      password: formData.password.trim() !== '',
      password_confirmation: formData.password_confirmation.trim() !== '' && formData.password === formData.password_confirmation,
    };

    setValidation(newValidation);

    // Return true if all fields are valid
    return Object.values(newValidation).every(value => value === true);
  };

  const handleNextClick = () => {
    if (validateFields()) {
      nextStep();
    }
  };


  return (
    <div className="form-section">
      <h3 className="section-title">ACCOUNT DETAILS</h3>
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
      <div className="d-flex justify-content-between">
        <Link to="/login" className="sign-in-link">Already have an account?</Link>
        <button className="btn btn-danger" onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};



export default AccountDetailsForm;