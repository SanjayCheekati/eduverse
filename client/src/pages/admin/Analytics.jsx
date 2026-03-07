import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, DollarSign, Users, BookOpen, Activity
} from 'lucide-react';
import { getAdminStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,10,20,0.9)',
      borderColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
  },
};

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch {
        setStats({
          totalUsers: 0, totalCourses: 0, totalEnrollments: 0, totalRevenue: 0,
          monthlyData: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const months = stats?.monthlyData?.map((d) => d.month) || [];

  const revenueData = {
    labels: months,
    datasets: [{
      label: 'Revenue ($)',
      data: stats?.monthlyData?.map((d) => d.revenue) || [],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
    }],
  };

  const userEnrollData = {
    labels: months,
    datasets: [
      {
        label: 'New Users',
        data: stats?.monthlyData?.map((d) => d.users) || [],
        backgroundColor: 'rgba(99,102,241,0.6)',
        borderRadius: 6,
      },
      {
        label: 'Enrollments',
        data: stats?.monthlyData?.map((d) => d.enrollments) || [],
        backgroundColor: 'rgba(168,85,247,0.6)',
        borderRadius: 6,
      },
    ],
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Detailed platform metrics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: stats?.totalRevenue || 0, prefix: '$', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
          { label: 'Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
          { label: 'Enrollments', value: stats?.totalEnrollments || 0, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
        ].map((s, idx) => (
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

      {/* Charts */}
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" /> Revenue Trend
            </h3>
            <div className="h-72">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-400" /> Users vs Enrollments
            </h3>
            <div className="h-72">
              <Bar
                data={userEnrollData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: true, labels: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } } } }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminAnalytics;
