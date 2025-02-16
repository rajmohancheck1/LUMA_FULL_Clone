const Event = require('../models/Event');

const checkEventOwnership = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if the logged-in user is the organizer of the event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this event'
            });
        }

        // If ownership check passes, attach event to request for later use
        req.event = event;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = checkEventOwnership;
