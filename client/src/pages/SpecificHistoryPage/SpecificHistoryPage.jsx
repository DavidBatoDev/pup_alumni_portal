import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import SpecificEventSidebar from '../../components/SpecificEventSidebar/SpecificEventSidebar';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import bannerImage from '../../assets/images/eventimage1.png';
import axios from 'axios';
import './SpecificHistoryPage.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';

const SpecificHistoryPage = () => {

  {/*}
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  
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
  */}

  const eventData = [
    {
        "event_name": "Pasdasdasd",
        "event_date": "2024-09-18",
        "location": "PUP Sta. Mesa, Manila Campus",
        "type": "Face-to-face",
        "category": "Social",
        "organization": "PUP Alumni Association",
        "description": "Join us for an unforgettable evening at the PUP Cultural Night, an event where alumni, students, faculty, and the PUP community come together to celebrate the rich cultural heritage and artistic talents of our university. Taking place on September 18, 2024, at the PUP Sta. Mesa, Manila Campus, this event promises to be a vibrant celebration filled with engaging performances, delectable food offerings, and beautiful art exhibits. \n\nThe evening will begin with a welcome reception at 5:00 PM, where attendees can mingle and connect over light refreshments and snacks. The main program will commence at 6:00 PM with an opening speech by the President of the PUP Alumni Association, setting the tone for a night dedicated to showcasing diverse cultural performances. Expect an array of traditional dances, choral renditions, spoken word poetry, and musical performances by PUP's most talented artists. From the grace of folk dance troupes to the powerful voices of our university choir, every performance is curated to highlight the diversity and artistic excellence within the PUP community. \n\nGuests are encouraged to wear smart casual attire or traditional Filipino clothing. For those who wish to show their support for the university spirit, donning PUP colors—red, gold, and white—is highly encouraged. Comfortable shoes are recommended as some portions of the evening will be held outdoors, allowing guests to stroll through various exhibit areas and food stalls. \n\nAttendees will have access to a variety of food stalls offering both local and international cuisine. From traditional Filipino street food like isaw and kwek-kwek to gourmet options like sushi and kebabs, there will be something to satisfy every palate. A designated area for beverages, including coffee, milk teas, and fruit shakes, will be available for refreshment. Explore the creative side of PUP through our art exhibit, featuring paintings, sculptures, and installations by both students and professional alumni artists. Interactive booths will be set up for activities like pottery-making, calligraphy workshops, and more, offering a chance for guests to engage with the arts in a hands-on manner. \n\nWe look forward to welcoming you to a night filled with celebration, camaraderie, and artistic expression. See you at the PUP Cultural Night!",
        "updated_at": "2024-10-06T17:47:07.000000Z",
        "created_at": "2024-10-06T17:47:07.000000Z",
        "event_images": ["eventImage1.png", "eventImage2.png"],
        "event_id": 1
    },
]

  console.log('eventData:', eventData);

  if (!eventData) return <CircularLoader />;

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
          { label: "Event History", link: "/events/events-history" },
          { label: eventData.event_name, link: `/events/events-history/${eventData.event_id}` }
        ]}
      />
      <div className="specific-event-section">

        {/* Di ko pa namomodify*/} {/* Pa fix me */}
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

export default SpecificHistoryPage;
