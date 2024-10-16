import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import './Alumni.css';
import AlumniContent from '../../components/AlumniContent/AlumniContent';

const Alumni = () => {
  return (
    <>
      <Navbar />
      <BannerSmall bannerImage={bannerImage} bannerTitle="Alumnis" />

      <div className="alumni-section">
        <div className="container">
          <div className="alumni-header">
            <h2>Ready to Connect? The alumni network is waiting!</h2>
            <h5>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
              repellat odio in, dolore voluptates sequi amet animi quaerat ad
              sint rerum?
            </h5>
          </div>

          <div className="alumni-container d-flex">
            <AlumniContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Alumni;
