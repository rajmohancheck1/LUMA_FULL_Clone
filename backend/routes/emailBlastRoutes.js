const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const {
  createEmailBlast,
  getEmailBlasts,
  trackEmailOpen,
  trackEmailClick,
  updateReminderSettings,
  scheduleEmailBlast
} = require('../controllers/emailBlastController');

// All routes require authentication
router.use(protect);

router.route('/')
  .post(createEmailBlast)
  .get(getEmailBlasts);

router.get('/:blastId/open', trackEmailOpen);
router.get('/:blastId/click', trackEmailClick);

router.put('/:eventId/reminders', updateReminderSettings);
router.post('/:eventId/email-blasts', scheduleEmailBlast);

module.exports = router;