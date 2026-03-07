const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { courseIds } = req.body;
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'courseIds array is required' });
    }

    const courses = await Course.find({
      _id: { $in: courseIds },
      isPublished: true
    });

    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: 'One or more courses not found or unpublished' });
    }

    // Check if already enrolled in any
    const existing = await Enrollment.find({
      student: req.user._id,
      course: { $in: courseIds }
    });
    if (existing.length > 0) {
      const enrolledTitles = existing.map(e => {
        const c = courses.find(c => c._id.toString() === e.course.toString());
        return c?.title;
      }).filter(Boolean);
      return res.status(400).json({ message: `Already enrolled in: ${enrolledTitles.join(', ')}` });
    }

    // Separate free and paid courses
    const freeCourses = courses.filter(c => c.price === 0);
    const paidCourses = courses.filter(c => c.price > 0);

    // Auto-enroll in free courses
    for (const course of freeCourses) {
      await enrollStudent(req.user, course);
    }

    if (paidCourses.length === 0) {
      return res.json({ free: true, message: `Enrolled in ${freeCourses.length} free course(s)` });
    }

    const line_items = paidCourses.map(course => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: course.title,
          description: course.shortDescription || course.description?.substring(0, 200) || '',
          ...(course.thumbnail && { images: [course.thumbnail] })
        },
        unit_amount: Math.round(course.price * 100), // Stripe uses cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      line_items,
      metadata: {
        userId: req.user._id.toString(),
        courseIds: paidCourses.map(c => c._id.toString()).join(','),
      },
      success_url: `${process.env.CLIENT_URL}/student/my-courses?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/student/cart?payment=cancelled`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, courseIds } = session.metadata;

    if (userId && courseIds) {
      const ids = courseIds.split(',');
      const user = await User.findById(userId);
      if (user) {
        for (const courseId of ids) {
          const course = await Course.findById(courseId);
          if (course) {
            const existing = await Enrollment.findOne({ student: userId, course: courseId });
            if (!existing) {
              await enrollStudent(user, course);
            }
          }
        }
      }
    }
  }

  res.json({ received: true });
};

// @desc    Verify payment status for a session
// @route   GET /api/payments/verify/:sessionId
const verifyPayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      courseIds: session.metadata?.courseIds?.split(',') || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: enroll a student in a course
async function enrollStudent(user, course) {
  const enrollment = await Enrollment.create({
    student: user._id,
    course: course._id
  });

  course.enrollmentCount += 1;
  await course.save({ validateBeforeSave: false });

  await User.findByIdAndUpdate(user._id, {
    $push: { enrolledCourses: course._id }
  });

  await Notification.create({
    recipient: course.instructor,
    sender: user._id,
    type: 'enrollment',
    title: 'New Enrollment',
    message: `${user.name} enrolled in "${course.title}"`,
    link: `/instructor/courses/${course._id}`
  });

  return enrollment;
}

module.exports = { createCheckoutSession, handleWebhook, verifyPayment };
