// src/components/FeaturesSection/FeaturesSection.jsx
import React, {useRef, useEffect} from 'react';
import './FeaturesSection.css';
import featureIcon1 from '../../assets/svgs/chat.svg';
import featureIcon2 from '../../assets/svgs/briefcase.svg';
import featureIcon3 from '../../assets/svgs/today.svg';
import featureIcon4 from '../../assets/svgs/clipboard.svg';

const FeaturesSection = () => {
  const featureRefs = useRef([]); // Track each feature card element

  const featuresData = [
    {
      icon: featureIcon1,
      title: "Stay Connected",
      description: "Engage with fellow alumni through our dynamic message boards and forums. Share your experiences, ask questions, and stay in touch with friends and mentors from your alma mater."
    },
    {
      icon: featureIcon2,
      title: "Career Opportunities",
      description: "Explore exclusive job listings and career opportunities. Our platform connects you with potential employers and offers resources to help you advance your career."
    },
    {
      icon: featureIcon3,
      title: "Events & Reunions",
      description: "Never miss an event with our comprehensive event listings. Register for alumni reunions, webinars, and other networking opportunities directly through the portal."
    },
    {
      icon: featureIcon4,
      title: "Feedback & Surveys",
      description: "Provide valuable feedback on your educational experience and participate in surveys. Help us improve our programs and services based on your insights and experiences"
    }
  ]

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2, // Trigger animation when 20% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fadeInUp'); // Apply the animation class
        } else {
          entry.target.classList.remove('fadeInUp'); // Remove the animation class when out of view
        }
      });
    }, observerOptions);

    featureRefs.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="features-section glass">
      <div className="container">
        <h2 className="section-title">FEATURES</h2>
        <div className="features-grid">
          {
            featuresData.map((feature, index) => {
              return (
              <div
                className="feature-card-wrapper"
                key={index}
              >
                <div
                  className="feature-card animated"
                  ref={(el) => (featureRefs.current[index] = el)}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <img src={feature.icon} alt={feature.title} className="feature-icon" />
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
