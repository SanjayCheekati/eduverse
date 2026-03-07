const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index into options array
  explanation: { type: String, default: '' }
});

const quizAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }], // student's chosen option index per question
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, default: null }, // optional: link to specific module
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 }, // percentage
  timeLimit: { type: Number, default: 0 }, // minutes, 0 = no limit
  attempts: [quizAttemptSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

quizSchema.index({ course: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
