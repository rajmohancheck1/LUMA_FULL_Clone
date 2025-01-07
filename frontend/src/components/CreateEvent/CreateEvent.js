import React from 'react';
import './CreateEvent.css';

const EventPage = () => {
  return (
    <div className="event-container">
      <header>
        <h1>Event Name</h1>
        <div className="calendar-type">
          <select>
            <option>Personal Calendar</option>
            <option>Work Calendar</option>
          </select>
          <select className="visibility">
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>
      </header>
      <div className="event-details">
        <div className="image-section">
          <div className="event-image">
            <img src={require("../../assets/event-1735544218596.png")} alt="Event" />
            
          </div>
          <div className="theme-selector">
            <select>
              <option>Minimal</option>
              <option>Elegant</option>
              <option>Vibrant</option>
            </select>
            <button className="shuffle-btn">🔄</button>
          </div>
        </div>
        <div className="details-section">
          <div className="time-section">
            <label>Start</label>
            <input type="datetime-local" />
            <label>End</label>
            <input type="datetime-local" />
          </div>
          <div className="location-section">
            <button>Add Event Location</button>
          </div>
          <div className="description-section">
            <button>Add Description</button>
          </div>
          <div className="event-options">
            <div className="option">
              <label>Tickets</label>
              <span>Free</span>
            </div>
            <div className="option">
              <label>Require Approval</label>
              <input type="checkbox" />
            </div>
            <div className="option">
              <label>Capacity</label>
              <span>Unlimited</span>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <button className="create-event-btn">Create Event</button>
      </footer>
    </div>
  );
};

export default EventPage;