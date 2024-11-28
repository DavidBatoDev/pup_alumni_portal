import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from "../../assets/images/pup-login-banner.jpg";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/userSlice.js";

import "./ProfileLayout.css";

const ProfileLayout = () => {
  const dispatch = useDispatch();
  const { userLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setLoading(true));


    return () => {
      if (userLoading) {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch]);

  return (
    <div className="profile-layout">
      <Navbar />
      <BannerSmall bannerTitle="Profile Overview" bannerImage={bannerImage} />
      <div className="background profile-layout-background"></div>

      { userLoading && <CircularLoader /> }
  
      <div className="container-fluid profile-layout-content glass">
        <div className="row profile-layout-row">
          {/* Profile Sidebar */}
          <div className="col-md-auto profile-sidebar-container">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}

          <div className="col-md">
            {/* Render child components like Overview, Settings, etc. */}
            <Outlet />
          </div>
        </div>
      </div>


      <MainFooter />
    </div>
  );
};

export default ProfileLayout;
