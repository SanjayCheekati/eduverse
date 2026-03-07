const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, title, comment } = req.body;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(403).json({ message: 'You must be enrolled to review this course' });
    const existing = await Review.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this course' });
    const review = await Review.create({ student: req.user._id, course: courseId, rating, title, comment });
    // update course rating
    const reviews = await Review.find({ course: courseId });
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(courseId, { 'rating.average': Math.round(avg * 10) / 10, 'rating.count': reviews.length });
    const populated = await Review.findById(review._id).populate('student', 'name avatar');
    res.status(201).json({ review: populated });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    let sortOption = { createdAt: -1 };
    if (sort === 'helpful') sortOption = { helpful: -1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    if (sort === 'lowest') sortOption = { rating: 1 };
    const total = await Review.countDocuments({ course: courseId });
    const reviews = await Review.find({ course: courseId })
      .populate('student', 'name avatar')
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    // rating breakdown
    const breakdown = await Review.aggregate([
      { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(courseId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    const ratingBreakdown = {};
    for (let i = 1; i <= 5; i++) { ratingBreakdown[i] = 0; }
    breakdown.forEach(b => { ratingBreakdown[b._id] = b.count; });
    res.json({ reviews, total, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page), ratingBreakdown });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.student.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    // recalc
    const reviews = await Review.find({ course: review.course });
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(review.course, { 'rating.average': Math.round(avg * 10) / 10, 'rating.count': reviews.length });
    const populated = await Review.findById(review._id).populate('student', 'name avatar');
    res.json({ review: populated });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    const courseId = review.course;
    await Review.findByIdAndDelete(req.params.id);
    const reviews = await Review.find({ course: courseId });
    const avg = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
    await Course.findByIdAndUpdate(courseId, { 'rating.average': Math.round(avg * 10) / 10, 'rating.count': reviews.length });
    res.json({ message: 'Review deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { $inc: { helpful: 1 } }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ helpful: review.helpful });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createReview, getCourseReviews, updateReview, deleteReview, markHelpful };
