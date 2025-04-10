import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import api from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import Loading from '../components/Loading';
import GuestList from '../components/event-management/GuestList';
import RegistrationSettings from '../components/event-management/RegistrationSettings';
import EmailBlast from '../components/event-management/EmailBlast';
import EventInsights from '../components/event-management/EventInsights';
import EventOverview from '../components/event-management/EventOverview';
import Blasts from '../components/event-management/Blasts';

const EventManagement = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events/${id}`);
      setEvent(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load event details');
      showNotification('Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async updatedData => {
    try {
      const config = {
        headers: {
          'Content-Type':
            updatedData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      };

      const res = await api.put(`/api/events/${id}`, updatedData, config);
      await fetchEventDetails(); // Fetch fresh data after update
      return res.data;
    } catch (error) {
      console.error('Update error:', error);
      showNotification(error.response?.data?.message || 'Failed to update event', 'error');
      throw error;
    }
  };

  const handleSendBlast = async blastData => {
    try {
      await api.post(`/api/events/${id}/blast`, blastData);
      showNotification('Email blast sent successfully', 'success');
    } catch (error) {
      showNotification('Failed to send email blast', 'error');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 fixed inset-0 overflow-auto">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-[2000px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <span className="text-gray-600">/</span>
              <h1 className="text-xl font-semibold text-white">{event.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={`/events/${id}`} className="text-gray-400 hover:text-white">
                Preview Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-4 pb-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-gray-800 p-1 mt-6 rounded-lg">
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg
              ${selected ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
              }
            >
              Overview
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg
              ${selected ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
              }
            >
              Guests
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg
              ${selected ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
              }
            >
              Email Blasts
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg
              ${selected ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
              }
            >
              Settings
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg
              ${selected ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`
              }
            >
              Insights
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <EventOverview event={event} onUpdate={handleUpdateEvent} />
            </Tab.Panel>
            <Tab.Panel>
              <GuestList eventId={id} />
            </Tab.Panel>
            <Tab.Panel>
              <Blasts eventId={id} />
            </Tab.Panel>
            <Tab.Panel>
              <RegistrationSettings event={event} onUpdate={handleUpdateEvent} />
            </Tab.Panel>
            <Tab.Panel>
              <EventInsights event={event} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default EventManagement;
