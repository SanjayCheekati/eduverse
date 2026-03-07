import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  BookOpen, Users, Award, Zap, Play, ArrowRight, Star, ChevronRight,
  Code, Palette, TrendingUp, Globe, Shield, Clock, CheckCircle2,
  Sparkles, GraduationCap, Monitor, Brain, Rocket, Heart
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ParticleField from '../components/ui/ParticleField';
import GlowOrbs from '../components/ui/GlowOrbs';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { getCourses } from '../utils/api';

/* ── Stagger helpers ──────────────────── */
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ── SECTION: Hero ─────────────────────── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Backgrounds */}
      <ParticleField />
      <GlowOrbs />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/30 to-dark-900" />
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">Next-Gen Learning Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          <span className="text-white">Master Skills</span>
          <br />
          <span className="gradient-text">Without Limits</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Join thousands of learners on EduVerse — the most immersive e-learning platform
          with real-time collaboration, expert instructors, and AI-powered progress tracking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary text-base !px-8 !py-4 group">
            Start Learning Free
            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/courses" className="btn-ghost text-base !px-8 !py-4 group">
            <Play className="inline-block mr-2 w-5 h-5" />
            Browse Courses
          </Link>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 flex items-center justify-center gap-8 flex-wrap"
        >
          {[
            { icon: Shield, text: 'Verified Instructors' },
            { icon: Clock, text: 'Lifetime Access' },
            { icon: Award, text: 'Certificates' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-white/30 text-sm">
              <item.icon className="w-4 h-4" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

/* ── SECTION: Stats ────────────────────── */
const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: 15000, label: 'Active Students', suffix: '+', icon: Users, color: 'from-blue-500 to-cyan-400' },
    { value: 500, label: 'Expert Courses', suffix: '+', icon: BookOpen, color: 'from-purple-500 to-pink-400' },
    { value: 98, label: 'Success Rate', suffix: '%', icon: TrendingUp, color: 'from-emerald-500 to-green-400' },
    { value: 50, label: 'Countries', suffix: '+', icon: Globe, color: 'from-orange-500 to-amber-400' },
  ];

  return (
    <section id="stats" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/50 to-dark-900" />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={scaleIn}>
              <div className="glass-card text-center group hover:scale-[1.03] transition-transform duration-500">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {isInView && <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2.5} />}
                </div>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── SECTION: Features ─────────────────── */
const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Monitor, title: 'Interactive Learning', color: 'from-blue-500 to-blue-600',
      desc: 'Engage with interactive video lessons, quizzes, and hands-on coding exercises.',
    },
    {
      icon: Brain, title: 'AI-Powered Insights', color: 'from-purple-500 to-purple-600',
      desc: 'Smart analytics track your learning patterns and suggest personalized paths.',
    },
    {
      icon: Users, title: 'Live Collaboration', color: 'from-emerald-500 to-emerald-600',
      desc: 'Real-time chat, group discussions, and peer-to-peer learning community.',
    },
    {
      icon: Award, title: 'Verified Certificates', color: 'from-amber-500 to-orange-500',
      desc: 'Earn recognized certificates upon course completion to boost your career.',
    },
    {
      icon: Rocket, title: 'Career Acceleration', color: 'from-pink-500 to-rose-500',
      desc: 'Curated career paths with mentorship from industry professionals.',
    },
    {
      icon: Code, title: 'Hands-on Projects', color: 'from-cyan-500 to-teal-500',
      desc: 'Build real-world projects with code reviews and portfolio-ready outcomes.',
    },
  ];

  return (
    <section id="features" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-900" />
      <div className="absolute inset-0 bg-mesh opacity-[0.015]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs text-primary-300 font-medium uppercase tracking-wider">Why EduVerse</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to <span className="gradient-text">Excel</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 max-w-2xl mx-auto text-lg">
            A comprehensive platform designed for modern learners who demand more.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <div className="glass-card group hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── SECTION: Courses Preview ──────────── */
const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n?.toString() || '0';
};

const CoursesPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses({ limit: 6, sort: '-enrollmentCount' })
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => {});
  }, []);

  return (
    <section id="courses" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/30 to-dark-900" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Popular Courses</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Trending <span className="gradient-text">Courses</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 max-w-2xl mx-auto text-lg">
            Explore our most popular courses curated by industry experts.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.map((course, idx) => (
            <motion.div key={course._id || idx} variants={fadeUp}>
              <Link to={`/courses/${course._id}`} className="block">
                <div className="glass-card !p-0 overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-purple-500/20 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><BookOpen className="w-16 h-16 text-white/10" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {course.enrollmentCount >= 50000 && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/90 text-[10px] font-bold text-dark-900">Bestseller</span>
                      )}
                      <span className="badge badge-primary">{course.level}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-xs text-primary-400 font-medium">{course.category}</span>
                    <h3 className="text-base font-semibold text-white mt-1 mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-white/25 mb-2">{course.instructor?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 font-bold text-xs">{course.rating?.average?.toFixed(1) || '—'}</span>
                      </span>
                      <span className="text-xs text-white/20">({formatNumber(course.rating?.count || 0)})</span>
                      <span className="text-xs text-white/20 ml-auto">{formatNumber(course.enrollmentCount)} students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {course.price === 0 ? (
                        <span className="text-lg font-bold text-emerald-400">Free</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-white">${Math.round(course.price * 0.82 * 100) / 100}</span>
                          <span className="text-xs text-white/20 line-through">${course.price}</span>
                        </div>
                      )}
                      <span className="text-sm text-primary-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        View <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="text-center mt-12">
          <Link to="/courses" className="btn-primary !px-8 !py-3 group">
            View All Courses <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ── SECTION: Testimonials ─────────────── */
const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer at Google', avatar: 'S', text: 'EduVerse transformed my career. The interactive courses and real-time mentorship helped me land my dream job.', rating: 5 },
    { name: 'Alex Chen', role: 'UI/UX Designer', avatar: 'A', text: 'The design courses are top-notch. Beautiful UI, smooth experience, and the certificate boosted my portfolio.', rating: 5 },
    { name: 'Maria Santos', role: 'Data Scientist', avatar: 'M', text: 'Best learning platform I have used. The AI-powered progress tracking kept me motivated throughout.', rating: 5 },
  ];

  return (
    <section id="testimonials" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-900" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium uppercase tracking-wider">Loved by Learners</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-5xl font-bold text-white mb-6">
            What Our <span className="gradient-text">Students Say</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <div className="glass-card h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="avatar text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── SECTION: CTA ──────────────────────── */
const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-primary-900/10 to-dark-900" />
      <div className="absolute inset-0 bg-mesh opacity-[0.02]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
      >
        <div className="glass-card !p-12 lg:!p-16 bg-gradient-to-br from-primary-500/5 to-purple-500/5 !border-primary-500/10">
          <GraduationCap className="w-14 h-14 text-primary-400 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your <span className="gradient-text">Journey?</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
            Join 15,000+ learners and start building your future today.
            Your first course is completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base !px-10 !py-4 group">
              Create Free Account
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ── SECTION: Footer ───────────────────── */
const Footer = () => (
  <footer className="relative border-t border-white/[0.04] py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">EduVerse</span>
          </div>
          <p className="text-sm text-white/30 leading-relaxed">
            The next generation e-learning platform for modern learners.
          </p>
        </div>
        {[
          { title: 'Platform', links: ['Courses', 'Instructors', 'Pricing', 'Enterprise'] },
          { title: 'Resources', links: ['Blog', 'Documentation', 'Community', 'Support'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
        ].map((col, idx) => (
          <div key={idx}>
            <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-white/30 hover:text-white/60 transition cursor-pointer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/[0.04] text-center text-sm text-white/20">
        © {new Date().getFullYear()} EduVerse. All rights reserved.
      </div>
    </div>
  </footer>
);

/* ── LANDING PAGE ──────────────────────── */
const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <CoursesPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
