import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, ClipboardList } from 'lucide-react';
import { getInstructorStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';

const InstructorAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getInstructorStats();
        setStats(data.stats);
      } catch {
        setStats({ totalCourses: 0, publishedCourses: 0, totalStudents: 0, pendingSubmissions: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { label: 'Published', value: stats?.publishedCourses || 0, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Pending Reviews', value: stats?.pendingSubmissions || 0, icon: ClipboardList, color: 'from-red-500 to-rose-500' },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Instructor <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Your teaching performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="glass-card group hover:scale-[1.02] transition-transform">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter end={s.value} prefix={s.prefix} duration={2} />
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
};

export default InstructorAnalytics;
