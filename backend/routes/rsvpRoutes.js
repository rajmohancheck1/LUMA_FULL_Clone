const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    createRSVP,
    getRSVPs,
    updateRSVP
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

// All RSVP routes require authentication
router.use(protect);

router.route('/')
    .post(createRSVP)
    .get(getRSVPs);

router.route('/:id')
    .put(updateRSVP);

module.exports = router;