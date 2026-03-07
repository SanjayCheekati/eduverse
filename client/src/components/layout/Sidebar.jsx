import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, GraduationCap, BarChart3, MessageSquare,
  Users, ClipboardList, PlusCircle, Settings, FileText, TrendingUp,
  Award, ShieldCheck, Activity, Library, ChevronLeft, ChevronRight,
  Heart, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const menuItems = {
  student: [
    { label: 'Dashboard', to: '/student', icon: LayoutDashboard },
    { label: 'Browse Courses', to: '/courses', icon: BookOpen },
    { label: 'My Courses', to: '/student/my-courses', icon: Library },
    { label: 'My Progress', to: '/student/progress', icon: TrendingUp },
    { label: 'Wishlist', to: '/student/wishlist', icon: Heart },
    { label: 'Cart', to: '/student/cart', icon: ShoppingCart },
    { label: 'Certificates', to: '/student/certificates', icon: Award },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  instructor: [
    { label: 'Dashboard', to: '/instructor', icon: LayoutDashboard },
    { label: 'My Courses', to: '/instructor/courses', icon: BookOpen },
    { label: 'Create Course', to: '/instructor/create-course', icon: PlusCircle },
    { label: 'Submissions', to: '/instructor/submissions', icon: ClipboardList },
    { label: 'Analytics', to: '/instructor/analytics', icon: BarChart3 },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'All Courses', to: '/admin/courses', icon: BookOpen },
    { label: 'Analytics', to: '/admin/analytics', icon: Activity },
    { label: 'Reports', to: '/admin/reports', icon: FileText },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
};

const Sidebar = ({ onCollapseChange }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const items = menuItems[user?.role] || menuItems.student;

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapseChange?.(next);
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-16 lg:top-[72px] bottom-0 glass-sidebar z-40 flex flex-col overflow-hidden"
    >
      {/* Collapse toggle */}
      <button
        onClick={handleCollapse}
        className="absolute -right-0 top-4 w-6 h-6 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-dark-600 transition-all z-10 hidden lg:flex"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to ||
            (item.to !== '/student' && item.to !== '/instructor' && item.to !== '/admin' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative group block"
              end={item.to === '/student' || item.to === '/instructor' || item.to === '/admin'}
            >
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-white bg-gradient-to-r from-primary-500/15 to-purple-500/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
              }`}>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-primary-400 to-purple-500 rounded-r-full"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}

                <div className={`relative flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -inset-1 bg-primary-400/20 rounded-full blur-sm" />
                  )}
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-dark-700 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-white/[0.04]"
        >
          <div className="glass-card !p-3 bg-gradient-to-br from-primary-500/5 to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">{user?.name}</p>
                <p className="text-[10px] text-white/40 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
