const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['attending', 'maybe', 'not_attending'],
        default: 'attending'
    },
    ticketType: {
        type: String,
        enum: ['general', 'vip', 'student'],
        default: 'general'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    numberOfTickets: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one RSVP per event
rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema); 