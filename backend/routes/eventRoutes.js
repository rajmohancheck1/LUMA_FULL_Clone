const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
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
} = require('../controllers/eventController');
const { getEventInsights } = require('../controllers/eventInsightsController');

// Create a sub-router for user-specific routes
const userRouter = express.Router();
userRouter.get('/my-events', getMyEvents);
userRouter.get('/my-rsvps', getMyRSVPs);

// Mount the user router
router.use('/', protect, userRouter);

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id/reminders', protect, updateEventReminders);
router.put('/:id/feedback', protect, updateEventFeedback);
router.post('/:id/blasts', protect, sendBlast);
router.get('/:id/insights', protect, getEventInsights);

module.exports = router;