const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
