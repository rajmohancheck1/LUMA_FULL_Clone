import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateEvent.css';
import { FaCamera } from 'react-icons/fa';

const CATEGORIES = ['conference', 'seminar', 'workshop', 'concert', 'exhibition', 'other'];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'other',
    capacity: 100,
    isVirtual: false,
    streamUrl: '',
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({ ...eventData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (key === 'image') {
          if (eventData.image) {
            formData.append('image', eventData.image);
          }
        } else {
          formData.append(key, eventData[key]);
        }
      });
      
      // Combine date and time
      const dateTime = new Date(eventData.date + 'T' + eventData.time);
      formData.set('date', dateTime.toISOString());

      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/events', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        navigate('/events');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.message || 'Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-creator">
      <nav className="top-bar">
        <div className="navigation">
          <span className="nav-item active">Events</span>
          <span className="nav-item">Dashboard</span>
          <span className="nav-item">Calendar</span>
        </div>
        <div className="time">10:24 AM IST</div>
      </nav>

      <div className="event-form">
        <div className="event-content">
          <div className="image-section">
            <div 
              className="image-upload" 
              onClick={() => document.getElementById('image-input').click()}
              style={{
                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <input
                type="file"
                id="image-input"
                hidden
                onChange={handleImageChange}
                accept="image/*"
              />
              {!imagePreview && <FaCamera className="upload-icon" />}
            </div>
            
            <div className="theme-selector">
              <select 
                className="theme-dropdown"
                value={eventData.category}
                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <input
              type="text"
              className="event-title"
              placeholder="Event Name"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            />

            <div className="time-section">
              <div className="time-input">
                <label>Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  required
                />
              </div>
              <div className="time-input">
                <label>Time</label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  required
                />
              </div>
              <div className="timezone">Asia/Calcutta</div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Add location"
                className="form-input"
                required
              />
              <div className="virtual-option">
                <label>
                  <input
                    type="checkbox"
                    checked={eventData.isVirtual}
                    onChange={(e) => setEventData({ ...eventData, isVirtual: e.target.checked })}
                  />
                  Virtual Event
                </label>
                {eventData.isVirtual && (
                  <input
                    type="text"
                    value={eventData.streamUrl}
                    onChange={(e) => setEventData({ ...eventData, streamUrl: e.target.value })}
                    placeholder="Stream URL"
                    className="form-input"
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={eventData.capacity}
                onChange={(e) => setEventData({ ...eventData, capacity: parseInt(e.target.value) })}
                placeholder="Number of attendees"
                className="form-input"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Add description"
                className="form-input description"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              className="create-event-btn" 
              disabled={loading || !eventData.title || !eventData.date || !eventData.time || !eventData.location || !eventData.capacity}
              onClick={handleSubmit}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;