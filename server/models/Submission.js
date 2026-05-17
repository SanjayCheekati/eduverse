const mongoose = require('mongoose');

const IST_TIMEZONE = 'Asia/Kolkata';

const formatDateToIST = (value) => {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(value);
};

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
  },
  createdAtIST: {
    type: String,
    default: () => formatDateToIST(new Date())
  },
  updatedAtIST: {
    type: String,
    default: () => formatDateToIST(new Date())
  }
}, {
  timestamps: true
});

submissionSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

submissionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};
  const istNow = formatDateToIST(new Date());

  if (update.$set) {
    update.$set.updatedAtIST = istNow;
  } else {
    update.$set = { updatedAtIST: istNow };
  }

  this.setUpdate(update);
  next();
});

submissionSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

submissionSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

submissionSchema.index({ student: 1, course: 1 });
submissionSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
