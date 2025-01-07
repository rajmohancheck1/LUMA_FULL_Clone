import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const imageUrl = event.image 
    ? `${process.env.REACT_APP_API_URL}/uploads/events/${event.image}`
    : '/default-event.jpg';

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/default-event.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-blue-400 font-semibold mb-2">{event.title}</h3>
        <div className="text-gray-300 mb-2">
          {format(new Date(event.date), 'PPP')} at {event.time}
        </div>
        <div className="text-gray-400 mb-2">{event.location}</div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-400 font-semibold">${event.price.toFixed(2)}</span>
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
