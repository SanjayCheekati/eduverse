import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Users, Trash2, BookOpen } from 'lucide-react';
import { getWishlist, toggleWishlist, addToCart } from '../utils/api';
import PageTransition from '../components/ui/PageTransition';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n?.toString() || '0';
};

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWishlist();
        setItems(data.wishlist || []);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await toggleWishlist(courseId);
      setItems(prev => prev.filter(c => c._id !== courseId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleAddToCart = async (courseId) => {
    try {
      await addToCart(courseId);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <Loader />;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-white/30 mb-8">{items.length} course{items.length !== 1 ? 's' : ''} in your wishlist</p>

        {items.length === 0 ? (
          <div className="text-center py-20 glass-card border border-white/[0.06]">
            <Heart className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-white/20 text-sm mb-6">Explore courses and save the ones you like</p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="space-y-4">
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
                    {/* Thumbnail */}
                    <Link to={`/courses/${course._id}`} className="sm:w-56 h-36 sm:h-auto bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-white/10" />
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <Link to={`/courses/${course._id}`} className="text-white font-semibold hover:text-primary-300 transition line-clamp-2 text-sm leading-snug">
                          {course.title}
                        </Link>
                        <p className="text-xs text-white/25 mt-1">{course.instructor?.name}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-amber-400 font-bold text-xs">{course.rating?.average?.toFixed(1) || '—'}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.floor(course.rating?.average || 0) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />)}
                          </div>
                          <span className="text-[10px] text-white/20">({formatNumber(course.rating?.count || 0)})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-white/20 mt-1.5">
                          <span>{course.totalLessons} lessons</span>
                          <span>&bull;</span>
                          <span>{course.level}</span>
                          <span>&bull;</span>
                          <span>{formatNumber(course.enrollmentCount)} students</span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                        {course.price === 0 ? (
                          <span className="text-lg font-bold text-emerald-400">Free</span>
                        ) : (
                          <p className="text-lg font-bold text-white">${course.price}</p>
                        )}
                        <button onClick={() => handleAddToCart(course._id)} className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1.5">
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
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
        )}
      </div>
    </PageTransition>
  );
};

export default Wishlist;
