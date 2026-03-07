import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, Users, Clock, Play, CheckCircle2, ChevronDown, ChevronUp,
  Award, Globe, Shield, User, BarChart3, FileText, ArrowLeft, Heart,
  ShoppingCart, Share2, ThumbsUp, AlertCircle, Monitor, Download,
  Smartphone, Infinity, ChevronRight, MessageSquare, TrendingUp, Zap
} from 'lucide-react';
import { getCourse, enrollCourse, checkEnrollment, getCourseReviews, createReview, markReviewHelpful, toggleWishlist, checkWishlist, addToCart } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const StarRating = ({ rating, size = 'sm' }) => {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4.5 h-4.5' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : i - 0.5 <= rating ? 'text-amber-400 fill-amber-400/50' : 'text-white/20'}`} />
      ))}
    </div>
  );
};

const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-primary-400 w-16 text-left">{stars} star{stars > 1 ? 's' : ''}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white/30 w-10 text-right">{pct.toFixed(0)}%</span>
    </div>
  );
};

const formatDuration = (mins) => {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n?.toString() || '0';
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [openModules, setOpenModules] = useState({ 0: true });
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewBreakdown, setReviewBreakdown] = useState({});
  const [reviewTotal, setReviewTotal] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCourse(id);
        setCourse(data.course);
        if (user) {
          const [enrollRes, wishRes] = await Promise.all([
            checkEnrollment(id).catch(() => ({ data: { enrolled: false } })),
            checkWishlist(id).catch(() => ({ data: { wishlisted: false } })),
          ]);
          setEnrolled(enrollRes.data.enrolled);
          setWishlisted(wishRes.data.wishlisted);
        }
        const { data: revData } = await getCourseReviews(id, { limit: 6 });
        setReviews(revData.reviews || []);
        setReviewBreakdown(revData.ratingBreakdown || {});
        setReviewTotal(revData.total || 0);
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrollLoading(true);
    try {
      await enrollCourse(id);
      setEnrolled(true);
      toast.success('Successfully enrolled!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    } finally { setEnrollLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(id);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await toggleWishlist(id);
      setWishlisted(data.wishlisted);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const { data } = await createReview(id, reviewForm);
      setReviews(prev => [data.review, ...prev]);
      setReviewTotal(prev => prev + 1);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setReviewSubmitting(false); }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const { data } = await markReviewHelpful(reviewId);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: data.helpful } : r));
    } catch {}
  };

  const toggleModule = (idx) => setOpenModules(p => ({ ...p, [idx]: !p[idx] }));
  const handleExpandAll = () => {
    const newState = !expandAll;
    setExpandAll(newState);
    const obj = {};
    (course?.modules || []).forEach((_, i) => { obj[i] = newState; });
    setOpenModules(obj);
  };

  if (loading) return <Loader />;
  if (!course) return null;

  const totalModules = course.modules?.length || 0;
  const discountedPrice = course.price > 0 ? Math.round(course.price * 0.82 * 100) / 100 : 0;
  const originalPrice = course.price;
  const lastUpdated = new Date(course.updatedAt || course.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <PageTransition>
      {/* Dark Hero Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/courses" className="hover:text-primary-400 transition">Courses</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/50">{course.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">{course.level}</span>
          </div>

          <div className="lg:pr-[340px]">
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
              {course.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-base text-white/60 mb-4 leading-relaxed">
              {course.shortDescription || course.description?.substring(0, 200)}
            </motion.p>

            {/* Meta row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold text-sm">{course.rating?.average?.toFixed(1) || '—'}</span>
                <StarRating rating={course.rating?.average || 0} />
                <span className="text-primary-400 text-sm">({formatNumber(course.rating?.count || 0)} ratings)</span>
              </div>
              <span className="text-white/40 text-sm">{formatNumber(course.enrollmentCount)} students</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Created by <span className="text-primary-400 ml-1">{course.instructor?.name}</span>
              </span>
              <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Last updated {lastUpdated}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> English</span>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-2 mt-4">
              {(course.tags || []).slice(0, 5).map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-xs text-white/50 border border-white/[0.06]">{tag}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab ? 'bg-primary-500/20 text-primary-400 shadow-sm' : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* What you'll learn */}
                {course.whatYouWillLearn?.length > 0 && (
                  <div className="glass-card border border-white/[0.06]">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" /> What you'll learn
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * idx }} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/60 leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course includes */}
                <div className="glass-card border border-white/[0.06]">
                  <h2 className="text-lg font-bold text-white mb-4">This course includes</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: Play, text: `${formatDuration(course.totalDuration)} on-demand video` },
                      { icon: FileText, text: `${course.totalLessons} lessons` },
                      { icon: Download, text: 'Downloadable resources' },
                      { icon: Smartphone, text: 'Access on mobile and TV' },
                      { icon: Infinity, text: 'Full lifetime access' },
                      { icon: Award, text: 'Certificate of completion' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-white/50">
                        <item.icon className="w-4 h-4 text-white/30 flex-shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {course.requirements?.length > 0 && (
                  <div className="glass-card border border-white/[0.06]">
                    <h2 className="text-lg font-bold text-white mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-white/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Description */}
                <div className="glass-card border border-white/[0.06]">
                  <h2 className="text-lg font-bold text-white mb-4">Description</h2>
                  <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{course.description}</div>
                </div>
              </motion.div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <motion.div key="curriculum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-white/[0.06]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Course Content</h2>
                    <p className="text-sm text-white/30 mt-1">
                      {totalModules} sections &bull; {course.totalLessons} lectures &bull; {formatDuration(course.totalDuration)} total length
                    </p>
                  </div>
                  <button onClick={handleExpandAll} className="text-sm text-primary-400 hover:text-primary-300 transition">
                    {expandAll ? 'Collapse all' : 'Expand all'}
                  </button>
                </div>

                <div className="space-y-1">
                  {(course.modules || []).map((mod, idx) => {
                    const modDuration = mod.lessons.reduce((a, l) => a + (l.duration || 0), 0);
                    return (
                      <div key={idx} className="border border-white/[0.04] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(idx)}
                          className="flex items-center justify-between w-full p-4 text-left bg-white/[0.02] hover:bg-white/[0.04] transition"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div animate={{ rotate: openModules[idx] ? 90 : 0 }} className="text-white/40">
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                            <span className="text-sm font-semibold text-white">{mod.title}</span>
                          </div>
                          <span className="text-xs text-white/30 whitespace-nowrap ml-4">
                            {mod.lessons?.length} lectures &bull; {formatDuration(modDuration)}
                          </span>
                        </button>

                        <AnimatePresence>
                          {openModules[idx] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {(mod.lessons || []).map((lesson, lIdx) => (
                                <div key={lIdx} className="flex items-center gap-3 px-4 py-2.5 pl-12 text-sm hover:bg-white/[0.02] border-t border-white/[0.03]">
                                  <Play className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                                  <span className="flex-1 text-white/50">{lesson.title}</span>
                                  <span className="text-xs text-white/20 whitespace-nowrap">{lesson.duration ? `${lesson.duration}:00` : ''}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Instructor Tab */}
            {activeTab === 'instructor' && course.instructor && (
              <motion.div key="instructor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-white/[0.06]">
                <h2 className="text-lg font-bold text-white mb-5">Instructor</h2>
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 overflow-hidden flex-shrink-0">
                    {course.instructor.avatar ? (
                      <img src={course.instructor.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-white/30 font-bold">{course.instructor.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{course.instructor.name}</h3>
                    <p className="text-sm text-white/40 mt-1 leading-relaxed">{course.instructor.bio || 'Expert Instructor'}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/30">
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> {course.rating?.average?.toFixed(1)} Instructor Rating</span>
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {formatNumber(course.rating?.count || 0)} Reviews</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {formatNumber(course.enrollmentCount)} Students</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Rating Overview */}
                <div className="glass-card border border-white/[0.06]">
                  <h2 className="text-lg font-bold text-white mb-5">Student Feedback</h2>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="text-center flex-shrink-0">
                      <p className="text-5xl font-bold text-amber-400">{course.rating?.average?.toFixed(1) || '0.0'}</p>
                      <StarRating rating={course.rating?.average || 0} size="lg" />
                      <p className="text-sm text-white/30 mt-1">Course Rating</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map(s => (
                        <RatingBar key={s} stars={s} count={reviewBreakdown[s] || 0} total={reviewTotal} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Write Review */}
                {enrolled && user && (
                  <div className="glass-card border border-white/[0.06]">
                    {!showReviewForm ? (
                      <button onClick={() => setShowReviewForm(true)} className="btn-primary flex items-center gap-2">
                        <Star className="w-4 h-4" /> Write a Review
                      </button>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <h3 className="text-white font-semibold">Your Review</h3>
                        <div>
                          <label className="text-sm text-white/40 mb-2 block">Rating</label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <button key={i} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: i }))}>
                                <Star className={`w-7 h-7 cursor-pointer transition ${i <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20 hover:text-amber-400/50'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-white/40 mb-1 block">Title</label>
                          <input
                            value={reviewForm.title}
                            onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                            className="glass-input w-full"
                            placeholder="e.g., Great course for beginners"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/40 mb-1 block">Review</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                            rows={4}
                            className="glass-input w-full resize-none"
                            placeholder="Tell us about your experience..."
                          />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" disabled={reviewSubmitting} className="btn-primary">
                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button type="button" onClick={() => setShowReviewForm(false)} className="btn-ghost">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="glass-card border border-white/[0.06] text-center py-10">
                      <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30">No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-white/[0.06]">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {review.student?.avatar ? (
                              <img src={review.student.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-white/50">{review.student?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-white">{review.student?.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <StarRating rating={review.rating} />
                                  <span className="text-xs text-white/20">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            {review.title && <p className="text-white/70 font-medium text-sm mt-2">{review.title}</p>}
                            {review.comment && <p className="text-sm text-white/40 mt-1 leading-relaxed">{review.comment}</p>}
                            <button onClick={() => handleHelpful(review._id)} className="flex items-center gap-1.5 mt-3 text-xs text-white/20 hover:text-white/40 transition">
                              <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful || 0})
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card border border-white/[0.06] sticky top-24">
              {/* Thumbnail */}
              <div className="relative -mx-6 -mt-6 mb-5 h-44 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><BookOpen className="w-14 h-14 text-white/10" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                {course.price === 0 ? (
                  <p className="text-3xl font-bold text-emerald-400">Free</p>
                ) : (
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">${discountedPrice}</p>
                    <p className="text-base text-white/30 line-through">${originalPrice}</p>
                    <span className="badge badge-success text-xs">18% off</span>
                  </div>
                )}
                {course.price > 0 && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> <strong>2 days</strong> left at this price!
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5 mb-5">
                {enrolled ? (
                  <button className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-sm font-semibold" onClick={() => navigate(`/student/learn/${id}`)}>
                    <Play className="w-4 h-4" /> Continue Learning
                  </button>
                ) : (
                  <>
                    {course.price > 0 ? (
                      <button onClick={handleAddToCart} className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-sm font-semibold">
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </button>
                    ) : (
                      <button onClick={handleEnroll} disabled={enrollLoading || user?.role === 'instructor'} className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50">
                        {enrollLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Enroll Now — It\'s Free'}
                      </button>
                    )}
                    {course.price > 0 && (
                      <button onClick={handleEnroll} disabled={enrollLoading || user?.role === 'instructor'} className="btn-secondary w-full !py-3 text-sm font-medium disabled:opacity-50">
                        Buy Now
                      </button>
                    )}
                  </>
                )}
                <div className="flex gap-2">
                  <button onClick={handleToggleWishlist} className={`flex-1 btn-ghost !py-2.5 flex items-center justify-center gap-1.5 text-sm ${wishlisted ? 'text-red-400' : ''}`}>
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-400 text-red-400' : ''}`} />
                    {wishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button className="btn-ghost !py-2.5 !px-3" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Course includes mini */}
              <div className="space-y-2.5 text-sm border-t border-white/5 pt-4">
                <p className="text-xs text-white/30 uppercase tracking-wider font-medium">This course includes:</p>
                {[
                  { icon: Monitor, text: `${formatDuration(course.totalDuration)} on-demand video` },
                  { icon: BookOpen, text: `${course.totalLessons} lessons across ${totalModules} sections` },
                  { icon: Download, text: 'Downloadable resources' },
                  { icon: Infinity, text: 'Full lifetime access' },
                  { icon: Smartphone, text: 'Access on mobile' },
                  { icon: Award, text: 'Certificate of completion' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-white/40">
                    <item.icon className="w-4 h-4 flex-shrink-0 text-white/25" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* 30-day guarantee */}
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-white/20 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> 30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CourseDetail;
