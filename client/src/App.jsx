import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { FullPageLoader } from './components/ui/Loader';
import ErrorBoundary from './components/ErrorBoundary';

import DashboardLayout from './components/layout/DashboardLayout';
import Navbar from './components/layout/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';

import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import StudentProgress from './pages/student/Progress';
import CourseLearning from './pages/student/CourseLearning';
import Certificates from './pages/student/Certificates';
import CertificateView from './pages/student/CertificateView';

import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/ManageCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import ManageQuizzes from './pages/instructor/ManageQuizzes';
import Submissions from './pages/instructor/Submissions';
import InstructorAnalytics from './pages/instructor/Analytics';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const roleRoutes = { student: '/student', instructor: '/instructor', admin: '/admin' };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (user) {
    const roleRoutes = { student: '/student', instructor: '/instructor', admin: '/admin' };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }
  return children;
};

const PublicPageLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-16">{children}</main>
  </>
);

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><PublicPageLayout><Login /></PublicPageLayout></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><PublicPageLayout><Register /></PublicPageLayout></PublicRoute>} />
        <Route path="/courses" element={<PublicPageLayout><CourseCatalog /></PublicPageLayout>} />
        <Route path="/courses/:id" element={<PublicPageLayout><CourseDetail /></PublicPageLayout>} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="certificate/:courseId" element={<CertificateView />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        {/* Student Learning (full-screen, outside dashboard layout) */}
        <Route path="/student/learn/:courseId" element={<ProtectedRoute roles={['student']}><CourseLearning /></ProtectedRoute>} />

        {/* Instructor */}
        <Route path="/instructor" element={<ProtectedRoute roles={['instructor']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<EditCourse />} />
          <Route path="quizzes/:courseId" element={<ManageQuizzes />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminAnalytics />} />
        </Route>

        {/* Shared authenticated routes */}
        <Route path="/chat" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Chat />} />
        </Route>
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 15, 25, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#fff',
                borderRadius: '16px',
                padding: '14px 20px',
                fontSize: '14px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              },
              success: {
                iconTheme: { primary: '#6366f1', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
