import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Trash2, BookOpen, Shield, Tag, CreditCard, Zap } from 'lucide-react';
import { getCart, removeFromCart, enrollCourse, createCheckoutSession } from '../utils/api';
import PageTransition from '../components/ui/PageTransition';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n?.toString() || '0';
};

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getCart();
        setItems(data.cart || []);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await removeFromCart(courseId);
      setItems(prev => prev.filter(c => c._id !== courseId));
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove'); }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const courseIds = items.map(c => c._id);
      const freeItems = items.filter(c => !c.price || c.price === 0);
      const paidItems = items.filter(c => c.price > 0);

      if (paidItems.length > 0) {
        // Redirect to Stripe Checkout for paid courses
        const { data } = await createCheckoutSession(courseIds);
        if (data.free) {
          // All turned out to be free
          toast.success(data.message);
          setItems([]);
          navigate('/student/my-courses');
        } else if (data.url) {
          window.location.href = data.url;
        }
      } else {
        // All free — enroll directly
        for (const course of freeItems) {
          await enrollCourse(course._id);
        }
        toast.success(`Enrolled in ${freeItems.length} free course(s)!`);
        setItems([]);
        navigate('/student/my-courses');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally { setCheckingOut(false); }
  };

  const totalPrice = items.reduce((s, c) => s + (c.price || 0), 0);

  if (loading) return <Loader />;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-white/30 mb-8">{items.length} course{items.length !== 1 ? 's' : ''} in cart</p>

        {items.length === 0 ? (
          <div className="text-center py-20 glass-card border border-white/[0.06]">
            <ShoppingCart className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-2">Your cart is empty</p>
            <p className="text-white/20 text-sm mb-6">Keep shopping to find a course!</p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((course) => (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="glass-card border border-white/[0.06] !p-0 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <Link to={`/courses/${course._id}`} className="sm:w-44 h-28 sm:h-auto bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-8 h-8 text-white/10" />
                        )}
                      </Link>

                      <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 min-w-0">
                          <Link to={`/courses/${course._id}`} className="text-white font-semibold hover:text-primary-300 transition line-clamp-2 text-sm">
                            {course.title}
                          </Link>
                          <p className="text-xs text-white/25 mt-1">{course.instructor?.name}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-amber-400 font-bold text-xs">{course.rating?.average?.toFixed(1) || '—'}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.floor(course.rating?.average || 0) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />)}
                            </div>
                            <span className="text-[10px] text-white/20">({formatNumber(course.enrollmentCount)})</span>
                          </div>
                          <p className="text-[11px] text-white/20 mt-1">{course.totalLessons} lessons &bull; {course.level}</p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                          {course.price === 0 ? (
                            <span className="font-bold text-emerald-400">Free</span>
                          ) : (
                            <p className="text-base font-bold text-white">${course.price}</p>
                          )}
                          <button onClick={() => handleRemove(course._id)} className="text-xs text-white/20 hover:text-red-400 transition flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card border border-white/[0.06] sticky top-24">
                <h2 className="text-lg font-bold text-white mb-5">Total:</h2>

                <div className="space-y-3 mb-5">
                  <div className="border-t border-white/5 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
                >
                  {checkingOut ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Checkout</>
                  )}
                </button>



                <div className="mt-4 pt-4 border-t border-white/5 text-center space-y-2">
                  <p className="text-xs text-white/20 flex items-center justify-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> 30-Day Money-Back Guarantee
                  </p>
                  <p className="text-xs text-white/20 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Instant access after enrollment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Cart;
