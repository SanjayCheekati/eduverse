const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
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

userSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
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

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

userSchema.index({ role: 1 });
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
