/**
 * Post routes for blog post operations
 * Handles CRUD operations for posts
 */
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { auth, isAdmin } = require('../middleware/auth');

/**
 * Create a new post
 * POST /api/posts
 * Requires authentication
 */
router.post('/', auth, async (req, res) => {
  try {
    // Create new post with author ID
    const post = new Post({
      ...req.body,
      author: req.user._id
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get all posts
 * GET /api/posts
 */
router.get('/', async (req, res) => {
  try {
    // Find all posts, populate author info, and sort by creation date
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get single post
 * GET /api/posts/:id
 */
router.get('/:id', async (req, res) => {
  try {
    // Find post by ID and populate author info
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update post
 * PATCH /api/posts/:id
 * Requires authentication
 * Only author or admin can update
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    // Find post by ID
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    // Update post with new data
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete post
 * DELETE /api/posts/:id
 * Requires authentication
 * Only author or admin can delete
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find post by ID
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Remove post
    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 