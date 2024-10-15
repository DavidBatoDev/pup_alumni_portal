import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import CircularLoader from '../../components/CircularLoader/CircularLoader';

const Alumni = () => {
  // State to store profile data
  const [profile, setProfile] = useState({});

  // Get user data from Redux
  const user = useSelector((state) => state.user);

  return (
    <>
      <Navbar/>
      <BannerSmall bannerImage={bannerImage} bannerTitle="Alumni"/>
      

   </>
  );
}

export default Alumni;