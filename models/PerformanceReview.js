const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String },
  reviewers: [{ feedback: {type: String}, reviewer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true} }],
});

const PerformanceReview = mongoose.model('PerformanceReview', performanceReviewSchema);

module.exports = PerformanceReview;
