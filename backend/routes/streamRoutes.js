// /server/routes/streamRoutes.js
const express = require('express');
const { createStream, getStreams, endStream ,deleteStream} = require('../controllers/streamController');

const router = express.Router();

// Stream creation route
router.post('/', createStream);

// Get all active streams route
router.get('/', getStreams);

// End stream route
// router.delete('/:streamId', endStream);

// Delete stream route
router.delete('/:streamId', deleteStream);

module.exports = router;