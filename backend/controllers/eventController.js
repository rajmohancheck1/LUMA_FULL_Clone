const mongoose = require('mongoose');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const path = require('path');
const fs = require('fs');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res, next) => {
    try {
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
        const { category, search, date, price, organizer } = req.query;
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
        if (organizer) {
            query.organizer = organizer;
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
        console.error('Error in getEvents:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error fetching events'
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
// @access  Private
const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Handle file upload
        if (req.file) {
            // Delete old image if it exists and is not the default
            if (event.image && event.image !== 'default-event.jpg') {
                const oldImagePath = path.join(__dirname, '../public/uploads/events', event.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            req.body.image = req.file.filename;
        }

        // Add timestamp to force browser to reload image
        const timestamp = Date.now();
        
        event = await Event.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            {
                new: true,
                runValidators: true
            }
        );

        // Add timestamp to image URL
        event = event.toObject();
        if (event.image) {
            event.imageUrl = `/uploads/events/${event.image}?t=${timestamp}`;
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

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Delete event image if it exists
        if (event.image) {
            const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'events', event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete all RSVPs associated with this event
        await RSVP.deleteMany({ event: event._id });

        // Delete the event
        await event.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error deleting event'
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
                populate: { path: 'organizer', select: 'name email' }
            });

        res.json({
            success: true,
            data: rsvps
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id })
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
            message: error.message || 'Error fetching your events'
        });
    }
};

// @desc    Update event reminder settings
// @route   PUT /api/events/:id/reminders
// @access  Private
const updateEventReminders = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update reminder settings'
            });
        }

        event.reminderSettings = req.body;
        await event.save();

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

// @desc    Update post-event feedback settings
// @route   PUT /api/events/:id/feedback
// @access  Private
const updateEventFeedback = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update feedback settings'
            });
        }

        event.feedbackSettings = req.body;
        await event.save();

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

// @desc    Send blast to event attendees
// @route   POST /api/events/:id/blasts
// @access  Private
const sendBlast = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send blast messages'
            });
        }

        // Add blast message to event
        event.blasts.push({
            message: req.body.message,
            sentAt: new Date()
        });

        await event.save();

        // Here you would typically send the blast message to all attendees
        // through your preferred notification system

        res.json({
            success: true,
            message: 'Blast message sent successfully'
        });
    } catch (error) {
        res.status(400).json({
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
    getMyEvents,
    updateEventReminders,
    updateEventFeedback,
    sendBlast
};