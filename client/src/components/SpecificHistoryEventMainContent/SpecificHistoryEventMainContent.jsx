import React, { useState, useEffect } from 'react';
import './SpecificHistoryEventMainContent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';
import CircularLoader from '../CircularLoader/CircularLoader';

const SpecificHistoryEventMainContent = ({ eventId, title, details, date, venue, images }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: '' });
  const [currentSlide, setCurrentSlide] = useState(0); // State for the current slide index
  const navigate = useNavigate();

  // Function to handle RSVP click
  const handleRSVP = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/event/${eventId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      setAlert({ message: 'You have successfully registered for the event!', severity: 'success' });
      setTimeout(() => navigate('/events'), 2000);
    } catch (error) {
      setLoading(false);
      setAlert({ message: 'Failed to register for the event. Please try again.', severity: 'error' });
    }
  };

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Auto-play every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="specific-event-details-container">
      {loading && <CircularLoader />}
      {alert.message && (
        <CustomAlert
          severity={alert.severity}
          message={alert.message}
          onClose={() => setAlert({ message: '', severity: '' })}
        />
      )}

      <div className="specific-event-details">
        {/* About Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>About {title}</h1>
          </div>
          <p className="specific-event-description">{details}</p>
        </div>

        {/* Image Gallery Section with Carousel */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>Gallery</h1>
          </div>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              {/* Render only the active image */}
              {images.map((imgObject, index) => (
                <div
                  key={index}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${imgObject.image || imgObject})` }}
                ></div>
              ))}
            </div>
            {/* Navigation Buttons */}
            <button className="carousel-button prev" onClick={prevSlide}>
              &#10094; {/* Left arrow character */}
            </button>
            <button className="carousel-button next" onClick={nextSlide}>
              &#10095; {/* Right arrow character */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificHistoryEventMainContent;
