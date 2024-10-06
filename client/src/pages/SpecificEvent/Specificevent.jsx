import React from 'react';
import { useParams } from 'react-router-dom';
import './SpecificEvent.css';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import SpecificEventSidebar from '../../components/SpecificEventSidebar/SpecificEventSidebar';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import bannerImage from '../../assets/images/eventimage1.png';

const events = [
  {
    title: "PUP-Alumni-Homecoming-2024",
    date: "September 18, 2024",
    venue: "PUP Sta. Mesa, Manila Campus",
    details: `Join us for the PUP Alumni Homecoming 2024, a night of celebration, reconnection, and nostalgia! This annual event is an opportunity for alumni from all graduating classes to come together and reminisce about their time at Polytechnic University of the Philippines. Reconnect with old friends, make new connections, and celebrate the achievements of our alumni community.
The evening will feature a welcome speech by our esteemed guest, an awards ceremony to honor distinguished alumni, a sumptuous dinner, and entertainment that will make this night unforgettable. We look forward to welcoming you back to your alma mater and sharing an evening of joy and memories.`,
    schedule: [`5:00 PM - 6:00 PM: Registration and Welcome Drinks`, `6:00 PM - 7:00 PM: Welcome Speech and Alumni Awards`, `7:00 PM - 9:00 PM: Dinner and Entertainment`, `9:00 PM - onwards: Socials and Networking`],
    guidelines: ['Arrival: Please arrive at least 30 minutes before the start of the event to allow time for registration.', 'Location: The event will be held at the PUP Sta. Mesa, Manila Campus. Detailed directions and parking information are available on our website.', 'Tickets: Ensure you have your event ticket or registration confirmation.', 'ID: A valid ID for verification at the entrance.', 'Personal Items: Only bring essential items; avoid bringing large bags.', 'Attire: Smart casual. Comfortable shoes are recommended as there may be some walking involved.'],
    image: bannerImage,
    type: "Face-to-Face",
    participants: 83,
    daysToGo: 30,
    dateAnnounced: "August 10, 2024",
    heldBy: "Polytechnic University of the Philippines Alumni Association",
    organizers: "PUP Office of Alumni Relations",
    tags: ["Alumni", "Homecoming", "Reunion", "Networking", "Celebration"],
    dressCode: "Semi-formal attire",
  },
  // ... (other events)
];

const formatTitle = (title) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const SpecificEvent = () => {
  const { eventTitle } = useParams();
  const event = events.find((e) => formatTitle(e.title) === formatTitle(eventTitle));

  if (!event) return <div>Event not found</div>;

  const backgroundImage = event.image || bannerImage;

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
        bannerTitle={event.title.replace(/-/g, ' ')}
        bannerImage={backgroundImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Events", link: "/events" },
          { label: event.title.replace(/-/g, ' '), link: `/events/${event.title}` }
        ]}
      />
      <div className="specific-event-section">
        <SpecificEventSidebar
          daysToGo={event.daysToGo}
          date={event.date}
          participants={event.participants}
          venue={event.venue}
          dateAnnounced={event.dateAnnounced}
          tags={event.tags}
          organizers={event.organizers}
          heldBy={event.heldBy}
          dressCode={event.dressCode}
        />
        <SpecificEventMainContent
          title={event.title.replace(/-/g, ' ')}
          date={event.date}
          venue={event.venue}
          details={event.details}
          schedule={event.schedule}
          guidelines={event.guidelines}
          
        />
      </div>
    </div>
  );
};

export default SpecificEvent;
