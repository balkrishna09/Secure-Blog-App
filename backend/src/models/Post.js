/**
 * Post model for MongoDB using Mongoose
 * Defines the schema for blog posts
 */
const mongoose = require('mongoose');

/**
 * Post schema definition
 * Includes fields for post content and author reference
 */
const postSchema = new mongoose.Schema({
  // Post title with validation
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Post content
  content: {
    type: String,
    required: true
  },
  // Reference to author (User model)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // Enable timestamps for created and updated dates
  timestamps: true
});

// Create and export Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post; 