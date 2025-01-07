import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { format, subDays } from 'date-fns';
import Loading from '../Loading';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventInsights = ({ event }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, [event._id, timeRange]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/api/events/${event._id}/insights?timeRange=${timeRange}`);
      setInsights(res.data.data);
      processChartData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setError('Failed to load insights data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    if (!data) return;

    const registrationData = {
      labels: data.registrationTimeline.map(item => format(new Date(item.date), 'MMM d')),
      datasets: [{
        label: 'Registrations',
        data: data.registrationTimeline.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    const ticketDistribution = {
      labels: Object.keys(data.ticketTypeDistribution),
      datasets: [{
        data: Object.values(data.ticketTypeDistribution),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ]
      }]
    };

    const trafficSources = {
      labels: Object.keys(data.trafficSources),
      datasets: [{
        label: 'Traffic Sources',
        data: Object.values(data.trafficSources),
        backgroundColor: 'rgb(54, 162, 235)'
      }]
    };

    setChartData({
      registrationData,
      ticketDistribution,
      trafficSources
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!insights) return <div className="text-gray-500 p-4">No insights data available</div>;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Total Registrations</h3>
          <p className="text-2xl font-bold">{insights.totalRegistrations}</p>
          <p className="text-sm text-green-400">
            +{insights.registrationGrowth}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Page Views</h3>
          <p className="text-2xl font-bold">{insights.pageViews}</p>
          <p className="text-sm text-blue-400">
            {insights.averageViewsPerDay} avg. daily views
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Conversion Rate</h3>
          <p className="text-2xl font-bold">{insights.conversionRate}%</p>
          <p className="text-sm text-yellow-400">
            {insights.conversionTrend}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Revenue</h3>
          <p className="text-2xl font-bold">${insights.revenue}</p>
          <p className="text-sm text-green-400">
            ${insights.averageOrderValue} avg. order value
          </p>
        </div>
      </div>

      {/* Charts */}
      {chartData && (
        <>
          {/* Registration Timeline */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Registration Timeline</h3>
            <div className="h-64">
              <Line
                data={chartData.registrationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ticket Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Ticket Distribution</h3>
              <div className="h-64">
                <Pie
                  data={chartData.ticketDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Traffic Sources</h3>
              <div className="h-64">
                <Bar
                  data={chartData.trafficSources}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Additional Metrics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-gray-400 text-sm">Email Open Rate</h4>
            <p className="text-xl font-bold">{insights.emailMetrics?.openRate || 0}%</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm">Click-through Rate</h4>
            <p className="text-xl font-bold">{insights.emailMetrics?.clickRate || 0}%</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm">Waitlist Size</h4>
            <p className="text-xl font-bold">{insights.waitlistCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInsights; 