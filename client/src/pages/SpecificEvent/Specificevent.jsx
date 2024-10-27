import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import SpecificEventSidebar from '../../components/SpecificEventSidebar/SpecificEventSidebar';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import bannerImage from '../../assets/images/eventimage1.png';
import axios from 'axios';
import './SpecificEvent.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';

const SpecificEvent = () => {
  SwiperCore.use([Navigation]);
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);

  console.log(eventData)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEventData(response.data.event);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [eventId]);

  console.log('eventData:', eventData);

  if (!eventData) return <CircularLoader />;

  // Set the background image if available, otherwise use a default image
  const backgroundImage = eventData?.photos[0]?.photo_path || bannerImage;

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
      <Swiper navigation style={{height: '100%'}}>
        {eventData.photos.map((photo, index) => (
          <SwiperSlide key={index} style={{ height: '100%' }}>
            <BannerSmall
              bannerTitle={eventData.event_name}
              bannerImage={photo.photo_path}
              breadcrumbs={[
                { label: "Home", link: "/" },
                { label: "Events", link: "/events" },
                { label: eventData.event_name, link: `/events/${eventData.event_id}` }
              ]}
            />
          </SwiperSlide>
        ))}

      </Swiper>
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
          eventId={eventData.event_id}
          title={eventData.event_name}
          date={eventData.event_date}
          venue={eventData.location}
          details={eventData.description}
          is_registered={eventData.is_alumni_registered}
        />
      </div>
    </div>
  );
};

export default SpecificEvent;
