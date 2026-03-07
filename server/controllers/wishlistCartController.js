const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'wishlist', select: 'title thumbnail category level price rating enrollmentCount instructor totalDuration totalLessons', populate: { path: 'instructor', select: 'name avatar' } });
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.findIndex(id => id.toString() === req.params.courseId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save({ validateBeforeSave: false });
      return res.json({ wishlisted: false, message: 'Removed from wishlist' });
    }
    user.wishlist.push(req.params.courseId);
    await user.save({ validateBeforeSave: false });
    res.json({ wishlisted: true, message: 'Added to wishlist' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'cart', select: 'title thumbnail category level price rating enrollmentCount instructor totalDuration totalLessons', populate: { path: 'instructor', select: 'name avatar' } });
    const total = (user.cart || []).reduce((acc, c) => acc + (c.price || 0), 0);
    res.json({ cart: user.cart || [], total: Math.round(total * 100) / 100 });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.cart.some(id => id.toString() === req.params.courseId)) return res.status(400).json({ message: 'Already in cart' });
    if (user.enrolledCourses.some(id => id.toString() === req.params.courseId)) return res.status(400).json({ message: 'Already enrolled in this course' });
    user.cart.push(req.params.courseId);
    await user.save({ validateBeforeSave: false });
    res.json({ message: 'Added to cart' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const removeFromCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { cart: req.params.courseId } });
    res.json({ message: 'Removed from cart' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const checkWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ wishlisted: user.wishlist.some(id => id.toString() === req.params.courseId) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getWishlist, toggleWishlist, getCart, addToCart, removeFromCart, checkWishlist };
