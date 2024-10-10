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
            "description": "Join us for an unforgettable evening at the PUP Cultural Night, an event where alumni, students, faculty, and the PUP community come together to celebrate the rich cultural heritage and artistic talents of our university. Taking place on September 18, 2024, at the PUP Sta. Mesa, Manila Campus, this event promises to be a vibrant celebration filled with engaging performances, delectable food offerings, and beautiful art exhibits. \n\nThe evening will begin with a welcome reception at 5:00 PM, where attendees can mingle and connect over light refreshments and snacks. The main program will commence at 6:00 PM with an opening speech by the President of the PUP Alumni Association, setting the tone for a night dedicated to showcasing diverse cultural performances. Expect an array of traditional dances, choral renditions, spoken word poetry, and musical performances by PUP's most talented artists. From the grace of folk dance troupes to the powerful voices of our university choir, every performance is curated to highlight the diversity and artistic excellence within the PUP community. \n\nGuests are encouraged to wear smart casual attire or traditional Filipino clothing. For those who wish to show their support for the university spirit, donning PUP colors—red, gold, and white—is highly encouraged. Comfortable shoes are recommended as some portions of the evening will be held outdoors, allowing guests to stroll through various exhibit areas and food stalls. \n\nAttendees will have access to a variety of food stalls offering both local and international cuisine. From traditional Filipino street food like isaw and kwek-kwek to gourmet options like sushi and kebabs, there will be something to satisfy every palate. A designated area for beverages, including coffee, milk teas, and fruit shakes, will be available for refreshment. Explore the creative side of PUP through our art exhibit, featuring paintings, sculptures, and installations by both students and professional alumni artists. Interactive booths will be set up for activities like pottery-making, calligraphy workshops, and more, offering a chance for guests to engage with the arts in a hands-on manner. \n\nWe look forward to welcoming you to a night filled with celebration, camaraderie, and artistic expression. See you at the PUP Cultural Night!",
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


