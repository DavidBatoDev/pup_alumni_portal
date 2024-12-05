// src/pages/Homepage/Homepage.jsx
import React, { useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import EventsSection from '../../components/EventsSection/EventsSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import AboutUsSection from '../../components/AboutUsSection/AboutUsSection';
import MainFooter from '../../components/MainFooter/MainFooter';
import './Homepage.css';

const Homepage = () => {
    // Refs for sections
    const homeRef = useRef(null);
    const eventsRef = useRef(null);
    const featuresRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);

    // const sectionRefs = {
    //     home: homeRef,
    //     events: eventsRef,
    //     features: featuresRef,
    //     about: aboutRef,
    //     contact: contactRef,
    // };

    return (
        <div className="homepage">
            <div className='background homepage-background'></div>

            <Navbar />

            {/* Home section */}
            <section id="home" ref={homeRef}>
                <Banner />
            </section>

            {/* Events section */}
            <section id="events" ref={eventsRef}>
                <EventsSection />
            </section>

            {/* Features section */}
            <section id="features" ref={featuresRef}>
                <FeaturesSection />
            </section>

            {/* About Us section */}
            <section id="about" ref={aboutRef}>
                <AboutUsSection />
            </section>

            {/* Contact section */}
            <section id="contact" ref={contactRef}>
                <MainFooter />
            </section>
        </div>
    );
};

export default Homepage;
