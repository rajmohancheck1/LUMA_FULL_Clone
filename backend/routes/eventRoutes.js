const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getMyRSVPs,
    updateEventReminders,
    updateEventFeedback,
    sendBlast
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getEventInsights } = require('../controllers/eventInsightsController');

router.get('/my-rsvps', protect, getMyRSVPs);

router
    .route('/')
    .get(getEvents)
    .post(
        protect, 
        authorize('organizer', 'admin'), 
        upload.single('image'), 
        createEvent
    );

router
    .route('/:id')
    .get(getEvent)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

router.get('/:id/insights', protect, authorize('organizer', 'admin'), getEventInsights);

router.put('/:id/reminders', protect, authorize('organizer', 'admin'), updateEventReminders);
router.put('/:id/feedback', protect, authorize('organizer', 'admin'), updateEventFeedback);
router.post('/:id/blasts', protect, authorize('organizer', 'admin'), sendBlast);

module.exports = router; 