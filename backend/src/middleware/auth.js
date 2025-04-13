/**
 * Authentication middleware to verify JWT tokens and user authentication
 * This middleware is used to protect routes that require authentication
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      throw new Error();
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token payload
    const user = await User.findOne({ _id: decoded.id });

    // Check if user exists
    if (!user) {
      throw new Error();
    }

    // Attach user and token to request object for use in routes
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Return 401 Unauthorized if authentication fails
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after auth middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { auth, isAdmin }; 