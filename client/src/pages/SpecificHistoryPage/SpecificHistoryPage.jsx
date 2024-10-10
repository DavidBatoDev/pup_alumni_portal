import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/eventimage1.png';
import axios from 'axios';
import './SpecificHistoryPage.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import SpecificHistoryEventSidebar from '../../components/SpecificHistoryEventSidebar/SpecificHistoryEventSidebar';
import image1 from '../../assets/images/eventImage1.png';
import image2 from '../../assets/images/eventImage2.jpg';
import image3 from '../../assets/images/eventImage3.jpg';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import SpecificHistoryEventMainContent from '../../components/SpecificHistoryEventMainContent/SpecificHistoryEventMainContent';

const SpecificHistoryPage = () => {

  // Uncomment this block if you are using the API to fetch specific event data
  /*
  const { eventId } = useParams(); // Get the eventId from the URL parameters
  const [eventData, setEventData] = useState(null); // State to store fetched event data

  useEffect(() => {
    // Function to fetch specific event data using the eventId
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include Authorization header if needed
          },
        });
        setEventData(response.data.event); // Set the fetched event data
      } catch (error) {
        console.error("Error fetching event data:", error); // Log any errors during the fetch
      }
    };
    fetchEventData();
  }, [eventId]);
  */

  // Using dummy event data for now
  const eventData = [
    {
      "event_name": "Pasdasdasd",
      "event_date": "2024-09-18",
      "location": "PUP Sta. Mesa, Manila Campus",
      "type": "Face-to-face",
      "category": "Social",
      "organization": "PUP Alumni Association",
      "description": "Join us for an unforgettable evening at !",
      "updated_at": "2024-10-06T17:47:07.000000Z",
      "created_at": "2024-10-06T17:47:07.000000Z",
      "event_images": [{image1}, {image2}, {image3}],
      "event_id": 1
    },
  ];

  // For now, use the first event in the array
  const singleEvent = eventData[0];

  console.log('eventData:', singleEvent); // Log the single event data for debugging

  // Show a loader if no event data is found
  if (!singleEvent) return <CircularLoader />;

  // Set the background image using the first image in event_images or the default bannerImage
  const backgroundImage = bannerImage;

  return (
    <div
      className="specific-event-page"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: 'cover', // Cover the entire container
        backgroundPosition: 'center', // Center the background image
        backgroundAttachment: 'fixed', // Fixed background for a parallax effect
        backgroundRepeat: 'no-repeat', // Do not repeat the image
      }}
    >
      <Navbar />
      <BannerSmall
        bannerTitle={singleEvent.event_name} // Use the event name as the banner title
        bannerImage={backgroundImage} // Use the selected background image
        breadcrumbs={[
          { label: "Home", link: "/" }, // Breadcrumb navigation
          { label: "Event History", link: "/events/events-history" },
          { label: singleEvent.event_name, link: `/events/events-history/${singleEvent.event_id}` }
        ]}
      />
      <div className="specific-event-section">
        {/* Sidebar component for specific event details */}
        <SpecificHistoryEventSidebar
          daysToGo={Math.abs(Math.floor((new Date(singleEvent.event_date) - new Date()) / (1000 * 60 * 60 * 24)))} // Calculate days ago or days left
          date={singleEvent.event_date}
          participants={singleEvent.registered_alumni?.length || 0} // Check if registered_alumni exists, fallback to 0
          venue={singleEvent.location}
          organizers={singleEvent.organization}
          type={singleEvent.type}
        />
        {/* Main content component for specific event details */}
        <SpecificHistoryEventMainContent 
            eventId={singleEvent.event_id}
            title={singleEvent.event_name}
            date={singleEvent.event_date}
            venue={singleEvent.location}
            details={singleEvent.description}
            images={singleEvent.event_images}            
        />
      </div>
    </div>
  );
};

export default SpecificHistoryPage;
