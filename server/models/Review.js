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

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 200, default: '' },
  comment: { type: String, trim: true, maxlength: 2000, default: '' },
  helpful: { type: Number, default: 0 },
  createdAtIST: {
    type: String,
    default: () => formatDateToIST(new Date())
  },
  updatedAtIST: {
    type: String,
    default: () => formatDateToIST(new Date())
  }
}, { timestamps: true });

reviewSchema.pre('save', function (next) {
  if (!this.createdAtIST) {
    this.createdAtIST = formatDateToIST(this.createdAt || new Date());
  }
  this.updatedAtIST = formatDateToIST(new Date());
  next();
});

reviewSchema.pre('findOneAndUpdate', function (next) {
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

reviewSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

reviewSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.createdAtIST = formatDateToIST(ret.createdAt);
    ret.updatedAtIST = formatDateToIST(ret.updatedAt);
    return ret;
  }
});

reviewSchema.index({ student: 1, course: 1 }, { unique: true });
reviewSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
