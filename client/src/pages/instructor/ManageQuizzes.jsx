import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlusCircle, Trash2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { getCourse, createQuiz, getCourseQuizzes } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';

const emptyQuestion = () => ({ question: '', options: ['', ''], correctAnswer: 0, explanation: '' });

const ManageQuizzes = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: 0,
    questions: [emptyQuestion()],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, quizRes] = await Promise.all([
          getCourse(courseId),
          getCourseQuizzes(courseId),
        ]);
        setCourse(courseRes.data.course || courseRes.data);
        setQuizzes(quizRes.data.quizzes || []);
      } catch {
        toast.error('Failed to load course');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, navigate]);

  const updateQuestion = (qi, field, value) => {
    setForm(prev => {
      const questions = [...prev.questions];
      questions[qi] = { ...questions[qi], [field]: value };
      return { ...prev, questions };
    });
  };

  const updateOption = (qi, oi, value) => {
    setForm(prev => {
      const questions = [...prev.questions];
      const options = [...questions[qi].options];
      options[oi] = value;
      questions[qi] = { ...questions[qi], options };
      return { ...prev, questions };
    });
  };

  const addOption = (qi) => {
    setForm(prev => {
      const questions = [...prev.questions];
      questions[qi] = { ...questions[qi], options: [...questions[qi].options, ''] };
      return { ...prev, questions };
    });
  };

  const removeOption = (qi, oi) => {
    setForm(prev => {
      const questions = [...prev.questions];
      const options = questions[qi].options.filter((_, i) => i !== oi);
      let correctAnswer = questions[qi].correctAnswer;
      if (correctAnswer >= options.length) correctAnswer = 0;
      if (correctAnswer === oi) correctAnswer = 0;
      questions[qi] = { ...questions[qi], options, correctAnswer };
      return { ...prev, questions };
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.question.trim()) { toast.error(`Question ${i + 1} text is required`); return; }
      if (q.options.some(o => !o.trim())) { toast.error(`All options in Q${i + 1} must be filled`); return; }
    }
    setSaving(true);
    try {
      const { data } = await createQuiz({ courseId, ...form });
      setQuizzes(prev => [...prev, data.quiz]);
      setForm({ title: '', description: '', passingScore: 70, timeLimit: 0, questions: [emptyQuestion()] });
      setShowForm(false);
      toast.success('Quiz created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-xl font-bold text-white mb-1">Manage Quizzes</h1>
        <p className="text-sm text-white/40 mb-6">{course?.title}</p>

        {/* Existing quizzes */}
        {quizzes.length > 0 && (
          <div className="space-y-3 mb-6">
            {quizzes.map(q => (
              <div key={q._id} className="glass-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{q.title}</p>
                  <p className="text-xs text-white/30">{q.questions?.length || '?'} questions · Pass: {q.passingScore}%</p>
                </div>
                <span className="text-[10px] bg-primary-500/10 text-primary-400 px-2 py-1 rounded-full">Active</span>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusCircle className="w-4 h-4" /> Create Quiz
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-4">
            <h2 className="text-sm font-semibold text-white">New Quiz</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="glass-input w-full" placeholder="e.g. Module 1 Quiz" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="glass-input w-full" placeholder="Optional" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Passing Score (%)</label>
                <input type="number" min={0} max={100} value={form.passingScore} onChange={e => setForm(p => ({ ...p, passingScore: +e.target.value }))} className="glass-input w-full" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Time Limit (min, 0 = none)</label>
                <input type="number" min={0} value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: +e.target.value }))} className="glass-input w-full" />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {form.questions.map((q, qi) => (
                <div key={qi} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-primary-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Question {qi + 1}
                    </p>
                    {form.questions.length > 1 && (
                      <button
                        onClick={() => setForm(p => ({ ...p, questions: p.questions.filter((_, i) => i !== qi) }))}
                        className="text-red-400/50 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} className="glass-input w-full" placeholder="Question text..." />

                  <div className="space-y-2">
                    <p className="text-[10px] text-white/30">Options (click check to mark correct)</p>
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            q.correctAnswer === oi ? 'border-emerald-400 bg-emerald-400/20' : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          {q.correctAnswer === oi && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </button>
                        <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} className="glass-input flex-1" placeholder={`Option ${oi + 1}`} />
                        {q.options.length > 2 && (
                          <button onClick={() => removeOption(qi, oi)} className="text-white/20 hover:text-red-400 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addOption(qi)} className="text-xs text-primary-400/60 hover:text-primary-400 transition">+ Add option</button>
                  </div>

                  <input value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} className="glass-input w-full" placeholder="Explanation (shown after quiz)" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setForm(p => ({ ...p, questions: [...p.questions, emptyQuestion()] }))}
              className="text-xs text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Question
            </button>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Create Quiz'}
              </button>
              <button onClick={() => setShowForm(false)} className="text-sm text-white/30 hover:text-white/60 transition">Cancel</button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default ManageQuizzes;
