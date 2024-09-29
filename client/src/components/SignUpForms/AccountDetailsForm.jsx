import "./signUpForms.css";
import React from 'react';
import { Link } from 'react-router-dom';

const AccountDetailsForm = ({ nextStep, prevStep, formData, handleChange }) => {
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
                                    className="form-control"
                                    name="student_number"
                                    placeholder="200X-MN-XXXX-X"
                                    value={formData.student_number}
                                    onChange={handleChange}
                            />
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
                                    className="form-control"
                                    name="email"
                                    placeholder="johndoe@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                            />
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
                                    className="form-control"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                            />
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
                                    className="form-control"
                                    name="password_confirmation"
                                    placeholder="Confirm Password"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                            />
                    </div>
            </div>
            <div className="d-flex justify-content-between">
                    <Link to="/login" className="sign-in-link">Already have an account?</Link>
                    <button className="btn btn-danger" onClick={nextStep}>Next</button>
            </div>
    </div>
);
};



export default AccountDetailsForm;