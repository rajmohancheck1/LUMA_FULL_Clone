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
        const rsvpRes = await api.get(`/api/events/${id}/rsvp`);
        setRsvpStatus(rsvpRes.data.data.find(rsvp => rsvp.user === user._id));
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

  const handleImageError = (e) => {
    console.log('Image failed to load:', {
      imageUrl,
      eventImage: event.image,
      apiUrl: process.env.REACT_APP_API_URL
    });
    e.target.src = '/default-event.jpg';
  };

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center items-center p-6">
      <div className="max-w-5xl w-full bg-[#1f1f1f] rounded-lg shadow-lg">
        <div className="flex gap-6 p-6">
          {/* Event Image */}
          <div className="w-1/3">
            <div className="h-64 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 overflow-hidden">
              <img
                src={imageUrl}
                alt={event.title}
                className="w-full h-full object-cover mix-blend-overlay"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>

            <div className="flex items-start space-x-4">
              <div className="bg-neutral-700 rounded-lg p-2 text-center">
                <span className="text-xs text-neutral-400 uppercase">
                  {format(eventDate, 'MMM')}
                </span>
                <div className="text-xl font-bold text-white">
                  {format(eventDate, 'd')}
                </div>
              </div>
              <div>
                <div className="font-medium text-white">
                  {format(eventDate, 'EEEE, MMMM d')}
                </div>
                <div className="text-neutral-400">{event.time}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-neutral-400">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">{event.organizer.name}</div>
                <div className="text-sm text-neutral-400">{event.organizer.email}</div>
              </div>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg">
              <p className="text-neutral-300">{event.description}</p>
            </div>

            {!rsvpStatus ? (
              <Button
                onClick={handleRSVP}
                className="w-full bg-[#916c1b] hover:bg-[#7d5d17] text-white py-3 rounded-lg"
              >
                Register for Event
              </Button>
            ) : (
              <div className="p-4 bg-teal-600/20 border border-teal-500/40 text-teal-200 rounded-lg">
                <p>You have successfully registered!</p>
              </div>
            )}

            <div className="p-4 bg-yellow-800/20 rounded-lg">
              <p className="text-yellow-100 font-medium">
                {event.rsvps?.length || 0} People are Going to this Event!
              </p>
            </div>

            <Button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-[#2b2b2b] hover:bg-[#3a3a3a] text-neutral-400 py-3 rounded-lg"
            >
              Contact the Host
            </Button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg">
          Successfully Registered!
        </div>
      )}

      {/* Contact Host Form */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-6">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4 text-white">Contact the Host</h3>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full p-3 border border-neutral-600 rounded-lg mb-4 bg-[#121212] text-white"
              rows="4"
              placeholder="Write your message here..."
            ></textarea>
            <div className="flex justify-between">
              <Button
                onClick={() => setShowContactForm(false)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle send message logic here
                  setShowContactForm(false);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;