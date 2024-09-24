// src/pages/SignUp/signup.jsx
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";
import "../../global.css";

const Signup = () => {
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
          <form className="signup-form">
            {/* Account Details Section */}
            <div className="form-section">
              <h3 className="section-title">ACCOUNT DETAILS</h3>
              <div className="form-group">
                <label>
                  Student Number <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <input type="text" placeholder="200X-MN-XXXX-X" />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Personal Email <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input type="email" placeholder="johndoe@gmail.com" />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Password <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <input type="password" placeholder="Password" />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Confirm Password <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <input type="password" placeholder="Confirm Password" />
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
                  <div className="col-12 col-md-4">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input type="text" placeholder="First Name" />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input type="text" placeholder="Middle Name" />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input type="text" placeholder="Last Name" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <select>
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
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                  </span>
                  <input type="date" />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Address <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-map-pin"></i>
                  </span>
                  <input type="text" placeholder="Street" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-map-pin"></i>
                  </span>
                  <input type="text" placeholder="City" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-map-pin"></i>
                  </span>
                  <input type="text" placeholder="Postal Code" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-map-pin"></i>
                  </span>
                  <input type="text" placeholder="Country" />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Alumni Information <span class="important-txt">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-graduation-cap"></i>
                  </span>
                  <input type="text" placeholder="Graduation Year" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-graduation-cap"></i>
                  </span>
                  <input type="text" placeholder="Degree" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa fa-book" aria-hidden="true"></i>
                  </span>
                  <input type="text" placeholder="Field of Study" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa fa-briefcase" aria-hidden="true"></i>
                  </span>
                  <input type="text" placeholder="Current Job Title" />
                </div>

                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fas fa-graduation-cap"></i>
                  </span>
                  <input type="text" placeholder="Current Employer/Company" />
                </div>
              </div>
              <div className="form-group">
                <label>Socials</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <i class="fa-brands fa-linkedin"></i>
                  </span>
                  <input type="text" placeholder="LinkedIn" />
                </div>
              </div>
            </div>

            <div className="form-footer">
              <div className="checkbox-section">
                <input type="checkbox" id="agreeInfo" />
                <label htmlFor="agreeInfo">
                  I hereby agree that the <a href="#">above information</a> is
                  true and correct.
                </label>
              </div>
              <div className="checkbox-section">
                <input type="checkbox" id="privacyPolicy" />
                <label htmlFor="privacyPolicy">
                  I’ve read and accept the <a href="#">Privacy Policy</a> *
                </label>
              </div>
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-danger">
                Sign In
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
