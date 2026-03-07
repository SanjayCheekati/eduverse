const express = require('express');
const router = express.Router();
const { upload, uploadAvatar, chatUpload, uploadChatFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/chat', protect, chatUpload.single('file'), uploadChatFile);

module.exports = router;
