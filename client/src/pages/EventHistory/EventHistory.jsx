import React, { Component } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/eventimage1.png';
import bannerImage2 from '../../assets/images/eventimage2.jpg';
import './EventHistory.css';
import HistoryEventSectionAuth from '../../components/HistoryEventSectionAuth/HistoryEventSectionAuth';
import EventsFilterSection from '../../components/EventsFilterSection/EventsFilterSection';

const EventHistory = () => {

    //dummy event history data
    const eventHistoryData = [
        {
            "event_name": "Pasdasdasd",
            "event_date": "2024-09-18",
            "location": "PUP Sta. Mesa, Manila Campus",
            "type": "Face-to-face",
            "category": "Social",
            "organization": "PUP Alumni Association",
            "description": "Join us for an unforgettable evening at the!",
            "updated_at": "2024-10-06T17:47:07.000000Z",
            "created_at": "2024-10-06T17:47:07.000000Z",
            "event_images": ["eventImage1.png", "eventImage2.png"],
            "event_id": 1
        },
    ]

    return (
        <div>
            <Navbar/>
            <BannerSmall 
                bannerTitle="Event History" 
                bannerImage={bannerImage2} 
                breadcrumbs={[
                    { label: "Home", link: "/" },
                    { label: "Events History", link: "/events" }
                ]}  
            />

            <div className="history-event-section">
                <div className="container">
                    <div className="event-header">
                        <h2>Recollecting Event Memories</h2>
                        <h5>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
                            repellat odio in, dolore voluptates sequi amet animi quaerat ad
                            sint rerum?
                        </h5>
                    </div>

                    <div className="events-container d-flex">
                        <EventsFilterSection className="d-none"/>
                        <HistoryEventSectionAuth events={eventHistoryData}/>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default EventHistory;


