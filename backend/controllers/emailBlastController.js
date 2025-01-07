const EmailBlast = require('../models/EmailBlast');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { sendEmail } = require('../utils/emailService');
const { addMinutes } = require('date-fns');

exports.createEmailBlast = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { subject, message, recipients, scheduledFor } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Create email blast
    const emailBlast = await EmailBlast.create({
      event: eventId,
      subject,
      message,
      recipients,
      scheduledFor: scheduledFor || new Date(),
      status: scheduledFor ? 'scheduled' : 'sent'
    });

    // If not scheduled, send immediately
    if (!scheduledFor) {
      await sendEmailBlast(emailBlast._id);
    }

    res.status(201).json({
      success: true,
      data: emailBlast
    });
  } catch (error) {
    console.error('Error creating email blast:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating email blast'
    });
  }
};

exports.getEmailBlasts = async (req, res) => {
  try {
    const { eventId } = req.params;
    const emailBlasts = await EmailBlast.find({ event: eventId })
      .sort('-createdAt');

    res.json({
      success: true,
      data: emailBlasts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email blasts'
    });
  }
};

// Function to send email blast
const sendEmailBlast = async (blastId) => {
  try {
    const emailBlast = await EmailBlast.findById(blastId)
      .populate('event');

    if (!emailBlast) throw new Error('Email blast not found');

    // Get recipients based on filter
    let recipientQuery = { event: emailBlast.event._id };
    if (emailBlast.recipients === 'registered') {
      recipientQuery.status = 'confirmed';
    } else if (emailBlast.recipients === 'waitlist') {
      recipientQuery.status = 'waitlist';
    }

    const recipients = await RSVP.find(recipientQuery)
      .populate('user', 'email name');

    // Send emails to all recipients
    const emailPromises = recipients.map(rsvp => 
      sendEmail({
        to: rsvp.user.email,
        subject: emailBlast.subject,
        html: emailBlast.message.replace(
          '{name}', 
          rsvp.user.name
        ),
        metadata: {
          emailBlastId: emailBlast._id,
          eventId: emailBlast.event._id,
          userId: rsvp.user._id
        }
      })
    );

    await Promise.all(emailPromises);

    // Update email blast status
    await EmailBlast.findByIdAndUpdate(blastId, {
      status: 'sent',
      sentAt: new Date(),
      recipientCount: recipients.length
    });

  } catch (error) {
    console.error('Error sending email blast:', error);
    await EmailBlast.findByIdAndUpdate(blastId, {
      status: 'failed'
    });
  }
};

// Track email opens
exports.trackEmailOpen = async (req, res) => {
  try {
    const { blastId } = req.params;
    await EmailBlast.findByIdAndUpdate(blastId, {
      $inc: { opens: 1 }
    });
    
    // Return a 1x1 transparent GIF
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': '43'
    });
    res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error('Error tracking email open:', error);
    res.status(500).end();
  }
};

// Track email clicks
exports.trackEmailClick = async (req, res) => {
  try {
    const { blastId } = req.params;
    const { redirect } = req.query;

    await EmailBlast.findByIdAndUpdate(blastId, {
      $inc: { clicks: 1 }
    });

    res.redirect(redirect || '/');
  } catch (error) {
    console.error('Error tracking email click:', error);
    res.redirect('/');
  }
};

// @desc    Update reminder settings
// @route   PUT /api/events/:eventId/reminders
// @access  Private (Organizer only)
exports.updateReminderSettings = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update reminder settings
    event.reminderSettings = req.body;
    await event.save();

    // Reschedule reminders based on new settings
    if (req.body.enabled) {
      await scheduleEventReminders(event._id);
    } else {
      await cancelEventReminders(event._id);
    }

    res.json({
      success: true,
      data: event.reminderSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Schedule email blast
// @route   POST /api/events/:eventId/email-blasts
// @access  Private (Organizer only)
exports.scheduleEmailBlast = async (req, res) => {
  try {
    const { subject, message, scheduledFor, recipients } = req.body;
    
    const emailBlast = await EmailBlast.create({
      event: req.params.eventId,
      subject,
      message,
      scheduledFor: new Date(scheduledFor),
      recipients,
      status: 'scheduled'
    });

    // Add to email queue
    await emailQueue.add(
      'scheduled-blast',
      { blastId: emailBlast._id },
      { 
        delay: new Date(scheduledFor) - new Date(),
        jobId: emailBlast._id.toString()
      }
    );

    res.status(201).json({
      success: true,
      data: emailBlast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 