/**
 * Main server file that sets up Express application with security configurations
 * and connects to MongoDB database
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const securityMiddleware = require('./middleware/security');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Create Express application
const app = express();

// Security: Disable X-Powered-By header at application level
// This prevents information disclosure about the server technology
app.disable('x-powered-by');

// Database Connection
// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,     // Use new URL parser
  useUnifiedTopology: true   // Use new Server Discovery and Monitoring engine
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware Setup
// Order is important - security middleware should be first
// Apply custom security middleware (CORS, CSP, etc.)
app.use(securityMiddleware);

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Routes Setup
// User-related routes (login, register, etc.)
app.use('/api/users', userRoutes);
// Post-related routes (CRUD operations)
app.use('/api/posts', postRoutes);

// Error Handling
// Global error handling middleware
app.use((err, req, res, next) => {
  // Log error stack trace for debugging
  console.error(err.stack);
  
  // Send different error messages based on environment
  // Production: Generic message to prevent sensitive info disclosure
  // Development: Detailed error message for debugging
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message 
  });
});

// 404 Handler
// Handle requests to non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 