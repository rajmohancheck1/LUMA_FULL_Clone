const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const EmailBlast = require('../models/EmailBlast');
const { subDays, startOfDay, endOfDay } = require('date-fns');

exports.getEventInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeRange = '7days' } = req.query;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Calculate date range
    const endDate = new Date();
    let startDate;
    switch (timeRange) {
      case '30days':
        startDate = subDays(endDate, 30);
        break;
      case '90days':
        startDate = subDays(endDate, 90);
        break;
      case 'all':
        startDate = event.createdAt;
        break;
      default: // 7days
        startDate = subDays(endDate, 7);
    }

    // Get registrations timeline
    const registrations = await RSVP.aggregate([
      {
        $match: {
          event: event._id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get ticket type distribution
    const ticketDistribution = await RSVP.aggregate([
      {
        $match: { event: event._id }
      },
      {
        $group: {
          _id: '$ticketType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate email metrics
    const emailMetrics = await EmailBlast.aggregate([
      {
        $match: { event: event._id }
      },
      {
        $group: {
          _id: null,
          totalOpens: { $sum: '$opens' },
          totalClicks: { $sum: '$clicks' },
          totalSent: { $sum: '$recipientCount' }
        }
      }
    ]);

    // Get previous period data for comparison
    const previousPeriodStart = subDays(startDate, timeRange === 'all' ? 365 : parseInt(timeRange));
    const previousRegistrations = await RSVP.countDocuments({
      event: event._id,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });

    const currentRegistrations = await RSVP.countDocuments({
      event: event._id,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate growth
    const registrationGrowth = previousRegistrations === 0 ? 100 :
      ((currentRegistrations - previousRegistrations) / previousRegistrations) * 100;

    const insights = {
      totalRegistrations: currentRegistrations,
      registrationGrowth: Math.round(registrationGrowth * 10) / 10,
      pageViews: event.pageViews || 0,
      averageViewsPerDay: Math.round((event.pageViews || 0) / ((endDate - startDate) / (1000 * 60 * 60 * 24))),
      conversionRate: event.pageViews === 0 ? 0 : 
        Math.round((currentRegistrations / event.pageViews) * 100 * 10) / 10,
      conversionTrend: 0, // You can implement this calculation based on your needs
      revenue: event.ticketTypes.reduce((acc, type) => 
        acc + (type.soldCount * type.price), 0),
      averageOrderValue: 0, // You can implement this calculation based on your needs
      registrationTimeline: registrations.map(r => ({
        date: r._id,
        count: r.count
      })),
      ticketTypeDistribution: Object.fromEntries(
        ticketDistribution.map(t => [t._id || 'general', t.count])
      ),
      trafficSources: event.trafficSources || {},
      emailMetrics: emailMetrics[0] ? {
        openRate: Math.round((emailMetrics[0].totalOpens / emailMetrics[0].totalSent) * 100),
        clickRate: Math.round((emailMetrics[0].totalClicks / emailMetrics[0].totalSent) * 100)
      } : { openRate: 0, clickRate: 0 },
      waitlistCount: await RSVP.countDocuments({
        event: event._id,
        status: 'waitlist'
      })
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error getting event insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting event insights'
    });
  }
}; 