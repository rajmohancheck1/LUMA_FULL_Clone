import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, User } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button/button';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState('/default-event.jpg');
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (event?.image) {
      setImageUrl(`${process.env.REACT_APP_API_URL}/uploads/events/${event.image}?t=${Date.now()}`);
    } else {
      setImageUrl('/default-event.jpg');
    }
  }, [event?.image]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events/${id}`);
      setEvent(res.data.data);

      if (user) {
        try {
          const rsvpRes = await api.get(`/api/events/${id}/rsvp`);
          if (rsvpRes.data.data.length > 0) {
            setRsvpStatus(rsvpRes.data.data[0]);
          }
        } catch (rsvpError) {
          console.log('Error fetching RSVP status:', rsvpError);
          // Don't set error state here as the event details are still loaded
        }
      }
    } catch (error) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/api/events/${id}/rsvp`, {
        status: 'attending',
        ticketType: 'general',
        numberOfTickets: 1
      });
      setRsvpStatus(res.data.data);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 5000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to RSVP for this event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
          {error || 'Event not found'}
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  const handleImageError = e => {
    console.log('Image failed to load:', {
      imageUrl,
      eventImage: event.image,
      apiUrl: process.env.REACT_APP_API_URL
    });
    e.target.src = '/default-event.jpg';
  };

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center items-center p-6">
      <div className="bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex items-center text-gray-400 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-400 mb-6">
            <User className="w-5 h-5 mr-2" />
            <span>Hosted by {event.organizer?.name || 'Unknown'}</span>
          </div>
          <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Event Details</h2>
            <p className="text-gray-300 mb-4">{event.description}</p>
            <div className="text-gray-400">
              <p>Date: {format(eventDate, 'MMMM d, yyyy')}</p>
              <p>Time: {format(eventDate, 'h:mm a')}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            {!rsvpStatus ? (
              <Button onClick={handleRSVP} className="w-full">
                Register for Event
              </Button>
            ) : (
              <>
                <div className="w-full text-center bg-green-900/20 text-green-400 py-3 px-6 rounded-lg">
                  You are registered for this event!
                </div>
                <button
                  onClick={() => navigate(`/view-stream/${event._id}`)}
                  className="view-stream-btn w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  View Stream
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed bottom-4 right-4 bg-green-900/90 text-green-100 px-6 py-3 rounded-lg shadow-lg">
          Successfully registered for the event!
        </div>
      )}
    </div>
  );
};

export default EventDetails;
