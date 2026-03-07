import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Award, Clock, CheckCircle2, BarChart3 } from 'lucide-react';
import { getMyEnrollments, getStudentStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';

const StudentProgress = () => {
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
        setStats({ totalEnrolled: 0, completedCourses: 0, averageProgress: 0, totalLearningTime: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const completedCount = enrollments.filter(e => e.status === 'completed').length;

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Progress</h1>
        <p className="text-white/40 text-sm mt-1">Track your learning journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Enrolled', value: stats?.totalEnrolled || enrollments.length, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
          { label: 'Completed', value: completedCount, icon: Award, color: 'from-emerald-500 to-green-500' },
          { label: 'Avg Progress', value: stats?.averageProgress || 0, suffix: '%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
          { label: 'Hours Learned', value: stats?.totalLearningTime || 0, icon: Clock, color: 'from-amber-500 to-orange-500' },
        ].map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="glass-card">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter end={s.value} suffix={s.suffix} duration={2} />
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Progress List */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Course Progress</h2>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12 text-white/30">No enrollments yet</div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment, idx) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  {enrollment.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-primary-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">
                    {enrollment.course?.title || 'Untitled Course'}
                  </h3>
                  <p className="text-xs text-white/30 mt-0.5">
                    {enrollment.completedLessons?.length || 0} / {enrollment.course?.totalLessons || 0} lessons completed
                  </p>
                </div>

                <div className="w-full sm:w-32 flex-shrink-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={enrollment.status === 'completed' ? 'text-emerald-400' : 'text-primary-400'}>
                      {enrollment.progress || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollment.progress || 0}%` }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      className={`h-full rounded-full ${
                        enrollment.status === 'completed'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                          : 'bg-gradient-to-r from-primary-500 to-purple-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default StudentProgress;
