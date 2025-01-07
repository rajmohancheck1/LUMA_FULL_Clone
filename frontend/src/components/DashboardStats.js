const DashboardStats = ({ events, rsvps }) => {
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(event => new Date(event.date) > new Date()).length,
    totalRSVPs: rsvps.length,
    publishedEvents: events.filter(event => event.status === 'published').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-400">Total Events</div>
        <div className="mt-2 text-3xl font-semibold text-white">{stats.totalEvents}</div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-400">Upcoming Events</div>
        <div className="mt-2 text-3xl font-semibold text-white">{stats.upcomingEvents}</div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-400">Total RSVPs</div>
        <div className="mt-2 text-3xl font-semibold text-white">{stats.totalRSVPs}</div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-400">Published Events</div>
        <div className="mt-2 text-3xl font-semibold text-white">{stats.publishedEvents}</div>
      </div>
    </div>
  );
};

export default DashboardStats;
