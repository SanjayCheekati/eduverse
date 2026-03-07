import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Play, Search, Filter, Star, Users, Award } from 'lucide-react';
import { getMyEnrollments } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import Loader from '../../components/ui/Loader';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getMyEnrollments();
        setEnrollments(data.enrollments || []);
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const filtered = enrollments.filter((e) => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = !search || e.course?.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-white/40 text-sm mt-1">{enrollments.length} courses enrolled</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="glass-input !py-2 pl-9 text-sm w-full sm:w-48"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="glass-input !py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No courses found</p>
          <Link to="/courses" className="btn-primary mt-6 inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((enrollment, idx) => (
            <motion.div
              key={enrollment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <Link to={`/student/learn/${enrollment.course?._id}`} className="block h-full">
              <div className="glass-card !p-0 overflow-hidden group hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
                <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                  {enrollment.course?.thumbnail ? (
                    <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-white/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80" />
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${enrollment.status === 'completed' ? 'badge-success' : 'badge-primary'} text-xs`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="w-12 h-12 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs text-primary-400 font-medium">{enrollment.course?.category}</span>
                  <h3 className="font-semibold text-white mt-1 mb-2 line-clamp-2">{enrollment.course?.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {enrollment.course?.rating?.average?.toFixed(1) || '—'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {enrollment.course?.totalLessons || 0} lessons</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/40">Progress</span>
                      <span className="text-primary-400 font-medium">{enrollment.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${enrollment.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default MyCourses;
