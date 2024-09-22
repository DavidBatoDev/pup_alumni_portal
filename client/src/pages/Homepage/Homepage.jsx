// src/pages/Homepage/Homepage.jsx
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import EventsSection from '../../components/EventsSection/EventsSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import AboutUsSection from '../../components/AboutUsSection/AboutUsSection';
import AlumniTestimonialSection from '../../components/AlumniTestimonialSection/AlumniTestimonialSection';
import HomePageFooter from '../../components/HomePageFooter/HomePageFooter'; // Import the Footer
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <Banner />
      <EventsSection />
      <FeaturesSection />
      <AboutUsSection />
      <AlumniTestimonialSection />
      <HomePageFooter />
    </div>
  );
};

export default Homepage;
