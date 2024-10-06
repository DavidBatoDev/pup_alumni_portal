import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import SpecificEventSidebar from '../../components/SpecificEventSidebar/SpecificEventSidebar';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import bannerImage from '../../assets/images/eventimage1.png';
import axios from 'axios';
import './SpecificEvent.css';

const SpecificEvent = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/event/${eventId}`);
        setEventData(response.data.event);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [eventId]);

  if (!eventData) return <div>Event not found</div>;

  // Set the background image if available, otherwise use a default image
  const backgroundImage = eventData.image || bannerImage;

  return (
    <div
      className="specific-event-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      <BannerSmall
        bannerTitle={eventData.event_name}
        bannerImage={backgroundImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Events", link: "/events" },
          { label: eventData.event_name, link: `/events/${eventData.event_id}` }
        ]}
      />
      <div className="specific-event-section">
        <SpecificEventSidebar
          daysToGo={Math.floor((new Date(eventData.event_date) - new Date()) / (1000 * 60 * 60 * 24))}
          date={eventData.event_date}
          participants={eventData.registered_alumni.length}
          venue={eventData.location}
          organizers={eventData.organization}
          type={eventData.type}
        />
        <SpecificEventMainContent
          title={eventData.event_name}
          date={eventData.event_date}
          venue={eventData.location}
          details={eventData.description}
        />
      </div>
    </div>
  );
};

export default SpecificEvent;
