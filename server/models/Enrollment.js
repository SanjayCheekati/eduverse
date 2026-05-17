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

const completedLessonSchema = new mongoose.Schema({
  moduleId: mongoose.Schema.Types.ObjectId,
  lessonId: mongoose.Schema.Types.ObjectId,
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

applyISTTimestamps(completedLessonSchema);

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
  completedLessons: [completedLessonSchema],
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

enrollmentSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

enrollmentSchema.pre('findOneAndUpdate', function (next) {
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

enrollmentSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

enrollmentSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
