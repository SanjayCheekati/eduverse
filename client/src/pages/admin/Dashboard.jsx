import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, TrendingUp, Activity, ShieldCheck,
  ArrowUpRight, UserPlus, Eye
} from 'lucide-react';
import { getAdminStats } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Loader from '../../components/ui/Loader';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler);

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,10,20,0.9)',
      borderColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      cornerRadius: 12,
      padding: 12,
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
  },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch {
        setStats({
          totalUsers: 0, totalCourses: 0, totalEnrollments: 0,
          usersByRole: { student: 0, instructor: 0, admin: 0 },
          monthlyData: [],
          recentUsers: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const months = stats?.monthlyData?.map((d) => d.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const userGrowthData = {
    labels: months,
    datasets: [{
      label: 'Users',
      data: stats?.monthlyData?.map((d) => d.users) || [0, 0, 0, 0, 0, 0],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    }],
  };

  const enrollmentData = {
    labels: months,
    datasets: [{
      label: 'Enrollments',
      data: stats?.monthlyData?.map((d) => d.enrollments) || [0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(139,92,246,0.5)',
      borderColor: '#8b5cf6',
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const roleData = {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [{
      data: [
        stats?.usersByRole?.student || 0,
        stats?.usersByRole?.instructor || 0,
        stats?.usersByRole?.admin || 0,
      ],
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(168,85,247,0.7)', 'rgba(236,72,153,0.7)'],
      borderWidth: 0,
    }],
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Enrollments', value: stats?.totalEnrollments || 0, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-white/40 mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
                <AnimatedCounter end={s.value} prefix={s.prefix} duration={2} />
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-400" /> User Growth
            </h3>
            <div className="h-64">
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Enrollments
            </h3>
            <div className="h-64">
              <Bar data={enrollmentData} options={chartOptions} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Distribution + Recent Users */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pink-400" /> User Roles
            </h3>
            <div className="h-48 flex items-center justify-center">
              <Doughnut data={roleData} options={{ ...chartOptions, scales: undefined, cutout: '65%' }} />
            </div>
            <div className="mt-4 space-y-2">
              {roleData.labels.map((label, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roleData.datasets[0].backgroundColor[idx] }} />
                    <span className="text-white/50">{label}</span>
                  </div>
                  <span className="text-white/60 font-medium">{roleData.datasets[0].data[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="md:col-span-2">
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" /> Recent Users
            </h3>
            <div className="space-y-3">
              {(stats?.recentUsers || []).slice(0, 5).map((u, idx) => (
                <div key={u._id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition">
                  <div className="avatar text-xs w-9 h-9">{u.name?.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    <p className="text-xs text-white/30">{u.email}</p>
                  </div>
                  <span className={`badge text-[10px] ${
                    u.role === 'admin' ? 'badge-danger' : u.role === 'instructor' ? 'badge-purple' : 'badge-primary'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
              {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                <p className="text-center text-white/20 py-8">No recent users</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
