const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizers only)
const createEvent = async (req, res, next) => {
    try {
        if (!req.user.role === 'organizer') {
            return res.status(403).json({
                success: false,
                message: 'Only organizers can create events'
            });
        }

        // Handle file upload
        if (req.file) {
            req.body.image = req.file.filename;
        }

        const event = await Event.create({
            ...req.body,
            organizer: req.user.id
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const { category, search, date, price } = req.query;
        let query = {};

        // Build query
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (date) {
            query.date = { $gte: new Date(date) };
        }
        if (price) {
            query.price = { $lte: parseFloat(price) };
        }

        const events = await Event.find(query)
            .populate('organizer', 'name email')
            .sort({ date: 1 });

        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('rsvps');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Event organizer only)
const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Event organizer only)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        await event.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's RSVPs
// @route   GET /api/events/my-rsvps
// @access  Private
const getMyRSVPs = async (req, res) => {
    try {
        const rsvps = await RSVP.find({ user: req.user.id })
            .populate({
                path: 'event',
                select: 'title date time location status category'
            });

        res.json({
            success: true,
            data: rsvps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching RSVPs'
        });
    }
};

// @desc    Update event reminder settings
// @route   PUT /api/events/:id/reminders
// @access  Private (Organizer only)
const updateEventReminders = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Update reminder settings
        event.reminderSettings = req.body;
        await event.save();

        res.json({
            success: true,
            data: event.reminderSettings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update post-event feedback settings
// @route   PUT /api/events/:id/feedback
// @access  Private (Organizer only)
const updateEventFeedback = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Update feedback settings
        event.feedbackSettings = req.body;
        await event.save();

        res.json({
            success: true,
            data: event.feedbackSettings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Send blast to event attendees
// @route   POST /api/events/:id/blasts
// @access  Private (Organizer only)
const sendBlast = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const { message, subject, recipients = 'all' } = req.body;

        // Get recipients based on filter
        let recipientQuery = { event: event._id };
        if (recipients === 'going') {
            recipientQuery.status = 'attending';
        } else if (recipients === 'maybe') {
            recipientQuery.status = 'maybe';
        }

        const rsvps = await RSVP.find(recipientQuery).populate('user', 'email name');

        // Send emails to recipients
        for (const rsvp of rsvps) {
            await sendEmail({
                to: rsvp.user.email,
                subject: subject || `Update from ${event.title}`,
                html: message,
                metadata: {
                    eventId: event._id,
                    userId: rsvp.user._id,
                    blastType: 'update'
                }
            });
        }

        res.json({
            success: true,
            message: `Blast sent to ${rsvps.length} recipients`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getMyRSVPs,
    updateEventReminders,
    updateEventFeedback,
    sendBlast
}; 