const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const allowedRole = ['student', 'instructor'].includes(role) ? role : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title thumbnail category')
      .populate('createdCourses', 'title thumbnail enrollmentCount');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save({ validateBeforeSave: false });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await admin.auth().verifyIdToken(credential);
    const { uid: googleId, email, name, picture } = ticket;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google to existing local account if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save({ validateBeforeSave: false });
      }
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new user
      const allowedRole = ['student', 'instructor'].includes(role) ? role : 'student';
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        avatar: picture || '',
        role: allowedRole,
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, googleAuth };
