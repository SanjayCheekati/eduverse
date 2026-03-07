const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createQuiz, getCourseQuizzes, getQuiz, submitQuiz, getQuizResults, getQuizFull } = require('../controllers/quizController');

router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuiz);
router.get('/:id/full', protect, authorize('instructor', 'admin'), getQuizFull);
router.get('/:id/results', protect, getQuizResults);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;
