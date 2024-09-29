import "./signUpForms.css";

import React from 'react';

const EducationForm = ({ nextStep, prevStep, formData, handleChange }) => {

    return (
        <div className="form-section w-auto">
            <h3 className="section-title">EDUCATIONAL AND PROFESSIONAL INFORMATION</h3>
            <div className="form-group">
                <label>
                    Alumni Information <span className="important-txt">*</span>
                </label>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-graduation-cap"></i>
                    </span>
                    <input
                        type="text"
                        name="graduation_year"
                        placeholder="Graduation Year"
                        value={formData.graduation_year}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-graduation-cap"></i>
                    </span>
                    <input
                        type="text"
                        name="degree"
                        placeholder="Degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fa fa-book" aria-hidden="true"></i>
                    </span>
                    <input
                        type="text"
                        name="major"
                        placeholder="Major"
                        value={formData.major}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                    </span>
                    <input
                        type="text"
                        name="current_job_title"
                        placeholder="Current Job Title"
                        value={formData.current_job_title}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-graduation-cap"></i>
                    </span>
                    <input
                        type="text"
                        name="current_employer"
                        placeholder="Current Employer/Company"
                        value={formData.current_employer}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Socials</label>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fa-brands fa-linkedin"></i>
                    </span>
                    <input
                        type="text"
                        name="linkedin_profile"
                        placeholder="LinkedIn"
                        value={formData.linkedin_profile}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="d-flex justify-content-center submit-box">
            <div className="w-auto">
                <div className="form-footer">
                    <div className="checkbox-section">
                        <input type="checkbox" id="agreeInfo" required />
                        <label htmlFor="agreeInfo">
                            I hereby agree that the <a href="#">above information</a> is
                            true and correct.
                        </label>
                    </div>
                    <div className="checkbox-section">
                        <input type="checkbox" id="privacyPolicy" required />
                        <label htmlFor="privacyPolicy">
                            I’ve read and accept the <a href="#">Privacy Policy</a> *
                        </label>
                    </div>
                </div>
            </div>
            <div className="w-auto">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
            </div>
            <div className="w-auto form-submit">
                <button type="submit" className="btn btn-danger">
                    Submit & Register
                </button>
            </div>
        </div>
        </div >
    );
}

export default EducationForm;
