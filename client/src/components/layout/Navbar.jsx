import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, LogOut, User, Settings, ChevronDown,
  BookOpen, GraduationCap, LayoutDashboard, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAllRead, markNotificationRead } from '../../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications().then(({ data }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }).catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const routes = { student: '/student', instructor: '/instructor', admin: '/admin' };
    return routes[user.role] || '/student';
  };

  const isLanding = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isLanding
            ? 'glass-nav shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Edu</span>
                <span className="gradient-text">Verse</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {isLanding && (
                <>
                  <NavLink href="#features">Features</NavLink>
                  <NavLink href="#courses">Courses</NavLink>
                  <NavLink href="#stats">Stats</NavLink>
                  <NavLink href="#testimonials">Reviews</NavLink>
                </>
              )}
              {user && (
                <>
                  <NavLink to={getDashboardLink()} icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</NavLink>
                  <NavLink to="/courses" icon={<BookOpen className="w-4 h-4" />}>Courses</NavLink>
                  <NavLink to="/chat" icon={<MessageSquare className="w-4 h-4" />}>Chat</NavLink>
                </>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Notifications */}
                  <div ref={notifRef} className="relative">
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-red-500/30">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-80 glass-card p-0 overflow-hidden shadow-2xl z-50"
                        >
                          <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <button onClick={handleMarkAllRead} className="text-xs text-primary-400 hover:text-primary-300 transition">
                                Mark all read
                              </button>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-white/30 text-sm">
                                No notifications yet
                              </div>
                            ) : (
                              notifications.slice(0, 5).map((n) => (
                                <div
                                  key={n._id}
                                  onClick={() => {
                                    if (!n.isRead) {
                                      markNotificationRead(n._id);
                                      setNotifications(prev => prev.map(notif => notif._id === n._id ? { ...notif, isRead: true } : notif));
                                    }
                                    if (n.link) {
                                      navigate(n.link);
                                      setNotifOpen(false);
                                    }
                                  }}
                                  className={`p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition cursor-pointer ${!n.isRead ? 'bg-primary-500/[0.03]' : ''}`}
                                >
                                  <p className="text-sm text-white/80">{n.title}</p>
                                  <p className="text-xs text-white/40 mt-1">{n.message}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile */}
                  <div ref={profileRef} className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="avatar text-xs">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-white/90 leading-tight">{user.name}</p>
                        <p className="text-[11px] text-white/40 capitalize">{user.role}</p>
                      </div>
                      <ChevronDown className={`hidden md:block w-4 h-4 text-white/40 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-2xl z-50"
                        >
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all" onClick={() => setProfileOpen(false)}>
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all" onClick={() => setProfileOpen(false)}>
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <div className="my-1 border-t border-white/5" />
                          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all w-full">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="btn-ghost text-sm hidden sm:block">Log In</Link>
                  <Link to="/register" className="btn-primary text-sm !py-2.5 !px-6">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 right-0 w-72 z-[60] glass-sidebar p-6 pt-20 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <MobileLink to={getDashboardLink()} icon={<LayoutDashboard className="w-5 h-5" />} onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                  <MobileLink to="/courses" icon={<BookOpen className="w-5 h-5" />} onClick={() => setMobileOpen(false)}>Courses</MobileLink>
                  <MobileLink to="/chat" icon={<MessageSquare className="w-5 h-5" />} onClick={() => setMobileOpen(false)}>Chat</MobileLink>
                  <MobileLink to="/profile" icon={<User className="w-5 h-5" />} onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/5 transition w-full">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link to="/register" className="btn-primary w-full text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ children, to, href, icon }) => {
  if (href) {
    return (
      <a href={href} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300">
        {icon}{children}
      </a>
    );
  }
  return (
    <Link to={to} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300">
      {icon}{children}
    </Link>
  );
};

const MobileLink = ({ children, to, icon, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">
    {icon}{children}
  </Link>
);

export default Navbar;
