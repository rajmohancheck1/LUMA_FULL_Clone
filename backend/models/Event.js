const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  description: String,
  soldCount: {
    type: Number,
    default: 0
  }
});

const customQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'select', 'checkbox'],
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [String] // For select/checkbox type questions
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    time: {
        type: String,
        required: [true, 'Please add a time'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['conference', 'seminar', 'workshop', 'concert', 'exhibition', 'other'],
    },
    price: {
        type: Number,
        default: 0,
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity'],
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        default: 'default-event.jpg',
    },
    isVirtual: {
        type: Boolean,
        default: false,
    },
    streamUrl: {
        type: String,
    },
    ticketTypes: [ticketTypeSchema],
    customQuestions: [customQuestionSchema],
    requireApproval: {
        type: Boolean,
        default: false
    },
    waitlist: {
        type: Boolean,
        default: false
    },
    registrationDeadline: Date,
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft'
    },
    pageViews: {
        type: Number,
        default: 0
    },
    trafficSources: {
        type: Map,
        of: Number,
        default: {}
    },
    settings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    reminderSettings: {
        enabled: {
            type: Boolean,
            default: true
        },
        schedule: [{
            type: {
                type: String,
                enum: ['24h', '1h'],
                required: true
            },
            enabled: {
                type: Boolean,
                default: true
            }
        }]
    },
    feedbackSettings: {
        enabled: {
            type: Boolean,
            default: false
        },
        delay: {
            type: String,
            enum: ['24', '48', '72'],
            default: '24'
        },
        template: {
            type: String,
            enum: ['default', 'simple', 'detailed'],
            default: 'default'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual populate for RSVPs
eventSchema.virtual('rsvps', {
    ref: 'RSVP',
    localField: '_id',
    foreignField: 'event',
    justOne: false,
});

// Make sure virtuals are included in toJSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Add this to your Event schema
eventSchema.virtual('imageUrl').get(function() {
    if (this.image) {
        return `${process.env.BACKEND_URL}/uploads/events/${this.image}`;
    }
    return null;
});

// Add indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'ticketTypes.name': 1 });

module.exports = mongoose.model('Event', eventSchema); 