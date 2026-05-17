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

const applyISTTimestamps = (schema) => {
  schema.add({
    createdAtIST: {
      type: String,
      default: () => formatDateToIST(new Date())
    },
    updatedAtIST: {
      type: String,
      default: () => formatDateToIST(new Date())
    }
  });

  schema.pre('save', function (next) {
    if (!this.createdAtIST) {
      this.createdAtIST = formatDateToIST(this.createdAt || new Date());
    }
    this.updatedAtIST = formatDateToIST(new Date());
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
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

  schema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
      ret.createdAtIST = formatDateToIST(ret.createdAt);
      ret.updatedAtIST = formatDateToIST(ret.updatedAt);
      return ret;
    }
  });

  schema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
      ret.createdAtIST = formatDateToIST(ret.createdAt);
      ret.updatedAtIST = formatDateToIST(ret.updatedAt);
      return ret;
    }
  });
};

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index into options array
  explanation: { type: String, default: '' }
}, {
  timestamps: true
});

applyISTTimestamps(questionSchema);

const quizAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }], // student's chosen option index per question
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

applyISTTimestamps(quizAttemptSchema);

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, default: null }, // optional: link to specific module
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 }, // percentage
  timeLimit: { type: Number, default: 0 }, // minutes, 0 = no limit
  attempts: [quizAttemptSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

quizSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

quizSchema.pre('findOneAndUpdate', function (next) {
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

quizSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

quizSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

quizSchema.index({ course: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
