const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create submission
// @route   POST /api/submissions
const createSubmission = async (req, res) => {
  try {
    const { courseId, title, description, content, fileUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(403).json({ message: 'You must be enrolled in the course to submit' });

    const submission = await Submission.create({
      student: req.user._id,
      course: courseId,
      assignment: { title, description },
      content,
      fileUrl: fileUrl || ''
    });
    if (course) {
      await Notification.create({
        recipient: course.instructor,
        sender: req.user._id,
        type: 'assignment',
        title: 'New Submission',
        message: `${req.user.name} submitted "${title}" for "${course.title}"`,
        link: `/instructor/submissions`
      });
    }

    res.status(201).json({ submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student submissions
// @route   GET /api/submissions/me
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions for instructor's courses
// @route   GET /api/submissions/instructor
const getInstructorSubmissions = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).select('_id');
    const courseIds = courses.map(c => c._id);

    const submissions = await Submission.find({ course: { $in: courseIds } })
      .populate('student', 'name email avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
const gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const submission = await Submission.findById(req.params.id).populate('course', 'instructor');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (submission.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to grade this submission' });
    }

    if (score === undefined || score === null || isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be a number between 0 and 100' });
    }

    submission.grade.score = score;
    submission.grade.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedAt = Date.now();
    submission.gradedBy = req.user._id;

    await submission.save();

    await Notification.create({
      recipient: submission.student,
      sender: req.user._id,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your submission "${submission.assignment.title}" has been graded: ${score}/100`,
      link: `/student/submissions`
    });

    res.json({ submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubmission, getMySubmissions, getInstructorSubmissions, gradeSubmission };
