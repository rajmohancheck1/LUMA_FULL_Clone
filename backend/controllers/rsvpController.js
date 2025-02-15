const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

// @desc    Create RSVP
// @route   POST /api/events/:eventId/rsvp
// @access  Private
const createRSVP = async (req, res) => {
    try {
        // Add eventId from params
        const eventId = req.params.eventId;
        
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user already RSVP'd
        const existingRSVP = await RSVP.findOne({
            event: eventId,
            user: req.user.id
        });

        if (existingRSVP) {
            return res.status(400).json({
                success: false,
                message: 'You have already RSVP\'d to this event'
            });
        }

        // Create RSVP
        const rsvp = await RSVP.create({
            event: eventId,
            user: req.user.id,
            status: req.body.status || 'attending',
            ticketType: req.body.ticketType || 'general',
            numberOfTickets: req.body.numberOfTickets || 1
        });

        // Populate event details
        await rsvp.populate('event', 'title date time location status');

        res.status(201).json({
            success: true,
            data: rsvp
        });
    } catch (error) {
        console.error('RSVP Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating RSVP'
        });
    }
};

// @desc    Get all RSVPs for an event
// @route   GET /api/events/:eventId/rsvp
// @access  Private
const getRSVPs = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get all RSVPs for the event
        const rsvps = await RSVP.find({ event: req.params.eventId })
            .populate('user', 'name email');

        // If user is the organizer, return all RSVPs
        if (event.organizer.toString() === req.user.id) {
            return res.json({
                success: true,
                count: rsvps.length,
                data: rsvps
            });
        }

        // For non-organizers, only return their own RSVP
        const userRSVP = rsvps.filter(rsvp => rsvp.user._id.toString() === req.user.id);
        
        res.json({
            success: true,
            count: userRSVP.length,
            data: userRSVP
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update RSVP
// @route   PUT /api/rsvp/:id
// @access  Private
const updateRSVP = async (req, res) => {
    try {
        let rsvp = await RSVP.findById(req.params.id);

        if (!rsvp) {
            return res.status(404).json({
                success: false,
                message: 'RSVP not found'
            });
        }

        // Only allow RSVP owner to update
        if (rsvp.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this RSVP'
            });
        }

        rsvp = await RSVP.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: rsvp
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRSVP,
    getRSVPs,
    updateRSVP
};