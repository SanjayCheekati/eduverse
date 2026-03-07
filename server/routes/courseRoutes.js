const express = require('express');
const router = express.Router();
const {
  createCourse, getCourses, getCourse, updateCourse, deleteCourse,
  addModule, addLesson, getInstructorCourses, togglePublish
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/instructor/me', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.put('/:id/publish', protect, authorize('instructor', 'admin'), togglePublish);
router.post('/:id/modules', protect, authorize('instructor', 'admin'), addModule);
router.post('/:id/modules/:moduleId/lessons', protect, authorize('instructor', 'admin'), addLesson);

module.exports = router;
