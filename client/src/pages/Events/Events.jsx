import {useState, useEffect} from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import Navbar from "../../components/Navbar/Navbar";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Events.css";
import FilterSection from "../../components/EventsFilterSection/EventsFilterSection";
import EventAuth from "../../components/EventSectionAuth/EventAuth";
import eventImg from '../../assets/images/eventimage2.jpg';
import axios from "axios";


const Events = () => {
  // eto dummy data o
  const dummyevent = [
  {
      "event_name": "PUP Cultural Night",
      "event_date": "2024-09-18",
      "location": "PUP Sta. Mesa, Manila Campus",
      "type": "Face-to-face",
      "category": "Social",
      "organization": "PUP Alumni Association",
      "description": "Join us for an unforgettable evening at the PUP Cultural Night, an event where alumni, students, faculty, and the PUP community come together to celebrate the rich cultural heritage and artistic talents of our university. Taking place on September 18, 2024, at the PUP Sta. Mesa, Manila Campus, this event promises to be a vibrant celebration filled with engaging performances, delectable food offerings, and beautiful art exhibits. \n\nThe evening will begin with a welcome reception at 5:00 PM, where attendees can mingle and connect over light refreshments and snacks. The main program will commence at 6:00 PM with an opening speech by the President of the PUP Alumni Association, setting the tone for a night dedicated to showcasing diverse cultural performances. Expect an array of traditional dances, choral renditions, spoken word poetry, and musical performances by PUP's most talented artists. From the grace of folk dance troupes to the powerful voices of our university choir, every performance is curated to highlight the diversity and artistic excellence within the PUP community. \n\nGuests are encouraged to wear smart casual attire or traditional Filipino clothing. For those who wish to show their support for the university spirit, donning PUP colors—red, gold, and white—is highly encouraged. Comfortable shoes are recommended as some portions of the evening will be held outdoors, allowing guests to stroll through various exhibit areas and food stalls. \n\nAttendees will have access to a variety of food stalls offering both local and international cuisine. From traditional Filipino street food like isaw and kwek-kwek to gourmet options like sushi and kebabs, there will be something to satisfy every palate. A designated area for beverages, including coffee, milk teas, and fruit shakes, will be available for refreshment. Explore the creative side of PUP through our art exhibit, featuring paintings, sculptures, and installations by both students and professional alumni artists. Interactive booths will be set up for activities like pottery-making, calligraphy workshops, and more, offering a chance for guests to engage with the arts in a hands-on manner. \n\nWe look forward to welcoming you to a night filled with celebration, camaraderie, and artistic expression. See you at the PUP Cultural Night!",
      "updated_at": "2024-10-06T17:47:07.000000Z",
      "created_at": "2024-10-06T17:47:07.000000Z",
      "event_id": 2
    },
]


  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        setEventsData(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  return (
    <div>
      <Navbar />
      <BannerSmall
        bannerTitle={"Events Page"}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Events", link: "/event" },
        ]}
      />

      <div className="event-section ">
        <div className="container">
          <div className="event-header ">
            <h2>You're MORE than WELCOME to attend.</h2>
            <h5>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
              repellat odio in, dolore voluptates sequi amet animi quaerat ad
              sint rerum?
            </h5>
          </div>
          <div className="events-container d-flex">
            <FilterSection />
            <EventAuth events={eventsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
