require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const emailBlastRoutes = require('./routes/emailBlastRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
const rsvpRouter = require('./routes/rsvpRoutes');
app.use('/api/events/:eventId/rsvp', rsvpRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/events/:eventId/email-blasts', emailBlastRoutes);
app.use('/api/email-templates', emailTemplateRoutes);

// Serve uploaded files
app.use('/uploads/events', express.static(path.join(__dirname, 'public/uploads/events')));

// Error handler
app.use(errorHandler);

module.exports = app; 