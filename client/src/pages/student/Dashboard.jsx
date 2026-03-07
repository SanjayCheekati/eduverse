import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp, Play, ChevronRight,
  BarChart3, Target, Flame, Star, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyEnrollments, getStudentStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, statsRes] = await Promise.all([
          getMyEnrollments(),
          getStudentStats(),
        ]);
        setEnrollments(enrollRes.data.enrollments || []);
        setStats(statsRes.data);
      } catch {
        setEnrollments([]);
        setStats({
          totalEnrolled: 0,
          completedCourses: 0,
          averageProgress: 0,
          totalLearningTime: 0,
          streak: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    {
      label: 'Enrolled Courses', value: stats?.totalEnrolled || enrollments.length,
      icon: BookOpen, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10',
    },
    {
      label: 'Completed', value: stats?.completedCourses || 0,
      icon: Award, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-500/10',
    },
    {
      label: 'Avg Progress', value: stats?.averageProgress || 0, suffix: '%',
      icon: TrendingUp, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10',
    },
    {
      label: 'Learning Streak', value: stats?.streak || 0, suffix: ' days',
      icon: Flame, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10',
    },
  ];

  return (
    <PageTransition>
      {/* Greeting */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-white/40 mt-1">Continue where you left off</p>
      </motion.div>

      {/* Stats Grid */}
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
                <AnimatedCounter end={s.value} suffix={s.suffix} duration={2} />
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Learning */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
          <Link to="/student/my-courses" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="glass-card text-center py-12">
            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No courses yet</p>
            <Link to="/courses" className="btn-primary mt-4 inline-block">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.slice(0, 6).map((enrollment, idx) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
              >
                <Link to={`/student/learn/${enrollment.course?._id}`} className="block">
                <div className="glass-card !p-0 overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                  {/* Thumbnail */}
                  <div className="relative h-36 bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                    {enrollment.course?.thumbnail ? (
                      <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-white/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-white text-sm line-clamp-1 mb-2">
                      {enrollment.course?.title || 'Untitled Course'}
                    </h3>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-white/40">Progress</span>
                        <span className="text-primary-400 font-medium">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${enrollment.progress || 0}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {enrollment.completedLessons?.length || 0} lessons done
                      </span>
                      <span className="capitalize badge badge-primary text-[10px] !py-0.5">{enrollment.status}</span>
                    </div>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        className="mt-8 grid sm:grid-cols-3 gap-4"
      >
        {[
          { to: '/courses', label: 'Explore Courses', icon: Target, color: 'from-blue-500/10 to-blue-500/5 border-blue-500/10' },
          { to: '/student/progress', label: 'View Progress', icon: BarChart3, color: 'from-purple-500/10 to-purple-500/5 border-purple-500/10' },
          { to: '/chat', label: 'Join Discussion', icon: Star, color: 'from-amber-500/10 to-amber-500/5 border-amber-500/10' },
        ].map((a, idx) => (
          <Link key={idx} to={a.to}>
            <div className={`glass-card bg-gradient-to-br ${a.color} !border hover:!border-white/10 group transition-all duration-300 hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3">
                <a.icon className="w-5 h-5 text-white/50 group-hover:text-white/80 transition" />
                <span className="text-sm text-white/60 group-hover:text-white/90 transition">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </PageTransition>
  );
};

export default StudentDashboard;
