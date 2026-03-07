import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, PlusCircle, Edit, Trash2, Eye, EyeOff, Star,
  Users, MoreVertical, Search
} from 'lucide-react';
import { getInstructorCourses, deleteCourse, togglePublish } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await getInstructorCourses();
      setCourses(data.courses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      const { data } = await togglePublish(courseId);
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, isPublished: data.course.isPublished } : c))
      );
      toast.success(data.course.isPublished ? 'Course published!' : 'Course unpublished');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <Loader />;

  const filtered = courses.filter((c) => !search || c.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
          <p className="text-white/40 text-sm mt-1">{courses.length} courses total</p>
        </div>
        <Link to="/instructor/create-course" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your courses..."
          className="glass-input pl-10 w-full sm:w-80"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No courses found</p>
          <Link to="/instructor/create-course" className="btn-primary mt-6 inline-block">Create Course</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="glass-card hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <BookOpen className="w-7 h-7 text-primary-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
                      <span className={`badge text-[10px] ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>{course.category}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrollmentCount || 0}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {course.rating?.toFixed(1) || '—'}</span>
                      <span>{course.totalLessons || 0} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default ManageCourses;
