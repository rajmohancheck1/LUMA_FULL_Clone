import React from 'react';
import { FaLandmark, FaCity, FaBuilding, FaPalette, FaLeaf, FaDumbbell, FaSpa, FaBitcoin, FaMusic, FaTheaterMasks, FaBeer, FaCog, FaCameraRetro } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import "./BrowseEvents.css";

const BrowseEvents = () => {
  return (
    <div className="browse-events">
      <h1 className="title">Discover Events</h1>
      <p className="description">
        Explore popular events near you, browse by category, or check out some
        of the great community calendars.
      </p>

      {/* Local Events Section */}
      <div className="section explore-local">
        <h2>Explore Local Events</h2>

        <div className="region-tabs">
          <button className="tab active">Asia & Pacific</button>
          <button className="tab">Europe</button>
          <button className="tab">Africa</button>
          <button className="tab">Americas</button>
        </div>
        <div className="local-events">
          {[ 
            { city: "Bangkok", events: 4, icon: <FaLandmark /> },
            { city: "Bengaluru", events: 5, icon: <FaBuilding /> },
            { city: "Dubai", events: 3, icon: <FaCity /> },
            { city: "Ho Chi Minh", events: 3, icon: <FaLandmark /> },
            { city: "Hong Kong", events: 7, icon: <FaBuilding /> },
            { city: "Jakarta", events: 2, icon: <FaCity /> },
            { city: "Kuala Lumpur", events: 2, icon: <FaLandmark /> },
            { city: "Manila", events: 1, icon: <FaBuilding /> },
            { city: "Melbourne", events: 2, icon: <FaCity /> },
            { city: "Mumbai", events: 4, icon: <FaLandmark /> },
            { city: "New Delhi", events: 3, icon: <FaBuilding /> },
            { city: "Seoul", events: 2, icon: <FaCity /> },
            { city: "Singapore", events: 7, icon: <FaLandmark /> },
            { city: "Sydney", events: 2, icon: <FaBuilding /> },
            { city: "Taipei", events: 3, icon: <FaCity /> },
            { city: "Tokyo", events: 11, icon: <FaLandmark /> },
          ].map((item, index) => (
            <div key={index} className="city-card">
              <div className="city-icon">{item.icon}</div>
              <span className="city-name">{item.city}</span>
              <span className="event-count">{item.events} Events</span>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Category Section */}
      <div className="section browse-category">
        <h2 style={{ textAlign: 'left' }}>Browse by Category</h2>
        <div className="categories">
          {[ 
            { name: "Arts & Culture", events: 323, icon: <FaPalette /> },
            { name: "Climate", events: 174, icon: <FaLeaf /> },
            { name: "Fitness", events: 266, icon: <FaDumbbell /> },
            { name: "Wellness", events: 450, icon: <FaSpa /> },
            { name: "Crypto", events: 364, icon: <FaBitcoin /> },
            { name: "Music", events: 112, icon: <FaMusic /> },
            { name: "Theater", events: 89, icon: <FaTheaterMasks /> },
            { name: "Food & Drink", events: 250, icon: <FaBeer /> },
            { name: "Technology", events: 142, icon: <FaCog /> },
            { name: "Photography", events: 78, icon: <FaCameraRetro /> },
          ].map((item, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{item.icon}</div>
              <span className="category-name">{item.name}</span>
              <span className="event-count">{item.events} Events</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Calendars Section */}
      <div className="section featured-calendars">
        <h2 style={{ textAlign: 'left' }}>Featured Calendars</h2>
        <div className="calendars">
          {[ 
            { name: "CES", description: "Las Vegas - Explore side events at CES", icon: <MdEventNote /> },
            { name: "Reading Rhythms Global", description: "Not a book club. A reading party. Read with friends to live music.", icon: <MdEventNote /> },
            { name: "ADPList", description: "Your one-stop-shop for all things happening in the ADPList.", icon: <MdEventNote /> },
            { name: "Google I/O", description: "Google's annual developer conference.", icon: <MdEventNote /> },
            { name: "SXSW", description: "Annual event featuring music, tech, and film.", icon: <MdEventNote /> },
            { name: "TEDx", description: "Global events focused on Ideas worth spreading.", icon: <MdEventNote /> },
          ].map((item, index) => (
            <div key={index} className="calendar-card">
              <div className="calendar-icon">{item.icon}</div>
              <span className="calendar-name">{item.name}</span>
              <p className="calendar-description">{item.description}</p>
              <button className="subscribe-btn">Subscribe</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;