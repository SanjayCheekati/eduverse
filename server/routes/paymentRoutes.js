const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-checkout-session', protect, authorize('student'), createCheckoutSession);
router.get('/verify/:sessionId', protect, verifyPayment);

// Webhook uses raw body - mounted separately in server.js

module.exports = router;
