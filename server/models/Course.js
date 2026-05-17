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

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'file'],
      default: 'link'
    }
  }],
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

applyISTTimestamps(lessonSchema);

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

applyISTTimestamps(moduleSchema);

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
    default: ''
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development', 'Mobile Development', 'Data Science',
      'Machine Learning', 'Cloud Computing', 'DevOps',
      'Cybersecurity', 'UI/UX Design', 'Digital Marketing',
      'Business', 'Other'
    ]
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  modules: [moduleSchema],
  totalDuration: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  requirements: [{
    type: String
  }],
  whatYouWillLearn: [{
    type: String
  }],
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

courseSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

courseSchema.pre('findOneAndUpdate', function (next) {
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

courseSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

courseSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);
