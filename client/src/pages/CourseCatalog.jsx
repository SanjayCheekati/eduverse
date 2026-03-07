import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, BookOpen, Star, Users, Clock, ChevronDown,
  Grid3X3, List, SlidersHorizontal, X, Heart, TrendingUp
} from 'lucide-react';
import { getCourses, toggleWishlist } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n?.toString() || '0';
};

const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'DevOps', 'Blockchain', 'Game Development', 'Other'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-enrollmentCount', label: 'Most Popular' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState('grid');
  const searchTimer = useRef(null);

  useEffect(() => {
    fetchCourses();
  }, [category, level, sort, page, priceFilter]);

  // Debounced auto-search as user types
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchCourses();
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level.toLowerCase();
      if (priceFilter === 'Free') params.priceType = 'free';
      if (priceFilter === 'Paid') params.priceType = 'paid';
      if (search) params.search = search;
      const { data } = await getCourses(params);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Discover hundreds of courses taught by expert instructors
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, topics, or instructors..."
              className="glass-input pl-12 w-full !py-3"
            />
          </form>

          <div className="flex gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="btn-secondary flex items-center gap-2 !py-3"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="glass-input !py-3 text-sm pr-9 appearance-none bg-dark-800 text-white/80 border border-white/[0.08] rounded-xl cursor-pointer min-w-[180px]"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-dark-800 text-white/80">{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Filters</h3>
                  <button onClick={() => { setCategory('All'); setLevel('All'); setPriceFilter('All'); }} className="text-xs text-primary-400 hover:text-primary-300 transition">
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/40 mb-2">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCategory(c); setPage(1); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            category === c
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.08]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 mb-2">Level</p>
                    <div className="flex gap-2">
                      {levels.map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLevel(l); setPage(1); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            level === l
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.08]'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 mb-2">Price</p>
                    <div className="flex gap-2">
                      {['All', 'Free', 'Paid'].map((p) => (
                        <button
                          key={p}
                          onClick={() => { setPriceFilter(p); setPage(1); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            priceFilter === p
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.08]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No courses found</p>
            <p className="text-white/20 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses.map((course, idx) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.5 }}
                >
                  <Link to={`/courses/${course._id}`}>
                    <div className="glass-card !p-0 overflow-hidden group hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
                      <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-10 h-10 text-white/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {course.enrollmentCount >= 50000 && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/90 text-[10px] font-bold text-dark-900 flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" /> Bestseller
                            </span>
                          )}
                          <span className="badge badge-primary text-[10px]">{course.level}</span>
                        </div>
                        {course.price === 0 && (
                          <span className="absolute top-3 right-3 badge badge-success text-[10px]">Free</span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-primary-300 transition leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-white/25 mb-2">{course.instructor?.name || 'Instructor'}</p>

                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-amber-400 font-bold text-xs">{course.rating?.average?.toFixed(1) || '—'}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => {
                              const r = course.rating?.average || course.rating || 0;
                              return <Star key={i} className={`w-3 h-3 ${i <= Math.floor(r) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />;
                            })}
                          </div>
                          <span className="text-[10px] text-white/20">({formatNumber(course.rating?.count || course.enrollmentCount || 0)})</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-white/20 mb-3">
                          <span>{formatNumber(course.enrollmentCount)} students</span>
                          <span>&bull;</span>
                          <span>{course.totalLessons || 0} lessons</span>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {course.price === 0 ? (
                            <span className="text-sm font-bold text-emerald-400">Free</span>
                          ) : (
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-bold text-white">${course.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm transition ${
                      page === p
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default CourseCatalog;
