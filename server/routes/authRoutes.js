const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, updateProfileValidation, changePasswordValidation } = require('../middleware/validate');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/password', protect, changePasswordValidation, changePassword);

module.exports = router;
