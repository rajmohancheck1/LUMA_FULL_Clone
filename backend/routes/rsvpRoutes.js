const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    createRSVP,
    getRSVPs,
    updateRSVP
} = require('../controllers/rsvpController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
    .route('/')
    .post(protect, createRSVP)
    .get(protect, authorize('organizer', 'admin'), getRSVPs);

router
    .route('/:id')
    .put(protect, updateRSVP);

module.exports = router; 