const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, getCart, addToCart, removeFromCart, checkWishlist } = require('../controllers/wishlistCartController');
const { protect } = require('../middleware/auth');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:courseId', protect, toggleWishlist);
router.get('/wishlist/:courseId/check', protect, checkWishlist);
router.get('/cart', protect, getCart);
router.post('/cart/:courseId', protect, addToCart);
router.delete('/cart/:courseId', protect, removeFromCart);

module.exports = router;
