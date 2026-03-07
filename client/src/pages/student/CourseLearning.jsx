import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Play, CheckCircle2,
  Clock, BookOpen, Award, Lock, FileText, Download, ExternalLink,
  Menu, X, BarChart3
} from 'lucide-react';
import { getEnrollmentDetail, updateProgress } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CourseLearning = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [expandedModules, setExpandedModules] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completing, setCompleting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getEnrollmentDetail(courseId);
        setCourse(data.course);
        setEnrollment(data.enrollment);

        // Auto-expand all modules
        const exp = {};
        data.course.modules.forEach((_, i) => { exp[i] = true; });
        setExpandedModules(exp);

        // Resume from last incomplete lesson
        const completed = new Set(
          (data.enrollment.completedLessons || []).map(l => l.lessonId.toString())
        );
        let found = false;
        for (let mi = 0; mi < data.course.modules.length; mi++) {
          for (let li = 0; li < data.course.modules[mi].lessons.length; li++) {
            if (!completed.has(data.course.modules[mi].lessons[li]._id.toString())) {
              setCurrentModuleIdx(mi);
              setCurrentLessonIdx(li);
              found = true;
              break;
            }
          }
          if (found) break;
        }
      } catch {
        toast.error('Could not load course');
        navigate('/student/my-courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, navigate]);

  if (loading || !course || !enrollment) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="w-10 h-10 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const completedSet = new Set(
    (enrollment.completedLessons || []).map(l => l.lessonId.toString())
  );

  const currentModule = course.modules[currentModuleIdx];
  const currentLesson = currentModule?.lessons[currentLessonIdx];
  const isCurrentCompleted = currentLesson && completedSet.has(currentLesson._id.toString());

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = completedSet.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const selectLesson = (mi, li) => {
    setCurrentModuleIdx(mi);
    setCurrentLessonIdx(li);
    if (window.innerWidth < 1024) setSidebarOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = async () => {
    if (isCurrentCompleted || completing) return;
    setCompleting(true);
    try {
      const { data } = await updateProgress(courseId, {
        moduleId: currentModule._id,
        lessonId: currentLesson._id,
      });
      setEnrollment(data.enrollment);

      if (data.enrollment.status === 'completed') {
        toast.success('🎉 Course completed! Certificate earned!', { duration: 5000 });
      } else {
        toast.success('Lesson completed!');
        // Auto-advance to next lesson
        goNext();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    } finally {
      setCompleting(false);
    }
  };

  // Find flat index and navigate
  const flatLessons = [];
  course.modules.forEach((mod, mi) => {
    mod.lessons.forEach((les, li) => {
      flatLessons.push({ mi, li, lesson: les });
    });
  });
  const currentFlatIdx = flatLessons.findIndex(
    f => f.mi === currentModuleIdx && f.li === currentLessonIdx
  );

  const goPrev = () => {
    if (currentFlatIdx > 0) {
      const prev = flatLessons[currentFlatIdx - 1];
      selectLesson(prev.mi, prev.li);
    }
  };
  const goNext = () => {
    if (currentFlatIdx < flatLessons.length - 1) {
      const next = flatLessons[currentFlatIdx + 1];
      selectLesson(next.mi, next.li);
    }
  };

  const formatDuration = (min) => {
    if (!min) return '0min';
    if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
    return `${min}min`;
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col z-50">
      {/* Top Bar */}
      <header className="h-14 bg-dark-800/90 backdrop-blur border-b border-white/[0.06] flex items-center px-4 gap-3 flex-shrink-0">
        <Link to="/student/my-courses" className="text-white/40 hover:text-white transition p-1">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-white truncate">{course.title}</h1>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> {progressPercent}%</span>
          <span>{completedCount}/{totalLessons} lessons</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Content */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 lg:w-[340px] flex-shrink-0 bg-dark-800/50 border-r border-white/[0.04] flex flex-col overflow-hidden absolute lg:relative z-10 h-full"
            >
              {/* Progress */}
              <div className="p-4 border-b border-white/[0.04]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-white/50">Course Progress</span>
                  <span className="text-primary-400 font-semibold">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      progressPercent >= 100
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                        : 'bg-gradient-to-r from-primary-500 to-purple-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-white/20 mt-1.5">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>

              {/* Modules */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {course.modules.map((mod, mi) => {
                  const modCompleted = mod.lessons.filter(l => completedSet.has(l._id.toString())).length;
                  const isExpanded = expandedModules[mi];

                  return (
                    <div key={mod._id} className="border-b border-white/[0.03]">
                      <button
                        onClick={() => setExpandedModules(prev => ({ ...prev, [mi]: !prev[mi] }))}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/70 truncate">
                            Section {mi + 1}: {mod.title}
                          </p>
                          <p className="text-[10px] text-white/25 mt-0.5">
                            {modCompleted}/{mod.lessons.length} lessons
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {mod.lessons.map((lesson, li) => {
                              const isCompleted = completedSet.has(lesson._id.toString());
                              const isCurrent = mi === currentModuleIdx && li === currentLessonIdx;

                              return (
                                <button
                                  key={lesson._id}
                                  onClick={() => selectLesson(mi, li)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                                    isCurrent
                                      ? 'bg-primary-500/10 border-l-2 border-primary-500'
                                      : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                                  }`}
                                >
                                  <div className="flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : isCurrent ? (
                                      <Play className="w-4 h-4 text-primary-400" />
                                    ) : (
                                      <div className="w-4 h-4 rounded-full border border-white/10" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs truncate ${
                                      isCurrent ? 'text-primary-300 font-medium' : isCompleted ? 'text-white/40' : 'text-white/60'
                                    }`}>
                                      {lesson.title}
                                    </p>
                                    <p className="text-[10px] text-white/20 flex items-center gap-1 mt-0.5">
                                      <Clock className="w-2.5 h-2.5" /> {formatDuration(lesson.duration)}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Certificate CTA */}
              {progressPercent >= 100 && (
                <div className="p-4 border-t border-white/[0.04]">
                  <Link
                    to={`/student/certificate/${courseId}`}
                    className="btn-primary w-full !py-2.5 text-sm flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" /> View Certificate
                  </Link>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto">
              {/* Video / Content Area */}
              <div className="aspect-video bg-dark-800 flex items-center justify-center relative">
                {currentLesson.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Text Lesson</h3>
                    <p className="text-sm text-white/40 max-w-md">
                      Read through the lesson content below and mark as complete when finished.
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs text-primary-400 font-medium mb-1">
                      Section {currentModuleIdx + 1} — Lesson {currentLessonIdx + 1}
                    </p>
                    <h2 className="text-xl lg:text-2xl font-bold text-white">
                      {currentLesson.title}
                    </h2>
                    <p className="text-sm text-white/30 mt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {formatDuration(currentLesson.duration)}
                    </p>
                  </div>

                  <button
                    onClick={handleMarkComplete}
                    disabled={isCurrentCompleted || completing}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isCurrentCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    }`}
                  >
                    {completing ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : isCurrentCompleted ? (
                      <><CheckCircle2 className="w-4 h-4" /> Completed</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Mark Complete</>
                    )}
                  </button>
                </div>

                {/* Lesson Description */}
                {currentLesson.description && (
                  <div className="glass-card mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">About this lesson</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{currentLesson.description}</p>
                  </div>
                )}

                {/* Resources */}
                {currentLesson.resources?.length > 0 && (
                  <div className="glass-card mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary-400" /> Resources
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition group"
                        >
                          <FileText className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-white/60 group-hover:text-white/80 flex-1">{res.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/20" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                  <button
                    onClick={goPrev}
                    disabled={currentFlatIdx === 0}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Lesson
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentFlatIdx === flatLessons.length - 1}
                    className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 disabled:opacity-20 disabled:cursor-not-allowed transition"
                  >
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              <p>Select a lesson to begin</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseLearning;
