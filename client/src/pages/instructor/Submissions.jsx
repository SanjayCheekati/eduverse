import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, CheckCircle2, Clock, User, BookOpen, Star,
  ChevronDown, ChevronUp, MessageSquare, Send
} from 'lucide-react';
import { getInstructorSubmissions, gradeSubmission } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [gradeForm, setGradeForm] = useState({ score: '', maxScore: '100', feedback: '' });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data } = await getInstructorSubmissions();
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId) => {
    const score = Number(gradeForm.score);
    if (!gradeForm.score || isNaN(score) || score < 0 || score > 100) {
      toast.error('Score must be a number between 0 and 100');
      return;
    }
    try {
      await gradeSubmission(submissionId, {
        score,
        feedback: gradeForm.feedback,
      });
      toast.success('Submission graded!');
      setExpandedId(null);
      setGradeForm({ score: '', maxScore: '100', feedback: '' });
      fetchSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grade');
    }
  };

  if (loading) return <Loader />;

  const filtered = submissions.filter((s) => filter === 'all' || s.status === filter);

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Submissions</h1>
          <p className="text-white/40 text-sm mt-1">{submissions.length} total submissions</p>
        </div>

        <div className="flex gap-2">
          {['all', 'submitted', 'graded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition ${
                filter === f ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <ClipboardList className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub, idx) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div className="glass-card hover:border-white/10 transition-all">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    sub.status === 'graded' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    {sub.status === 'graded' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{sub.assignmentTitle || 'Assignment'}</p>
                    <div className="flex items-center gap-3 text-xs text-white/30 mt-0.5">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {sub.student?.name || 'Student'}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {sub.course?.title || 'Course'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge text-[10px] ${
                      sub.status === 'graded' ? 'badge-success' : sub.status === 'submitted' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {sub.status}
                    </span>
                    {sub.grade && (
                      <span className="text-sm font-medium text-white">{sub.grade.score}/{sub.grade.maxScore}</span>
                    )}
                    {expandedId === sub._id ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                  </div>
                </div>

                {/* Expanded */}
                {expandedId === sub._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    <div className="mb-4">
                      <p className="text-xs text-white/30 mb-1">Submission Content:</p>
                      <p className="text-sm text-white/60 bg-white/[0.02] p-3 rounded-lg">{sub.content || 'No content'}</p>
                    </div>

                    {sub.status !== 'graded' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-white/40 mb-1 block">Score</label>
                            <input
                              type="number"
                              value={gradeForm.score}
                              onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                              className="glass-input w-full !py-2 text-sm"
                              placeholder="Score"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-white/40 mb-1 block">Max Score</label>
                            <input
                              type="number"
                              value={gradeForm.maxScore}
                              onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Feedback</label>
                          <textarea
                            value={gradeForm.feedback}
                            onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                            className="glass-input w-full !py-2 text-sm min-h-[80px] resize-y"
                            placeholder="Write feedback..."
                          />
                        </div>
                        <button onClick={() => handleGrade(sub._id)} className="btn-primary flex items-center gap-2 text-sm">
                          <Send className="w-4 h-4" /> Submit Grade
                        </button>
                      </div>
                    )}

                    {sub.status === 'graded' && sub.grade && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                        <p className="text-xs text-emerald-400 mb-1">Grade: {sub.grade.score}/{sub.grade.maxScore}</p>
                        {sub.grade.feedback && (
                          <p className="text-sm text-white/50">{sub.grade.feedback}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default Submissions;
