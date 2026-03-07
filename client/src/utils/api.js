import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const googleAuth = (data) => API.post('/auth/google', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/password', data);

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const togglePublish = (id) => API.put(`/courses/${id}/publish`);
export const addModule = (courseId, data) => API.post(`/courses/${courseId}/modules`, data);
export const addLesson = (courseId, moduleId, data) => API.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
export const getInstructorCourses = () => API.get('/courses/instructor/me');

// Enrollments
export const enrollCourse = (courseId) => API.post(`/enrollments/${courseId}`);
export const getMyEnrollments = () => API.get('/enrollments/me');
export const updateProgress = (courseId, data) => API.put(`/enrollments/${courseId}/progress`, data);
export const checkEnrollment = (courseId) => API.get(`/enrollments/${courseId}/check`);
export const getCourseEnrollments = (courseId) => API.get(`/enrollments/course/${courseId}`);
export const getEnrollmentDetail = (courseId) => API.get(`/enrollments/${courseId}/learn`);
export const getCertificate = (courseId) => API.get(`/enrollments/${courseId}/certificate`);
export const getMyCertificates = () => API.get('/enrollments/certificates');

// Upload
export const uploadAvatar = (formData) => API.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadChatFile = (formData) => API.post('/upload/chat', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Submissions
export const createSubmission = (data) => API.post('/submissions', data);
export const getMySubmissions = () => API.get('/submissions/me');
export const getInstructorSubmissions = () => API.get('/submissions/instructor');
export const gradeSubmission = (id, data) => API.put(`/submissions/${id}/grade`, data);

// Payments
export const createCheckoutSession = (courseIds) => API.post('/payments/create-checkout-session', { courseIds });
export const verifyPayment = (sessionId) => API.get(`/payments/verify/${sessionId}`);

// Quizzes
export const getCourseQuizzes = (courseId) => API.get(`/quizzes/course/${courseId}`);
export const createQuiz = (data) => API.post('/quizzes', data);
export const submitQuiz = (quizId, data) => API.post(`/quizzes/${quizId}/submit`, data);
export const getQuizResults = (quizId) => API.get(`/quizzes/${quizId}/results`);

// Users (Admin)
export const getUsers = (params) => API.get('/users', { params });
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });
export const toggleUserActive = (id) => API.put(`/users/${id}/toggle-active`);
export const getAdminStats = () => API.get('/users/admin/stats');
export const getStudentStats = () => API.get('/users/student/stats');
export const getInstructorStats = () => API.get('/users/instructor/stats');

// Notifications
export const getNotifications = () => API.get('/users/notifications');
export const markNotificationRead = (id) => API.put(`/users/notifications/${id}/read`);
export const markAllRead = () => API.put('/users/notifications/read-all');

// Reviews
export const getCourseReviews = (courseId, params) => API.get(`/reviews/course/${courseId}`, { params });
export const createReview = (courseId, data) => API.post(`/reviews/course/${courseId}`, data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const markReviewHelpful = (id) => API.put(`/reviews/${id}/helpful`);

// Wishlist & Cart
export const getWishlist = () => API.get('/shop/wishlist');
export const toggleWishlist = (courseId) => API.post(`/shop/wishlist/${courseId}`);
export const checkWishlist = (courseId) => API.get(`/shop/wishlist/${courseId}/check`);
export const getCart = () => API.get('/shop/cart');
export const addToCart = (courseId) => API.post(`/shop/cart/${courseId}`);
export const removeFromCart = (courseId) => API.delete(`/shop/cart/${courseId}`);

export default API;
