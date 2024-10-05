/*
WARNING: THIS PAGE IS DEPRECATED AND MAY BE REMOVED IN THE FUTURE
This page is deprecated and will be removed in the future.
Unless this page is being used for viewing other users' profiles,
it is recommended to use the ProfileLayout component instead for personal profiles.
The Profile Page is now a component under components/ProfileLayout/Profile.jsx
While individual pages are under pages/Profile/ProfileOverview.jsx, ProfileSettings.jsx, etc.
*/

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

import './Profile.css';

const Profile = () => {
  // State to store profile data
  const [profile, setProfile] = useState({});
  // const user = useSelector((state) => state.user);
  const [address, setAddress] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up axios request with Authorization header
    axios
      .get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProfile(response.data.data);
          setAddress(response.data.data.address);
          setEmploymentHistory(response.data.data.employment_history || []);
          setEducationHistory(response.data.data.education_history || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='profile-page'>
    <Navbar />
      <BannerSmall bannerTitle = {"Profile Overview"} bannerImage={bannerImage}/>


      <div className="background profile-background"></div>

      {/* Content Container */}
      <div className="container-fluid profile-content glass">
        <div className='row'>

          {/* Profile Sidebar (Shall Not Appear in Other Users) */}
          <div className='col-md-auto'>
            {/* <ProfileSidebar /> */}
          </div>

          {/* Profile Overview Card */}
          <div className='col-md'>
            <div className="card mb-4 profile-overview">
              <div className="profile-overview-container">

                {/* Profile Image Container */}
                <div className="profile-image-container">
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="profile-image"
                  />
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                  <h2 className="card-title">{profile.first_name} {profile.last_name}</h2>
                  <p className="card-subtitle mb-2">
                    {
                      profile.current_job_title
                      ? `${profile.current_job_title} at ${profile.current_employer}`
                      : 'No current job title and employer'
                    }
                  </p>
                  <p className="card-text">{address['city']}, {address['state']}</p>
                  {/* Contact Information */}
                  <div className="profile-contacts">
                    <p className="card-text"><strong>Email:</strong> {profile.email}</p>
                    <p className="card-text"><strong>Phone:</strong> {profile.phone ? profile.phone : 'None Provided'}</p>
                  </div>
                </div>

                {/* LinkedIn Button */}
                <div className="linkedin">
                  {profile.linkedin_url && (
                    <a href="https://linkedin.com/juandelacruz"
                      target="_blank"
                      rel="noopener noreferrer">
                        LinkedIn Profile
                    </a>
                    )}
                </div>
              </div>
            </div>


            {/* Professional Experience Section */}
            <div className="profile-section mb-4">
              <h3 className="profile-section-title">Professional Experience</h3>
              {
                employmentHistory.length > 0
                ? (
                  employmentHistory.map((job) => (
                    <div className="card profile-experience mb-2" key={job.employment_id}>
                      <div className="card-body">
                        <h4 className="card-title">{job.company}</h4>
                        <p className="card-text">{job.job_title}</p>
                        <p className="card-text">
                          {new Date(job.start_date).toLocaleDateString()} -{' '}
                          {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Present'}
                        </p>
                        {job.description && <p className="card-text">{job.description}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No employment history available.</p>
                )}
            </div>
            {/* Education History Section */}
            <div className="profile-section mb-4">
              <h3 className="profile-section-title">Education History</h3>
              {
                educationHistory.length > 0
                ?
                (
                educationHistory.map((education) => (
                  <div className='card profile-education  mb-2' key={education.education_id}>
                    <div className='card-body'>
                      <h4 className='card-title'>{education.institution}</h4>
                      <p className='card-text'>{education.degree}</p>
                      <p className='card-text'>{education.field_of_study}</p>
                      <p className='card-text'>
                        {new Date(education.start_date).toLocaleDateString()} -{' '}
                        {education.end_date ? new Date(education.end_date).toLocaleDateString() : 'Present'}
                      </p>
                    </div>
                  </div>
                )
                )
                )
                : (<p>No education history available.</p>)
              }
            </div>
          </div>
        </div>
      </div>

      <MainFooter />
      {loading && <CircularLoader />}
    </div>
  );
};

export default Profile;