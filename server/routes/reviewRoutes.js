const express = require('express');
const router = express.Router();
const { createReview, getCourseReviews, updateReview, deleteReview, markHelpful } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/course/:courseId', getCourseReviews);
router.post('/course/:courseId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);

module.exports = router;
