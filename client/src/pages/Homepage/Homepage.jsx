// src/pages/Homepage/Homepage.jsx
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import EventsSection from '../../components/EventsSection/EventsSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import AboutUsSection from '../../components/AboutUsSection/AboutUsSection'; // Import the About Us Section
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <Banner />
      <EventsSection />
      <FeaturesSection />
      <AboutUsSection /> 
    </div>
  );
};

export default Homepage;
