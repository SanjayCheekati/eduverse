const express = require('express');
const router = express.Router();
const {
  getUsers, updateUserRole, toggleUserActive, getAdminStats,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getStudentStats, getInstructorStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id/toggle-active', protect, authorize('admin'), toggleUserActive);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.get('/student/stats', protect, authorize('student'), getStudentStats);
router.get('/instructor/stats', protect, authorize('instructor'), getInstructorStats);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
