import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';
import './Calendar.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        const fetchedEvents = response.data.data.map(event => ({
          id: event._id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString(),
          time: event.time,
          type: event.type || 'event'
        }));
        console.log('Fetched events:', fetchedEvents);
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventsForDate = date => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => {
      try {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, date);
      } catch (err) {
        console.error('Error parsing date:', event.date);
        return false;
      }
    });
  };

  const handleDateClick = date => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length > 0) {
      setSelectedDate(date);
      setSelectedEvents(dateEvents);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });

    return days.map((day, index) => {
      const dayEvents = getEventsForDate(day);
      const isCurrentMonth = isSameMonth(day, currentDate);
      const hasEvents = dayEvents.length > 0;

      return (
        <div
          key={index}
          className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
            hasEvents ? 'has-events' : ''
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{format(day, 'd')}</div>
          <div className="day-events">
            {dayEvents.map((event, eventIndex) => (
              <div key={eventIndex} className="event-item">
                • {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="calendar-page">
      <div className="sidebar">
        <h3>Live Streams</h3>
        <div className="live-streams">No live streams available</div>
      </div>

      <div className="main-calendar">
        <div className="calendar-header">
          <div className="month-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h2>{format(currentDate, 'MMMM yyyy')}</h2>
            <button
              className="nav-button"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekday-header">Sun</div>
          <div className="weekday-header">Mon</div>
          <div className="weekday-header">Tue</div>
          <div className="weekday-header">Wed</div>
          <div className="weekday-header">Thu</div>
          <div className="weekday-header">Fri</div>
          <div className="weekday-header">Sat</div>
          {renderCalendar()}
        </div>

        {/* Event Details Modal */}
        {selectedDate && (
          <div className="event-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{format(selectedDate, 'MMMM d, yyyy')}</h3>
                <button className="close-button" onClick={() => setSelectedDate(null)}>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="modal-body">
                {selectedEvents.map((event, index) => (
                  <div key={index} className="modal-event">
                    <h4 className="event-title">{event.title}</h4>
                    {event.description && <p>{event.description}</p>}
                    <p className="event-time">Time: {event.time || 'Not specified'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
