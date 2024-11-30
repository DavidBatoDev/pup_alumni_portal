import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage2 from '../../assets/images/eventimage2.jpg';
import './EventHistory.css';
import EventsFilterSection from '../../components/EventsFilterSection/EventsFilterSection';
import EventAuth from '../../components/EventSectionAuth/EventAuth';
import api from '../../api';

const EventHistory = () => {
    // Sample past events data
    const eventHistoryData = [
        {
            "event_name": "Past Event Example 1",
            "event_date": "2024-09-18",
            "location": "PUP Sta. Mesa, Manila Campus",
            "type": "Face-to-face",
            "category": "Social",
            "organization": "PUP Alumni Association",
            "description": "Join us for an unforgettable evening at the event!",
            "updated_at": "2024-10-06T17:47:07.000000Z",
            "created_at": "2024-10-06T17:47:07.000000Z",
            "event_images": ["eventImage1.png", "eventImage2.png"],
            "event_id": 1
        },
        {
            "event_name": "Past Event Example 2",
            "event_date": "2023-08-22",
            "location": "PUP Sta. Mesa, Manila Campus",
            "type": "Online",
            "category": "Seminar",
            "organization": "PUP Computer Science Department",
            "description": "A great seminar on web development.",
            "updated_at": "2023-08-23T17:47:07.000000Z",
            "created_at": "2023-08-20T17:47:07.000000Z",
            "event_images": ["eventImage3.png", "eventImage4.png"],
            "event_id": 2
        }
    ];


    const [eventsData, setEventsData] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchTerm: '',
        startDate: '',
        endDate: '',
        types: [],
        categories: [],
        organizations: []
      });
    
      useEffect(() => {
        const fetchEvents = async () => {
          try {
            setLoading(true);
            const response = await api.get("/api/events/inactive");
            setEventsData(response.data.events);
            setFilteredEvents(response.data.events);
          } catch (error) {
            console.error("Error fetching events:", error);
            setError(error.response?.data?.message || "Failed to fetch events. Please try again later."); 
          } finally {
            setLoading(false);
          }
        };
    
        fetchEvents();
      }, []);
    

    return (
        <div>
            <Navbar />
            <BannerSmall
                bannerTitle="Past Events"
                bannerImage={bannerImage2}
                breadcrumbs={[
                    { label: "Home", link: "/" },
                    { label: "Event History", link: "/events" } // Updated breadcrumb to reflect Past Events
                ]}
            />
            <div className="history-event-section">
                <div className="container">
                    <div className="event-header">
                        <h2>Recollecting Past Events</h2> {/* Updated header */}
                        <h5>
                            Browse through our past events and relive the memories!
                        </h5>
                    </div>

                    <div className="events-container d-flex">
                        <EventsFilterSection />
                        <EventAuth events={eventsData} /> {/* Pass past events data */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventHistory;
