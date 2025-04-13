/**
 * User model for MongoDB using Mongoose
 * Defines the schema and methods for user authentication and management
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema definition
 * Includes fields for user authentication and account management
 */
const userSchema = new mongoose.Schema({
  // Username field with validation
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  // Email field with validation
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // Password field with validation
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Admin flag for role-based access control
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Security features for login attempts
  loginAttempts: {
    type: Number,
    default: 0
  },
  // Account lockout timestamp
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  // Enable timestamps for created and updated dates
  timestamps: true
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes password if it has been modified
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare candidate password with stored hash
 * @param {String} candidatePassword - Password to compare
 * @returns {Boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User; 