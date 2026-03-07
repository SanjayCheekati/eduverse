const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignment: {
    title: { type: String, required: true },
    description: { type: String, default: '' }
  },
  content: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  grade: {
    score: { type: Number, default: null },
    maxScore: { type: Number, default: 100 },
    feedback: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'graded', 'returned'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

submissionSchema.index({ student: 1, course: 1 });
submissionSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
