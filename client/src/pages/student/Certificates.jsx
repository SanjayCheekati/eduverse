import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, BookOpen, Calendar, ExternalLink } from 'lucide-react';
import { getMyCertificates } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import Loader from '../../components/ui/Loader';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await getMyCertificates();
        setCertificates(data.certificates || []);
      } catch {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
        <p className="text-white/40 text-sm mt-1">Certificates earned from completed courses</p>
      </div>

      {certificates.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg mb-2">No certificates yet</p>
          <p className="text-white/20 text-sm mb-6">Complete a course to earn your first certificate</p>
          <Link to="/student/my-courses" className="btn-primary inline-block">Go to My Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.enrollmentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="glass-card !p-0 overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 flex items-center justify-center">
                  {cert.thumbnail ? (
                    <img src={cert.thumbnail} alt="" className="w-full h-full object-cover opacity-40" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-500/30 backdrop-blur flex items-center justify-center border border-amber-500/20">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-xs text-amber-400/80 font-medium">{cert.category}</span>
                  <h3 className="font-semibold text-white mt-1 mb-2 line-clamp-2">{cert.courseTitle}</h3>
                  <p className="text-xs text-white/30 mb-1">Instructor: {cert.instructorName}</p>
                  <p className="text-xs text-white/20 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Completed {new Date(cert.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      to={`/student/certificate/${cert.courseId}`}
                      className="btn-primary flex-1 !py-2 text-xs flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </Link>
                    <Link
                      to={`/student/certificate/${cert.courseId}?download=true`}
                      className="btn-ghost flex-1 !py-2 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </Link>
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

export default Certificates;
