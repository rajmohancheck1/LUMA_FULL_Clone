require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('./app');
const http = require('http');
const cors = require('cors');


const initializeSocketService = require('./services/socketService');

const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL, 'https://luwitch.onrender.com', /\.onrender\.com$/]
      : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  

const startServer = async () => {
    try {
      // Connect to database
    //   await connectDB();
  
      // Create HTTP server
      const server = http.createServer(app);
  
      // Initialize Socket Service
      initializeSocketService(server, corsOptions);
  
      // Start server
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Start the server
  startServer();
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});