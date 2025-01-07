const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEventConfirmation(user, event, rsvp) {
        const message = {
            from: `"EventHub" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: `Confirmation: ${event.title}`,
            html: `
                <h1>Event Registration Confirmed</h1>
                <p>Dear ${user.name},</p>
                <p>Your registration for "${event.title}" has been confirmed.</p>
                <div style="margin: 20px 0;">
                    <h2>Event Details:</h2>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Ticket Type:</strong> ${rsvp.ticketType}</p>
                    <p><strong>Number of Tickets:</strong> ${rsvp.numberOfTickets}</p>
                </div>
                <p>Your ticket QR code is attached to this email.</p>
                <p>Thank you for using EventHub!</p>
            `
        };

        try {
            await this.transporter.sendMail(message);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    async sendEventReminder(user, event) {
        const message = {
            from: `"EventHub" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: `Reminder: ${event.title} is Tomorrow!`,
            html: `
                <h1>Event Reminder</h1>
                <p>Dear ${user.name},</p>
                <p>This is a reminder that "${event.title}" is happening tomorrow!</p>
                <div style="margin: 20px 0;">
                    <h2>Event Details:</h2>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
                <p>We look forward to seeing you there!</p>
            `
        };

        try {
            await this.transporter.sendMail(message);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
}

const sendEmail = async ({ to, subject, html, metadata = {} }) => {
    try {
        // Implement your email sending logic here
        // You can use nodemailer or any other email service
        console.log('Sending email:', { to, subject, html, metadata });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = { sendEmail }; 