/**
 * User routes for authentication and user management
 * Handles registration, login, and profile operations
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/users/register
 */
router.post('/register', async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Return user and token
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Login user
 * POST /api/users/login
 */
router.post('/login', async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(401).json({ 
        error: `Account is locked. Please try again in ${remainingTime} minutes.` 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Increment failed login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();
        return res.status(401).json({ 
          error: 'Too many failed attempts. Account locked for 15 minutes.' 
        });
      }
      
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Return user and token
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get user profile
 * GET /api/users/profile
 * Requires authentication
 */
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router; 