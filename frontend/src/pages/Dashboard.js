import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import EventTable from '../components/EventTable';
import RSVPTable from '../components/RSVPTable';
import DashboardStats from '../components/DashboardStats';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const promises = [
        user?.role === 'organizer' ? api.get('/api/events?organizer=' + user._id) : null,
        api.get('/api/events/my-rsvps')
      ].filter(Boolean); // Filter out null promises

      const responses = await Promise.all(promises);
      
      if (user?.role === 'organizer') {
        setEvents(responses[0].data.data);
        setRsvps(responses[1].data.data);
      } else {
        setRsvps(responses[0].data.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {user?.role === 'organizer' && (
          <Link
            to="/create-event"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <DashboardStats events={events} rsvps={rsvps} />

      {user?.role === 'organizer' && (
        <div className="mt-8">
          <h2 className="bg-gray-800 p-6 rounded-lg shadow-md">Your Events</h2>
          <EventTable events={events} onEventDeleted={fetchDashboardData} />
        </div>
      )}
      

      <div className="mt-8">
        <h2 className="bg-gray-800 p-6 rounded-lg shadow-md">Your RSVPs</h2>
        <RSVPTable rsvps={rsvps} />
      </div>
    </div>
  );
};

export default Dashboard;
