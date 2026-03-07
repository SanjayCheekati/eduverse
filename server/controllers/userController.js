const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'all') query.role = role;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-password');

    res.json({
      users,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status (admin)
// @route   PUT /api/users/:id/toggle-active
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({ user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Submission.countDocuments()
    ]);

    const [students, instructors, admins] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'admin' })
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role avatar createdAt');

    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularCourses = await Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .select('title enrollmentCount category thumbnail')
      .populate('instructor', 'name');

    // Monthly data for charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate total revenue
    const allCourses = await Course.find().select('price enrollmentCount');
    const totalRevenue = allCourses.reduce((acc, c) => acc + (c.price * c.enrollmentCount), 0);

    // Build monthlyData in the format the frontend expects
    const monthlyData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthName = d.toLocaleString('default', { month: 'short' });
      const users = monthlyUsers.find(m => m._id.year === year && m._id.month === month)?.count || 0;
      const enrollments = monthlyEnrollments.find(m => m._id.year === year && m._id.month === month)?.count || 0;
      monthlyData.push({ month: monthName, users, enrollments, revenue: 0 });
    }

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      usersByRole: { student: students, instructor: instructors, admin: admins },
      monthlyData,
      recentUsers,
      recentEnrollments,
      popularCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/users/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/users/student/stats
const getStudentStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id });
    const submissions = await Submission.find({ student: req.user._id });

    const activeCourses = enrollments.filter(e => e.status === 'active').length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
      : 0;
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.status === 'graded');
    const avgGrade = gradedSubmissions.length > 0
      ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.grade.score || 0), 0) / gradedSubmissions.length)
      : 0;

    res.json({
      stats: { activeCourses, completedCourses, avgProgress, totalSubmissions, avgGrade, totalEnrollments: enrollments.length }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/users/instructor/stats
const getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const pendingSubmissions = await Submission.countDocuments({
      course: { $in: courseIds },
      status: 'submitted'
    });
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrollmentCount), 0);

    res.json({
      stats: {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished).length,
        totalStudents,
        pendingSubmissions,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers, updateUserRole, toggleUserActive, getAdminStats,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getStudentStats, getInstructorStats
};
