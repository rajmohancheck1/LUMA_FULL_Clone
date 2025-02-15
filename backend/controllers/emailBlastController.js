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

    // Check if user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send email blasts for this event'
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
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view email blasts for this event'
      });
    }

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

    // Update blast status
    emailBlast.status = 'sent';
    emailBlast.sentAt = new Date();
    await emailBlast.save();

  } catch (error) {
    console.error('Error sending email blast:', error);
    throw error;
  }
};

exports.trackEmailOpen = async (req, res) => {
  try {
    const { blastId } = req.params;
    const emailBlast = await EmailBlast.findById(blastId);

    if (!emailBlast) {
      return res.status(404).json({
        success: false,
        message: 'Email blast not found'
      });
    }

    emailBlast.opens = (emailBlast.opens || 0) + 1;
    await emailBlast.save();

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

exports.trackEmailClick = async (req, res) => {
  try {
    const { blastId } = req.params;
    const { url } = req.query;

    const emailBlast = await EmailBlast.findById(blastId);
    if (!emailBlast) {
      return res.status(404).json({
        success: false,
        message: 'Email blast not found'
      });
    }

    emailBlast.clicks = (emailBlast.clicks || 0) + 1;
    await emailBlast.save();

    res.redirect(url);
  } catch (error) {
    console.error('Error tracking email click:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking email click'
    });
  }
};

exports.updateReminderSettings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update reminder settings'
      });
    }

    event.reminderSettings = {
      ...event.reminderSettings,
      ...req.body
    };

    await event.save();

    res.json({
      success: true,
      data: event.reminderSettings
    });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder settings'
    });
  }
};

exports.scheduleEmailBlast = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule email blasts'
      });
    }

    const { subject, message, scheduledFor, recipients } = req.body;

    const emailBlast = await EmailBlast.create({
      event: eventId,
      subject,
      message,
      scheduledFor,
      recipients,
      status: 'scheduled'
    });

    res.status(201).json({
      success: true,
      data: emailBlast
    });
  } catch (error) {
    console.error('Error scheduling email blast:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling email blast'
    });
  }
};