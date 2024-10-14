import React, { useState, useEffect } from 'react';
import './SpecificHistoryEventMainContent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';
import CircularLoader from '../CircularLoader/CircularLoader';
import image1 from '../../assets/images/eventImage1.png';
import image2 from '../../assets/images/eventImage2.jpg';
import image3 from '../../assets/images/eventImage3.jpg';
import image4 from '../../assets/images/eventImage4.jpg';
import singleImage from '../../assets/svgs/image-outline.svg';
import gridImage from '../../assets/svgs/grid-outline.svg';

const SpecificHistoryEventMainContent = ({ eventId, title, details, date, venue }) => {
  // Use dummy data for images
  const images = [
    { image: image1 },
    { image: image2 },
    { image: image3 },
    { image: image4 },
  ];

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: '' });
  const [currentSlide, setCurrentSlide] = useState(0); // State for the current slide index
  const [viewMode, setViewMode] = useState('carousel'); // State for view mode ('carousel' or 'grid')

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
  };

  // Auto-play functionality for carousel
  useEffect(() => {
    if (viewMode === 'carousel') {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); // Auto-play every 3 seconds
      return () => clearInterval(interval);
    }
  }, [images.length, viewMode]);

  // Toggle view mode between carousel and grid
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

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

        {/* Image Gallery Section with Carousel and Grid View */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>Gallery</h1>
            <div className="image-view">
              {/* View mode toggles */}
              <div
                className={`view-img ${viewMode === 'carousel' ? 'active' : ''}`} // Add active class if carousel is selected
                onClick={() => toggleViewMode('carousel')}
              >
                <img src={singleImage} alt="carousel-view" />
              </div>
              <div
                className={`view-img ${viewMode === 'grid' ? 'active' : ''}`} // Add active class if grid is selected
                onClick={() => toggleViewMode('grid')}
              >
                <img src={gridImage} alt="grid-view" />
              </div>
            </div>
          </div>

          {/* Conditionally render based on viewMode */}
          {viewMode === 'carousel' ? (
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
              <div className="carousel-buttons">
                <button className="carousel-button prev" onClick={prevSlide}>
                  &#10094; {/* Left arrow character */}
                </button>
                <button className="carousel-button next" onClick={nextSlide}>
                  &#10095; {/* Right arrow character */}
                </button>
              </div>
              
            </div>
          ) : (
            <div className="grid-container">
              {/* Grid view of images */}
              {images.map((imgObject, index) => (
                <div key={index} className="grid-item">
                  <img src={imgObject.image} alt={`event-img-${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificHistoryEventMainContent;
