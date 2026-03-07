import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, TrendingUp, DollarSign, Star, PlusCircle,
  ChevronRight, ArrowUpRight, BarChart3, ClipboardList, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInstructorCourses, getInstructorStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          getInstructorCourses(),
          getInstructorStats(),
        ]);
        setCourses(coursesRes.data.courses || []);
        setStats(statsRes.data.stats || statsRes.data);
      } catch {
        setCourses([]);
        setStats({ totalCourses: 0, totalStudents: 0, totalRevenue: 0, avgRating: 0, pendingSubmissions: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Courses', value: stats?.totalCourses || courses.length, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'from-emerald-500 to-green-500' },
    { label: 'Revenue', value: stats?.totalRevenue || 0, prefix: '$', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
    { label: 'Avg Rating', value: stats?.avgRating || 0, decimals: 1, icon: Star, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Instructor <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/40 mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
        <Link to="/instructor/create-course" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Create Course
        </Link>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <div className="glass-card group hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition" />
              </div>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter end={s.value} prefix={s.prefix} decimals={s.decimals} duration={2} />
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* My Courses */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">My Courses</h2>
          <Link to="/instructor/courses" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition">
            Manage All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="glass-card text-center py-12">
            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No courses yet</p>
            <Link to="/instructor/create-course" className="btn-primary mt-4 inline-block">Create Your First Course</Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="glass-table w-full">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Students</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.slice(0, 5).map((course, idx) => (
                    <tr key={course._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white truncate max-w-[200px]">{course.title}</p>
                            <p className="text-xs text-white/30">{course.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-white/60">{course.enrollmentCount || 0}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-white/60">{course.rating?.toFixed(1) || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge text-xs ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-white/60">${(course.price || 0) * (course.enrollmentCount || 0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { to: '/instructor/submissions', label: 'Review Submissions', icon: ClipboardList, color: 'from-blue-500/10 to-blue-500/5 border-blue-500/10', count: stats?.pendingSubmissions },
          { to: '/instructor/analytics', label: 'View Analytics', icon: BarChart3, color: 'from-purple-500/10 to-purple-500/5 border-purple-500/10' },
          { to: '/instructor/create-course', label: 'New Course', icon: PlusCircle, color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/10' },
        ].map((a, idx) => (
          <Link key={idx} to={a.to}>
            <div className={`glass-card bg-gradient-to-br ${a.color} !border hover:!border-white/10 group transition-all duration-300 hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3">
                <a.icon className="w-5 h-5 text-white/50 group-hover:text-white/80 transition" />
                <span className="text-sm text-white/60 group-hover:text-white/90 transition">{a.label}</span>
                {a.count > 0 && <span className="badge badge-warning text-[10px] ml-auto">{a.count}</span>}
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageTransition>
  );
};

export default InstructorDashboard;
