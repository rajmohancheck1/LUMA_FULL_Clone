const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        const { eventId, ticketQuantity } = req.body;

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Calculate amount
        const amount = event.price * ticketQuantity * 100; // Convert to cents

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                eventId,
                userId: req.user.id,
                ticketQuantity
            }
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Complete payment
// @route   POST /api/payments/complete
// @access  Private
const completePayment = async (req, res) => {
    try {
        const { paymentIntentId, eventId, rsvpId } = req.body;

        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }

        // Create payment record
        const payment = await Payment.create({
            event: eventId,
            user: req.user.id,
            rsvp: rsvpId,
            amount: paymentIntent.amount / 100,
            paymentMethod: 'stripe',
            transactionId: paymentIntentId,
            status: 'completed'
        });

        // Update RSVP payment status
        await RSVP.findByIdAndUpdate(rsvpId, {
            paymentStatus: 'completed'
        });

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate('event', 'title date')
            .populate('rsvp', 'ticketType numberOfTickets');

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPaymentIntent,
    completePayment,
    getUserPayments
}; 