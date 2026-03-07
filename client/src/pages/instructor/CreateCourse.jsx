import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Save,
  FileText, DollarSign, Tag, BarChart3, List, Image
} from 'lucide-react';
import { createCourse, addModule, addLesson } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';

const categories = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'DevOps',
  'Blockchain', 'Game Development', 'Other',
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    tags: '',
    requirements: [''],
    whatYouWillLearn: [''],
    modules: [{ title: '', lessons: [{ title: '', videoUrl: '', duration: '' }] }],
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addArrayItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, idx) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  const updateArrayItem = (field, idx, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const addModuleItem = () => {
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: '', lessons: [{ title: '', videoUrl: '', duration: '' }] }],
    }));
  };

  const removeModule = (idx) => {
    setForm((prev) => ({ ...prev, modules: prev.modules.filter((_, i) => i !== idx) }));
  };

  const updateModuleTitle = (idx, title) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) => (i === idx ? { ...m, title } : m)),
    }));
  };

  const addLessonItem = (moduleIdx) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === moduleIdx ? { ...m, lessons: [...m.lessons, { title: '', videoUrl: '', duration: '' }] } : m
      ),
    }));
  };

  const removeLesson = (moduleIdx, lessonIdx) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === moduleIdx ? { ...m, lessons: m.lessons.filter((_, j) => j !== lessonIdx) } : m
      ),
    }));
  };

  const updateLesson = (moduleIdx, lessonIdx, field, value) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === moduleIdx
          ? { ...m, lessons: m.lessons.map((l, j) => (j === lessonIdx ? { ...l, [field]: value } : l)) }
          : m
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    setLoading(true);
    try {
      const courseData = {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        category: form.category,
        level: form.level,
        price: Number(form.price),
        thumbnail: form.thumbnail,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        whatYouWillLearn: form.whatYouWillLearn.filter(Boolean),
      };

      const { data } = await createCourse(courseData);
      const courseId = data.course._id;

      for (const mod of form.modules) {
        if (!mod.title) continue;
        const { data: modData } = await addModule(courseId, { title: mod.title });
        const moduleId = modData.course.modules[modData.course.modules.length - 1]._id;

        for (const lesson of mod.lessons) {
          if (!lesson.title) continue;
          await addLesson(courseId, moduleId, {
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            duration: Number(lesson.duration) || 0,
          });
        }
      }

      toast.success('Course created successfully!');
      navigate('/instructor/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Course</h1>
          <p className="text-white/40 text-sm mt-1">Fill in the details to create your course</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {s}
              </button>
              <span className={`text-xs hidden sm:block ${step >= s ? 'text-white/60' : 'text-white/20'}`}>
                {['Basic Info', 'Details', 'Curriculum'][s - 1]}
              </span>
              {s < 3 && <div className={`flex-1 h-px ${step > s ? 'bg-primary-500' : 'bg-white/5'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Course Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="glass-input w-full"
                placeholder="e.g., Complete React Developer Course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Short Description</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                className="glass-input w-full"
                placeholder="Brief summary for course cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="glass-input w-full min-h-[120px] resize-y"
                placeholder="Detailed course description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="glass-input w-full">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Level</label>
                <select value={form.level} onChange={(e) => updateField('level', e.target.value)} className="glass-input w-full">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={form.thumbnail}
                  onChange={(e) => updateField('thumbnail', e.target.value)}
                  className="glass-input w-full"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                className="glass-input w-full"
                placeholder="react, javascript, frontend"
              />
            </div>

            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="btn-primary">Next: Details</button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-3">What You'll Learn</label>
              {form.whatYouWillLearn.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('whatYouWillLearn', idx, e.target.value)}
                    className="glass-input flex-1"
                    placeholder="Learning outcome..."
                  />
                  <button onClick={() => removeArrayItem('whatYouWillLearn', idx)} className="p-2 text-white/20 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayItem('whatYouWillLearn')} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-2 transition">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-3">Requirements</label>
              {form.requirements.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('requirements', idx, e.target.value)}
                    className="glass-input flex-1"
                    placeholder="Prerequisite..."
                  />
                  <button onClick={() => removeArrayItem('requirements', idx)} className="p-2 text-white/20 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayItem('requirements')} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-2 transition">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary">Next: Curriculum</button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Curriculum */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {form.modules.map((module, mIdx) => (
              <div key={mIdx} className="glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center text-xs text-primary-400 font-bold">
                    {mIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                    className="glass-input flex-1"
                    placeholder="Module title..."
                  />
                  <button onClick={() => removeModule(mIdx)} className="p-2 text-white/20 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="ml-10 space-y-2">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                      <span className="text-xs text-white/20 w-5">{lIdx + 1}.</span>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                        className="glass-input flex-1 !py-1.5 text-sm"
                        placeholder="Lesson title..."
                      />
                      <input
                        type="text"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(mIdx, lIdx, 'videoUrl', e.target.value)}
                        className="glass-input w-40 !py-1.5 text-sm"
                        placeholder="Video URL"
                      />
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(mIdx, lIdx, 'duration', e.target.value)}
                        className="glass-input w-20 !py-1.5 text-sm"
                        placeholder="Min"
                      />
                      <button onClick={() => removeLesson(mIdx, lIdx)} className="p-1 text-white/20 hover:text-red-400 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addLessonItem(mIdx)} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-2 transition">
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addModuleItem} className="btn-secondary w-full flex items-center justify-center gap-2 !py-3">
              <Plus className="w-4 h-4" /> Add Module
            </button>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default CreateCourse;
