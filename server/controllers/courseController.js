const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, shortDescription, category, level, tags, price, requirements, whatYouWillLearn, thumbnail } = req.body;

    const course = await Course.create({
      title,
      description,
      shortDescription,
      category,
      level,
      tags: tags || [],
      price: price || 0,
      requirements: requirements || [],
      whatYouWillLearn: whatYouWillLearn || [],
      thumbnail: thumbnail || '',
      instructor: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all published courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, search, sort } = req.query;

    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;
    if (level && level !== 'All') query.level = level;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { tags: { $in: [new RegExp(escaped, 'i')] } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular' || sort === '-enrollmentCount') sortOption = { enrollmentCount: -1 };
    if (sort === 'rating' || sort === '-rating') sortOption = { 'rating.average': -1 };
    if (sort === 'price-low' || sort === 'price') sortOption = { price: 1 };
    if (sort === 'price-high' || sort === '-price') sortOption = { price: -1 };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-modules');

    res.json({
      courses,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio createdCourses');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, shortDescription, category, level, tags, price, requirements, whatYouWillLearn, thumbnail } = req.body;
    const allowed = {};
    if (title !== undefined) allowed.title = title;
    if (description !== undefined) allowed.description = description;
    if (shortDescription !== undefined) allowed.shortDescription = shortDescription;
    if (category !== undefined) allowed.category = category;
    if (level !== undefined) allowed.level = level;
    if (tags !== undefined) allowed.tags = tags;
    if (price !== undefined) allowed.price = price;
    if (requirements !== undefined) allowed.requirements = requirements;
    if (whatYouWillLearn !== undefined) allowed.whatYouWillLearn = whatYouWillLearn;
    if (thumbnail !== undefined) allowed.thumbnail = thumbnail;

    course = await Course.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true
    }).populate('instructor', 'name avatar');

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Enrollment.deleteMany({ course: course._id });
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { createdCourses: course._id }
    });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add module to course
// @route   POST /api/courses/:id/modules
const addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description } = req.body;
    const order = course.modules.length + 1;

    course.modules.push({ title, description, order, lessons: [] });
    await course.save();

    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add lesson to module
// @route   POST /api/courses/:id/modules/:moduleId/lessons
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const courseModule = course.modules.id(req.params.moduleId);
    if (!courseModule) return res.status(404).json({ message: 'Module not found' });

    const { title, description, videoUrl, duration, resources } = req.body;
    const order = courseModule.lessons.length + 1;

    courseModule.lessons.push({ title, description, videoUrl, duration: duration || 0, resources: resources || [], order });

    // Update total counts
    let totalLessons = 0;
    let totalDuration = 0;
    course.modules.forEach(m => {
      totalLessons += m.lessons.length;
      m.lessons.forEach(l => { totalDuration += l.duration || 0; });
    });
    course.totalLessons = totalLessons;
    course.totalDuration = totalDuration;

    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/me
const getInstructorCourses = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { instructor: req.user._id };
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .populate('instructor', 'name avatar');

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish/Unpublish course
// @route   PUT /api/courses/:id/publish
const togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({ course, message: `Course ${course.isPublished ? 'published' : 'unpublished'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse, getCourses, getCourse, updateCourse, deleteCourse,
  addModule, addLesson, getInstructorCourses, togglePublish
};
