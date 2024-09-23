// src/components/FeaturesSection/FeaturesSection.jsx
import React from 'react';
import './FeaturesSection.css';
import featureIcon1 from '../../assets/svgs/chat.svg';
import featureIcon2 from '../../assets/svgs/briefcase.svg';
import featureIcon3 from '../../assets/svgs/today.svg';
import featureIcon4 from '../../assets/svgs/clipboard.svg';

const FeaturesSection = () => {
  return (
    <div className="features-section glass">
      <div className="container">
        <h2 className="section-title">FEATURES</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={featureIcon1} alt="Stay Connected" className="feature-icon" />
            <h3 className="feature-title">Stay Connected</h3>
            <p className="feature-description">
              Engage with fellow alumni through our dynamic message boards and forums.
              Share your experiences, ask questions, and stay in touch with friends and mentors from your alma mater.
            </p>
          </div>

          <div className="feature-card">
            <img src={featureIcon2} alt="Career Opportunities" className="feature-icon" />
            <h3 className="feature-title">Career Opportunities</h3>
            <p className="feature-description">
              Explore exclusive job listings and career opportunities. Our platform connects you
              with potential employers and offers resources to help you advance your career.
            </p>
          </div>

          <div className="feature-card">
            <img src={featureIcon3} alt="Events & Reunions" className="feature-icon" />
            <h3 className="feature-title">Events & Reunions</h3>
            <p className="feature-description">
              Never miss an event with our comprehensive event listings. Register for alumni reunions, webinars,
              and other networking opportunities directly through the portal.
            </p>
          </div>

          <div className="feature-card">
            <img src={featureIcon4} alt="Feedback & Surveys" className="feature-icon" />
            <h3 className="feature-title">Feedback & Surveys</h3>
            <p className="feature-description">
              Provide valuable feedback on your educational experience and participate in surveys.
              Help us improve our programs and services based on your insights and experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
