const Feedback = require('../models/Feedback');
const { Parser } = require('json2csv');

// Get all feedback with optional filters
exports.getAllFeedback = async (req, res) => {
  const { search, rating, date } = req.query;
  let filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ];
  }
  if (rating) filter.rating = Number(rating);
  if (date) filter.date = date;

  try {
    const feedbacks = await Feedback.find(filter).sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const complaints = await Feedback.countDocuments({ type: 'Complaint' });
    const suggestions = await Feedback.countDocuments({ type: 'Suggestion' });
    const compliments = await Feedback.countDocuments({ type: 'Compliment' });

    // Rating distribution
    const ratingCounts = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    const ratingDistribution = [0, 0, 0, 0, 0];
    let totalRating = 0, ratingSum = 0;
    ratingCounts.forEach(r => {
      ratingDistribution[r._id - 1] = r.count;
      totalRating += r.count;
      ratingSum += r._id * r.count;
    });
    const averageRating = totalRating ? (ratingSum / totalRating).toFixed(1) : 0;

    res.json({
      total,
      complaints,
      suggestions,
      compliments,
      averageRating,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback' });
  }
};

// Export CSV
exports.exportCSV = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const fields = ['name', 'email', 'type', 'rating', 'date', 'status'];
    const parser = new Parser({ fields });
    const csv = parser.parse(feedbacks);
    res.header('Content-Type', 'text/csv');
    res.attachment('feedback.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting CSV' });
  }
};
