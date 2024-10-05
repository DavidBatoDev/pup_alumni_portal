import React from "react";
import BannerSmall from "../../components/Banner/BannerSmall";
import Navbar from "../../components/Navbar/Navbar";
import bannerImage from "../../assets/images/eventbanner.png";
import "./Events.css";
import FilterSection from "../../components/FilterSection/Filter";
import EventAuth from "../../components/EventSectionAuth/EventAuth";

const Events = () => {
  const eventsData = [
    {
      date: "Sep 18",
      title: "PUP Alumni Homecoming 2024",
      description:
        "An annual gathering of PUP alumni to reconnect with batchmates, celebrate achievements, and enjoy a night of nostalgia.",
      type: "Face-to-Face",
    },
    {
      date: "Sep 18",
      title: "PUP Cultural Night",
      description:
        "An evening celebrating the rich culture and diversity of PUP, featuring performances, art displays, and more.",
      type: "Face-to-Face",
    },
  ];

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
