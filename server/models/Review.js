const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 200, default: '' },
  comment: { type: String, trim: true, maxlength: 2000, default: '' },
  helpful: { type: Number, default: 0 },
}, { timestamps: true });

reviewSchema.index({ student: 1, course: 1 }, { unique: true });
reviewSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
