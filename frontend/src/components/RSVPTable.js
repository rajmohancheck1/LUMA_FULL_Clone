import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const RSVPTable = ({ rsvps }) => {
  if (rsvps.length === 0) {
    return <div className="text-center py-8 text-gray-400">No RSVPs found</div>;
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
              Ticket Type
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
          {rsvps
            .filter(rsvp => rsvp.event)
            .map(rsvp => (
              <tr key={rsvp._id} className="hover:bg-gray-800 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-200">{rsvp.event.title}</div>
                  <div className="text-sm text-gray-400">{rsvp.event.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-200">
                    {format(new Date(rsvp.event.date), 'PPP')}
                  </div>
                  <div className="text-sm text-gray-400">{rsvp.event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-200 capitalize">{rsvp.ticketType}</div>
                  <div className="text-sm text-gray-400">Qty: {rsvp.numberOfTickets}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      rsvp.status === 'attending'
                        ? 'bg-green-900 text-green-200'
                        : rsvp.status === 'maybe'
                        ? 'bg-yellow-900 text-yellow-200'
                        : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {rsvp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/events/${rsvp.event._id}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    View Event
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RSVPTable;
