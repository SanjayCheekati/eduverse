const express = require('express');
const router = express.Router();
const {
  enrollCourse, getMyEnrollments, updateProgress,
  checkEnrollment, getCourseEnrollments, getEnrollmentDetail, getCertificate, getMyCertificates
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyEnrollments);
router.get('/certificates', protect, getMyCertificates);
router.post('/:courseId', protect, authorize('student'), enrollCourse);
router.put('/:courseId/progress', protect, updateProgress);
router.get('/:courseId/check', protect, checkEnrollment);
router.get('/:courseId/learn', protect, getEnrollmentDetail);
router.get('/:courseId/certificate', protect, getCertificate);
router.get('/course/:courseId', protect, authorize('instructor', 'admin'), getCourseEnrollments);

module.exports = router;
