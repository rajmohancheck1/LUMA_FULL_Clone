import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await api.get('/api/events', { params: filters });
      setEvents(res.data.data);
      setError('');
    } catch (error) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = filters => {
    fetchEvents(filters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Discover Amazing Events</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {events.length === 0 && !error && (
        <div className="text-center text-gray-400 py-8">No events found</div>
      )}
    </div>
  );
};

export default Home;
