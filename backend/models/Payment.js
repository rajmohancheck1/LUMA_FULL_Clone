const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    rsvp: {
        type: mongoose.Schema.ObjectId,
        ref: 'RSVP',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        unique: true
    },
    refundId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema); 