import React, { useState } from 'react';
import './SpecificEventMainContent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import CustomAlert from '../CustomAlert/CustomAlert';
import CircularLoader from '../CircularLoader/CircularLoader';
import 'react-multi-carousel/lib/styles.css';

const SpecificEventMainContent = ({ eventId, title, details, date, venue, is_registered, is_active, openFeedbackModal, eventFeedbackData }) => {
  const [loading, setLoading] = useState(false); // State for loading
  const [alert, setAlert] = useState({ message: '', severity: '' }); // State for alert messages
  const navigate = useNavigate(); // Hook for navigation

  const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 3
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
    }
};

  // Function to handle RSVP click
  const handleRSVP = async () => {
    if (is_registered) {
      // If the user is already registered, display an alert and prevent further requests
      setAlert({ message: 'You are already registered for this event!', severity: 'info' });
      return; // Exit the function
    }

    try {
      setLoading(true); // Show loader
      const token = localStorage.getItem('token');

      // Make the POST request to register for the event
      const response = await axios.post(
        `/api/event/${eventId}/register`,
        {}, // No body required for this endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the Authorization header
          },
        }
      );

      // Handle success
      setLoading(false); // Hide loader
      setAlert({ message: 'You have successfully registered for the event!', severity: 'success' });

      // Navigate to /events page after a short delay
      setTimeout(() => navigate('/events'), 2000);
    } catch (error) {
      setLoading(false); // Hide loader

      // Check if the error is due to already being registered
      if (error.response && error.response.status === 400 && error.response.data === 'You are already registered on the event.') {
        setAlert({ message: 'You are already registered for this event!', severity: 'info' }); // Show info alert without changing the UI
      } else {
        setAlert({ message: 'Failed to register for the event. Please try again.', severity: 'error' });
      }

      console.log('RSVP Error:', error);
    }
  };


  console.log(eventFeedbackData);

  return (
    <div className="specific-event-details-container">
      {/* Show loader when loading is true */}
      {loading && <CircularLoader />}

      {/* Display alert message */}
      {alert.message && (
        <CustomAlert
          severity={alert.severity}
          message={alert.message}
          onClose={() => setAlert({ message: '', severity: '' })} // Clear alert on close
        />
      )}
      
      <div className="specific-event-details">
        {/* About Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>About {title}</h1>
            {is_registered ? (
              <div className="rsvp">{is_active && "Registered"}</div>
            ) : (
              (
              <button className={`rsvp-btn ${is_active ? 'd-flex': 'd-none'}`} onClick={handleRSVP}>
                RSVP NOW
              </button>
              )
            )}

          </div>
          <p className="specific-event-description" dangerouslySetInnerHTML={{ __html: details }} />
        </div>

        {/* Date and Location Section */}
        <div className="specific-event-details-wrapper">
          <div className="details-header">
            <h1>Date: {date}</h1>
            <p>Location: {venue}</p>
          </div>
        </div>
        
      </div>

      {!is_active && (
        <div className='event-feedback'>
          <div className='event-feedback--container'>
            {(!is_active && is_registered) && <button 
              onClick={() => openFeedbackModal()}
              className="add-alumni-feedback-btn">Add Feedback</button>}
            <h1 className='event-feedback-header mb-5'>
              Feedback from Alumnis
            </h1>

            <div className='event-feedback-card-list'>
              {eventFeedbackData.map((feedback, index) => (
                <div className='event-feedback-card'>
                    <div className='events-alumni-pfp-feedback'>
                      <img src={feedback?.alumni?.profile_picture} alt='profile' />
                    </div>

                    <div className='events-alumni-feedback-details-section'>
                      <div className='events-alumni-info-feedback-container'>
                        <h2>{feedback?.alumni?.first_name} {feedback?.alumni?.last_name}</h2>
                        <div className='events-alumni-feedback-info'>
                          <span>{feedback?.alumni?.email}</span>
                        </div>
                      </div>

                      <div className='events-alumni-feedback'>
                        <p className='events-alumni-feedback-text' dangerouslySetInnerHTML={{__html: feedback?.feedback_text}} />

                        {/* images */}
                        <div className='events-alumni-feedback-images'>
                          <Carousel responsive={responsive} showDots={true} infinite={false} className="events-alumni-feedback-images-carousel owl-carousel owl-theme" styles={{overflow: "hidden"}} >
                            {feedback.photos.map((photo, index) => (
                              <div class='item'>
                                {photo?.photo_path}
                                <img src={photo?.photo_path} alt='profile' />
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      </div>
                    </div>
                </div>
              ))}

              {/* second feedback */}
              <div className='event-feedback-card'>
                <div className='events-alumni-pfp-feedback'>
                  <img src='https://via.placeholder.com/150' alt='profile' />
                </div>

                <div className='events-alumni-feedback-details-section'>
                  <div className='events-alumni-info-feedback-container'>
                    <h2>John Doe</h2>
                    <div className='events-alumni-feedback-info'>
                      <span>Sofware Engineer</span>
                      <span>Class of 2015</span>
                    </div>
                  </div>

                  <div className='events-alumni-feedback'>
                    <p className='events-alumni-feedback-text'>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti iusto officia temporibus blanditiis quos sunt ducimus! Voluptatum praesentium fuga dolorum voluptate? Unde quidem quia totam velit eos et ipsam facilis!
                    </p>

                    {/* images */}
                    <div className='events-alumni-feedback-images'>
                      <Carousel responsive={responsive} showDots={true} infinite={false} className="events-alumni-feedback-images-carousel owl-carousel owl-theme" styles={{overflow: "hidden"}} >
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                      </Carousel>
                    </div>
                  </div>
                </div>

              </div>

              {/* third feedback */}
              <div className='event-feedback-card'>
                <div className='events-alumni-pfp-feedback'>
                  <img src='https://via.placeholder.com/150' alt='profile' />
                </div>

                <div className='events-alumni-feedback-details-section'>
                  <div className='events-alumni-info-feedback-container'>
                    <h2>John Doe</h2>
                    <div className='events-alumni-feedback-info'>
                      <span>Sofware Engineer</span>
                      <span>Class of 2015</span>
                    </div>
                  </div>

                  <div className='events-alumni-feedback'>
                    <p className='events-alumni-feedback-text'>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti iusto officia temporibus blanditiis quos sunt ducimus! Voluptatum praesentium fuga dolorum voluptate? Unde quidem quia totam velit eos et ipsam facilis!
                    </p>

                    {/* images */}
                    <div className='events-alumni-feedback-images'>
                      <Carousel responsive={responsive} showDots={true} infinite={false} className="events-alumni-feedback-images-carousel owl-carousel owl-theme" styles={{overflow: "hidden"}} >
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                        <div class='item'>
                          <img src='https://via.placeholder.com/150' alt='profile' />
                        </div>
                      </Carousel>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificEventMainContent;
