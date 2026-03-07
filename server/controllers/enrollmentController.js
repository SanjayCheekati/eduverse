const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Cannot enroll in unpublished course' });
    }

    // Block free enrollment on paid courses — must go through Stripe
    if (course.price > 0) {
      return res.status(402).json({ message: 'This is a paid course. Please complete payment through checkout.' });
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId
    });

    course.enrollmentCount += 1;
    await course.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    // Notify instructor
    await Notification.create({
      recipient: course.instructor,
      sender: req.user._id,
      type: 'enrollment',
      title: 'New Enrollment',
      message: `${req.user.name} enrolled in "${course.title}"`,
      link: `/instructor/courses/${course._id}`
    });

    res.status(201).json({ enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/me
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title thumbnail category level totalLessons totalDuration instructor',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort({ lastAccessedAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:courseId/progress
const updateProgress = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      l => l.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({ moduleId, lessonId });

      const course = await Course.findById(req.params.courseId);
      const totalLessons = course.totalLessons || 1;
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

      if (enrollment.progress >= 100) {
        enrollment.status = 'completed';
        enrollment.certificateIssued = true;
      }
    }

    enrollment.lastAccessedAt = Date.now();
    await enrollment.save();

    res.json({ enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check enrollment status
// @route   GET /api/enrollments/:courseId/check
const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });

    res.json({ enrolled: !!enrollment, enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course enrollments (for instructor)
// @route   GET /api/enrollments/course/:courseId
const getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrollment detail for learning page
// @route   GET /api/enrollments/:courseId/learn
const getEnrollmentDetail = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    enrollment.lastAccessedAt = Date.now();
    await enrollment.save();

    res.json({ enrollment, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get certificate data
// @route   GET /api/enrollments/:courseId/certificate
const getCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
      status: 'completed',
      certificateIssued: true
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Certificate not available. Complete the course first.' });
    }

    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name');
    const student = await User.findById(req.user._id).select('name email');

    res.json({
      certificate: {
        studentName: student.name,
        studentEmail: student.email,
        courseTitle: course.title,
        instructorName: course.instructor?.name,
        category: course.category,
        totalLessons: course.totalLessons,
        totalDuration: course.totalDuration,
        completedAt: enrollment.updatedAt,
        enrollmentId: enrollment._id,
        courseId: course._id,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all certificates for current user
// @route   GET /api/enrollments/certificates
const getMyCertificates = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: 'completed',
      certificateIssued: true
    }).populate({
      path: 'course',
      select: 'title thumbnail category totalLessons totalDuration instructor',
      populate: { path: 'instructor', select: 'name' }
    });

    const certificates = enrollments.map(e => ({
      enrollmentId: e._id,
      courseId: e.course._id,
      courseTitle: e.course.title,
      thumbnail: e.course.thumbnail,
      category: e.course.category,
      instructorName: e.course.instructor?.name,
      completedAt: e.updatedAt,
    }));

    res.json({ certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enrollCourse, getMyEnrollments, updateProgress, checkEnrollment, getCourseEnrollments, getEnrollmentDetail, getCertificate, getMyCertificates };
