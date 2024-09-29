import "./signUpForms.css";

import React from 'react';

const PersonalInformationForm = ({ nextStep, prevStep, formData, handleChange }) => {
    return (
        <div className="form-section">
            <h3 className="section-title">ALUMNI DETAILS</h3>
            <div className="form-group">
                <label>
                    Name <span className="important-txt">*</span>
                </label>
                <div className="row g-1">
                    <div className="col-lg-6 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Gender</label>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option>Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label>Birthday</label>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </span>
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="form-group">
                <label>
                    Address <span className="important-txt">*</span>
                </label>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-map-pin"></i>
                    </span>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-map-pin"></i>
                    </span>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-map-pin"></i>
                    </span>
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-map-marked-alt"></i>
                    </span>
                    <input
                        type="text"
                        name="postal_code"
                        placeholder="Postal Code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="fas fa-map-marked-alt"></i>
                    </span>
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn btn-danger" onClick={nextStep}>Next</button>
            </div>
        </div>
    );
}

export default PersonalInformationForm;
