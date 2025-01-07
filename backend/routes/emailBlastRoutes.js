const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createEmailBlast,
  getEmailBlasts,
  trackEmailOpen,
  trackEmailClick,
  updateReminderSettings,
  scheduleEmailBlast
} = require('../controllers/emailBlastController');

router.use(protect);
router.use(authorize('organizer', 'admin'));

router
  .route('/')
  .post(createEmailBlast)
  .get(getEmailBlasts);

router.get('/:blastId/open', trackEmailOpen);
router.get('/:blastId/click', trackEmailClick);

router.put('/:eventId/reminders', protect, authorize('organizer', 'admin'), updateReminderSettings);
router.post('/:eventId/email-blasts', protect, authorize('organizer', 'admin'), scheduleEmailBlast);

module.exports = router; 