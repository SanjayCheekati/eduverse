import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, GraduationCap, User, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser, googleAuth } from '../utils/api';
import toast from 'react-hot-toast';
import ParticleField from '../components/ui/ParticleField';
import GlowOrbs from '../components/ui/GlowOrbs';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const roles = [
  { value: 'student', label: 'Student', icon: BookOpen, desc: 'Learn and grow' },
  { value: 'instructor', label: 'Instructor', icon: GraduationCap, desc: 'Teach and inspire' },
];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password, role: form.role });
      login(data.user, data.token);
      toast.success('Account created successfully!');
      const routes = { student: '/student', instructor: '/instructor', admin: '/admin' };
      navigate(routes[data.user.role] || '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      <ParticleField />
      <GlowOrbs />
      <div className="absolute inset-0 bg-dark-900/60" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card !p-8 lg:!p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/40 text-sm mt-2">Join EduVerse and start learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                      form.role === r.value
                        ? 'border-primary-500/40 bg-primary-500/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/40 hover:bg-white/[0.04]'
                    }`}
                  >
                    <r.icon className={`w-5 h-5 ${form.role === r.value ? 'text-primary-400' : ''}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium">{r.label}</p>
                      <p className="text-[10px] opacity-50">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await signInWithPopup(auth, googleProvider);
                    const idToken = await result.user.getIdToken();
                    const { data } = await googleAuth({ credential: idToken, role: form.role });
                    login(data.user, data.token);
                    toast.success('Account created successfully!');
                    const routes = { student: '/student', instructor: '/instructor', admin: '/admin' };
                    navigate(routes[data.user.role] || '/student');
                  } catch (err) {
                    if (err.code !== 'auth/popup-closed-by-user') {
                      toast.error(err.response?.data?.message || 'Google sign-up failed');
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/80 hover:text-white w-full max-w-[320px] justify-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium">Sign up with Google</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="glass-input pl-11 w-full"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="glass-input pl-11 w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="glass-input pl-11 pr-11 w-full"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="glass-input pl-11 w-full"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/30">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
