import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const EventTable = ({ events, onEventDeleted }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleDelete = async eventId => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/events/${eventId}`);
        showNotification('Event deleted successfully', 'success');
        onEventDeleted();
      } catch (error) {
        showNotification('Failed to delete event', 'error');
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleView = (eventId) => {
    navigate(`/events/${eventId}/manage`);
  };

  if (events.length === 0) {
    return <div className="text-center py-8 text-gray-400">No events found</div>;
  }
 
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Attendees
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {events.map(event => (
            <tr key={event._id} className="hover:bg-gray-800 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-200">{event.title}</div>
                <div className="text-sm text-gray-400">{event.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-200">
                  {format(new Date(event.date), 'PPP')}
                </div>
                <div className="text-sm text-gray-400">{event.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-200">
                  {event.rsvps?.length || 0} / {event.capacity}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      event.status === 'published'
                        ? 'bg-green-900 text-green-200'
                        : event.status === 'draft'
                        ? 'bg-yellow-900 text-yellow-200'
                        : 'bg-red-900 text-red-200'
                    }`}
                >
                  {event.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                <button
                  onClick={() => handleView(event._id)}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Manage
                </button>
                <Link
                  to={`/events/${event._id}`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Preview
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;