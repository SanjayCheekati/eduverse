const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a quiz for a course
// @route   POST /api/quizzes
const createQuiz = async (req, res) => {
  try {
    const { courseId, title, description, questions, passingScore, timeLimit, module } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'Quiz must have at least one question' });
    }

    for (const q of questions) {
      if (!q.question || !q.options || q.options.length < 2) {
        return res.status(400).json({ message: 'Each question must have at least 2 options' });
      }
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        return res.status(400).json({ message: 'Invalid correct answer index' });
      }
    }

    const quiz = await Quiz.create({
      course: courseId,
      module: module || null,
      title,
      description: description || '',
      questions,
      passingScore: passingScore || 70,
      timeLimit: timeLimit || 0,
      createdBy: req.user._id
    });

    res.status(201).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
const getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .select('-questions.correctAnswer -questions.explanation -attempts')
      .sort({ createdAt: 1 });

    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz detail (for taking quiz - hides answers)
// @route   GET /api/quizzes/:id
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation -attempts');

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check enrollment
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: quiz.course });
    if (!enrollment && req.user.role === 'student') {
      return res.status(403).json({ message: 'You must be enrolled to take this quiz' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check enrollment
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: quiz.course });
    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled to take this quiz' });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: `Must answer all ${quiz.questions.length} questions` });
    }

    // Calculate score
    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        question: q.question,
        options: q.options,
        yourAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      };
    });

    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    quiz.attempts.push({
      student: req.user._id,
      answers,
      score: correct,
      total,
      percentage
    });
    await quiz.save();

    res.json({
      score: correct,
      total,
      percentage,
      passed,
      passingScore: quiz.passingScore,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz results for a student
// @route   GET /api/quizzes/:id/results
const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const myAttempts = quiz.attempts.filter(
      a => a.student.toString() === req.user._id.toString()
    );

    res.json({
      quizTitle: quiz.title,
      passingScore: quiz.passingScore,
      attempts: myAttempts.map(a => ({
        score: a.score,
        total: a.total,
        percentage: a.percentage,
        completedAt: a.completedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz with answers (instructor only)
// @route   GET /api/quizzes/:id/full
const getQuizFull = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('attempts.student', 'name email');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuiz, getCourseQuizzes, getQuiz, submitQuiz, getQuizResults, getQuizFull };
