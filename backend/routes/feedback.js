const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Get all feedback (with filters)
router.get('/', feedbackController.getAllFeedback);

// Get dashboard stats
router.get('/stats', feedbackController.getStats);

// Delete feedback by ID
router.delete('/:id', feedbackController.deleteFeedback);

// Export CSV (optional)
router.get('/export', feedbackController.exportCSV);

module.exports = router;
