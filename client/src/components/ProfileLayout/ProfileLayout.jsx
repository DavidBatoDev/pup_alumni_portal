import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

import './ProfileLayout.css';

const ProfileLayout = () => {
  // State to store profile data
  const [profile, setProfile] = useState({});
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
    <div className="profile-layout">
      <Navbar />
      <BannerSmall bannerTitle="Profile Overview" bannerImage={bannerImage} />
      <div className='background profile-layout-background'></div>

      <div className="container-fluid profile-layout-content glass">

        <div className="row profile-layout-row">

          {/* Profile Sidebar */}
          <div className="col-md-auto profile-sidebar-container">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <div className="col-md">
            {/* Render child components like Overview, Settings, etc. */}
            <Outlet context={{ profile, address, employmentHistory, educationHistory }} />
          </div>

        </div>

      </div>

      <MainFooter />
      {loading && <CircularLoader />}
    </div>
  );
};

export default ProfileLayout;
