const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    completePayment,
    getUserPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/complete', protect, completePayment);
router.get('/', protect, getUserPayments);

module.exports = router; 