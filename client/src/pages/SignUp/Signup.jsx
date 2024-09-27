// src/pages/SignUp/signup.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";
import "../../global.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();
  // Manage form state
  const [formData, setFormData] = useState({
    student_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    gender: '',
    birthday: '',
    street: '',
    city: '',
    postal_code: '',
    country: '',
    graduation_year: '',
    degree: '',
    field_of_study: '',
    current_job_title: '',
    current_employer: '',
    linkedin_profile: '',
    state: '',
  });

  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submit
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }


    // Filter out empty fields from formData
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== "")
    );

    const body = {
      ...filteredFormData,
      graduation_year: parseInt(filteredFormData.graduation_year),
    }

    console.log(body);

    try {
      const response = await axios.post('/api/register', body);
      console.log(response.data);
      navigate('/login');

    } catch (error) {
      console.log(error.response);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="signup-page">
        {/* Banner area */}
        <div className="banner-section">
          <h1 className="signup-header">Register</h1>
        </div>

        {/* Signup Form */}
        <div className="glass-container glass">
          <div className="row justify-content-center">
            <div className="signup-header">
              <h1 className="signup-title">Join Our Alumni Network Today!</h1>
              <p className="signup-description">
                Become a part of our thriving alumni community. Register now to
                stay updated with the latest news, participate in events, access
                job listings, and connect with mentors.
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Account Details Section */}
            <div className="form-section">
              <h3 className="section-title">ACCOUNT DETAILS</h3>
              <div className="form-group">
                <label>
                  Student Number <span className="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
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
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
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
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <input
                    type="password"
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
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alumni Details Section */}
            <div className="form-section">
              <h3 className="section-title">ALUMNI DETAILS</h3>
              <div className="form-group">
                <label>
                  Name <span className="important-txt">*</span>
                </label>
                <div className="row g-1">
                  <div className="col-lg-6 col-md-6">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-12 col-md-4">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        name="middle_name"
                        placeholder="Middle Name"
                        value={formData.middle_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}
                  <div className="col-lg-6 col-md-6">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
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
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                  </span>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Address <span className="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-map-pin"></i>
                  </span>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-map-pin"></i>
                  </span>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-map-pin"></i>
                  </span>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-map-pin"></i>
                  </span>
                  <input
                    type="text"
                    name="postal_code"
                    placeholder="Postal Code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-map-pin"></i>
                  </span>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Alumni Information <span className="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>
                  <input
                    type="text"
                    name="graduation_year"
                    placeholder="Graduation Year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-book" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    name="major"
                    placeholder="Major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa fa-briefcase" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    name="current_job_title"
                    placeholder="Current Job Title"
                    value={formData.current_job_title}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>
                  <input
                    type="text"
                    name="current_employer"
                    placeholder="Current Employer/Company"
                    value={formData.current_employer}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Socials</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fa-brands fa-linkedin"></i>
                  </span>
                  <input
                    type="text"
                    name="linkedin_profile"
                    placeholder="LinkedIn"
                    value={formData.linkedin_profile}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

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

            <div className="form-submit">
              <button type="submit" className="btn btn-danger">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      <MainFooter />
    </>
  );
};

export default Signup;
