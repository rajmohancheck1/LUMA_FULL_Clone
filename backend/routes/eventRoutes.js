const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const checkEventOwnership = require('../middleware/checkEventOwnership');
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
// Add ownership check for update and delete operations
router.put('/:id', protect, checkEventOwnership, upload.single('image'), updateEvent);
router.delete('/:id', protect, checkEventOwnership, deleteEvent);
router.put('/:id/reminders', protect, checkEventOwnership, updateEventReminders);
router.put('/:id/feedback', protect, checkEventOwnership, updateEventFeedback);
router.post('/:id/blasts', protect, checkEventOwnership, sendBlast);
router.get('/:id/insights', protect, checkEventOwnership, getEventInsights);

module.exports = router;