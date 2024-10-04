// src/pages/SpecificEvent/SpecificEvent.jsx

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SpecificEvent.css';
import NavAuthenticated from '../../components/NavAuthenticated/NavAuthenticated';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/eventimage1.png'; // Use a default banner image

// Import images statically instead of using require in the events array
import eventImage1 from '../../assets/images/eventimage1.png';
import eventImage2 from '../../assets/images/eventimage2.jpg';

// Dummy data or fetch from a state/store
const events = [
  {
    title: "PUP-Alumni-Homecoming-2024",
    date: "September 18, 2024",
    venue: "PUP Sta. Mesa, Manila Campus",
    details: `
      Join us for the PUP Alumni Homecoming 2024, a night of celebration, reconnection, and nostalgia! This annual event is
      an opportunity for alumni from all graduating classes to come together and reminisce about their time at Polytechnic
      University of the Philippines. Reconnect with old friends, make new connections, and celebrate the achievements of our alumni community.
    `,
    image: eventImage1, // Use static import instead of require
    type: "Face-to-Face",
  },
  {
    title: "PUP-Cultural-Night",
    date: "September 18, 2024",
    venue: "PUP Sta. Mesa, Manila Campus",
    details: `
      Experience the vibrant culture of PUP at our annual Cultural Night event! Featuring a variety of performances, art displays,
      and interactive activities, this event showcases the diverse talents and traditions of our university community. Join us for
      an evening of celebration, creativity, and fun!
    `,
    image: eventImage2, // Use static import instead of require
    type: "Face-to-Face",
  },
];

// Utility function to standardize event titles
const formatTitle = (title) => {
  // Replace spaces with hyphens, remove special characters except hyphens and lowercase the title
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const SpecificEvent = () => {
  // Get the event title from the URL
  const { eventTitle } = useParams();

  // Log the URL parameter to verify the value
  console.log("URL Event Title:", eventTitle);

  // Compare using formatted titles
  const event = events.find((e) => formatTitle(e.title) === formatTitle(eventTitle));

  // Log formatted titles for debugging
  console.log("Formatted Event Titles:", events.map(e => formatTitle(e.title)));
  console.log("Event Found:", event);

  if (!event) {
    console.log("Event not found for:", formatTitle(eventTitle));
    return <div>Event not found</div>;
  }

  return (
    <div className="specific-event-page">
      <NavAuthenticated />
      {/* Updated BannerSmall component with dynamic event data */}
      <BannerSmall
        bannerTitle={event.title.replace(/-/g, ' ')} // Replacing hyphens with spaces for display
        bannerImage={event.image || bannerImage} // Use event image if available, else default banner
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Events", link: "/event" },
          { label: event.title.replace(/-/g, ' '), link: `/events/${event.title}` }
        ]}
      />
      <div className="specific-event-section">
        <div className="specific-event-container">
          {/* Event Details */}
          <div className="specific-event-details">
            <h1>{event.title.replace(/-/g, ' ')}</h1> {/* Replace hyphens with spaces for display */}
            <img src={event.image} alt={event.title} className="specific-event-image" />
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.venue}</p>
            <p><strong>Type:</strong> {event.type}</p>
            <p className="specific-event-description">{event.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificEvent;
