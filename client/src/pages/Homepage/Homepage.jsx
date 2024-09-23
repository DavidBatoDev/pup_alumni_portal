// src/pages/Homepage/Homepage.jsx
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import EventsSection from '../../components/EventsSection/EventsSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import AboutUsSection from '../../components/AboutUsSection/AboutUsSection';
import MainFooter from '../../components/MainFooter/MainFooter';
import './Homepage.css';

const Homepage = () => {
    return (
        <div className="homepage">
            <div className='homepage-background'></div>

            <Navbar />

            {/* Home section */}
            <section id="home">
                <Banner />
            </section>

            {/* Events section */}
            <section id="events">
                <EventsSection />
            </section>

            {/* Features section */}
            <section id="features">
                <FeaturesSection />
            </section>

            {/* About Us section */}
            <section id="about">
                <AboutUsSection />
            </section>

            {/* Contact section */}
            <section id="contact">
                <MainFooter />
            </section>
        </div>
    );
};

export default Homepage;
