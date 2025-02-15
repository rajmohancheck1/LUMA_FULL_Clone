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
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get events created by the logged-in user
      const [eventsRes, rsvpsRes] = await Promise.all([
        api.get('/api/events/my-events'),
        api.get('/api/events/my-rsvps')
      ]);

      setEvents(eventsRes.data.data);
      setRsvps(rsvpsRes.data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        Please log in to view your dashboard.
      </div>
    );
  }

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
        <Link
          to="/create-event"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <DashboardStats events={events} rsvps={rsvps} />

      <div className="mt-8">
        <h2 className="bg-gray-800 p-6 rounded-lg shadow-md text-white">My Created Events</h2>
        <EventTable events={events} onEventDeleted={fetchDashboardData} />
      </div>

      <div className="mt-8">
        <h2 className="bg-gray-800 p-6 rounded-lg shadow-md text-white">My RSVPs</h2>
        <RSVPTable rsvps={rsvps} />
      </div>
    </div>
  );
};

export default Dashboard;
