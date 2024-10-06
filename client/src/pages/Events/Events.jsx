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
