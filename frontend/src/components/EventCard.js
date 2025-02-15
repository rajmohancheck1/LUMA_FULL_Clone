import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

const EventCard = ({ event }) => {
  const [imageUrl, setImageUrl] = useState('/default-event.jpg');

  useEffect(() => {
    if (event.image) {
      // Use the direct path to the events uploads folder
      const baseUrl = `${process.env.REACT_APP_API_URL}/uploads/events/${event.image}`;
      setImageUrl(`${baseUrl}?t=${Date.now()}`);
    } else {
      setImageUrl('/default-event.jpg');
    }
  }, [event.image]);

  const handleImageError = (e) => {
    console.log('Image failed to load:', {
      imageUrl,
      eventImage: event.image,
      apiUrl: process.env.REACT_APP_API_URL
    });
    e.target.src = '/default-event.jpg';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative pt-[56.25%]">
        <img
          src={imageUrl}
          alt={event.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="text-blue-400 font-semibold mb-2">{event.title}</h3>
        <div className="text-gray-300 mb-2">
          {format(new Date(event.date), 'PPP')} at {event.time}
        </div>
        <div className="text-gray-400 mb-2">{event.location}</div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-400 font-semibold">${event.price ? event.price.toFixed(2) : '0.00'}</span>
          <Link
            to={`/events/${event._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
