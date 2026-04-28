const express = require('express');
const Feedback = require('../model/Feedback');

const router = express.Router();

// POST /feedback - Submit feedback
router.post('/feedback', async (req, res) => {
  try {
    const { studentName, subject, rating, comments } = req.body;

    const feedback = new Feedback({
      studentName,
      subject,
      rating,
      comments
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /feedbacks - Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /feedbacks/:subject - Get feedbacks by subject
router.get('/feedbacks/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const feedbacks = await Feedback.find({ subject: new RegExp(subject, 'i') }).sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

    res.json({
      subject,
      feedbacks,
      averageRating: parseFloat(averageRating),
      totalFeedbacks: feedbacks.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;