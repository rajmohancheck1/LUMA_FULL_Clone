const mongoose = require('mongoose');

const emailBlastSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipients: {
    type: String,
    enum: ['all', 'registered', 'waitlist'],
    default: 'all'
  },
  scheduledFor: Date,
  sentAt: Date,
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled'
  },
  recipientCount: Number,
  opens: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailBlast', emailBlastSchema); 