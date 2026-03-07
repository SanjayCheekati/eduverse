const mongoose = require('mongoose');

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
});

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
});

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
  }]
}, {
  timestamps: true
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
