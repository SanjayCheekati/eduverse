const express = require('express');
const router = express.Router();
const {
  createSubmission, getMySubmissions,
  getInstructorSubmissions, gradeSubmission
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), createSubmission);
router.get('/me', protect, getMySubmissions);
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorSubmissions);
router.put('/:id/grade', protect, authorize('instructor', 'admin'), gradeSubmission);

module.exports = router;
