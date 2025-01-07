const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeService {
    generateTicketId(rsvpId, eventId) {
        return crypto
            .createHash('sha256')
            .update(`${rsvpId}-${eventId}-${Date.now()}`)
            .digest('hex')
            .substring(0, 12);
    }

    async generateTicketQR(rsvp, event) {
        const ticketId = this.generateTicketId(rsvp._id, event._id);
        const ticketData = {
            ticketId,
            eventId: event._id,
            rsvpId: rsvp._id,
            userId: rsvp.user,
            eventTitle: event.title,
            ticketType: rsvp.ticketType,
            numberOfTickets: rsvp.numberOfTickets
        };

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(ticketData));
            return {
                ticketId,
                qrCodeDataUrl
            };
        } catch (error) {
            console.error('QR code generation failed:', error);
            throw error;
        }
    }

    async verifyTicket(ticketData) {
        try {
            const ticket = JSON.parse(ticketData);
            // Add verification logic here
            return {
                isValid: true,
                ticket
            };
        } catch (error) {
            return {
                isValid: false,
                error: 'Invalid ticket data'
            };
        }
    }
}

module.exports = new QRCodeService(); 