import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Award } from 'lucide-react';
import { getCertificate } from '../../utils/api';
import toast from 'react-hot-toast';

const CertificateView = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef(null);
  const certDataRef = useRef(null);

  const handleDownload = useCallback(() => {
    const certData = certDataRef.current;
    if (!certData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups for certificate download');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certData.courseTitle || 'EduVerse'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: landscape; margin: 0; }
          body { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          .cert-wrapper { width: 1100px; height: 780px; position: relative; font-family: 'Georgia', 'Times New Roman', serif; }
          .cert-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0f0f19, #1a1a2e); border: 3px solid #c9a84c; }
          .cert-inner { position: absolute; inset: 16px; border: 1px solid rgba(201,168,76,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
          .corner { position: absolute; width: 60px; height: 60px; border-color: #c9a84c; }
          .corner-tl { top: 30px; left: 30px; border-top: 2px solid; border-left: 2px solid; }
          .corner-tr { top: 30px; right: 30px; border-top: 2px solid; border-right: 2px solid; }
          .corner-bl { bottom: 30px; left: 30px; border-bottom: 2px solid; border-left: 2px solid; }
          .corner-br { bottom: 30px; right: 30px; border-bottom: 2px solid; border-right: 2px solid; }
          .logo { font-size: 18px; letter-spacing: 8px; color: #c9a84c; text-transform: uppercase; margin-bottom: 20px; }
          .title { font-size: 42px; color: #c9a84c; margin-bottom: 10px; font-weight: 400; }
          .subtitle { font-size: 14px; color: rgba(255,255,255,0.5); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 30px; }
          .name { font-size: 36px; color: #ffffff; font-style: italic; border-bottom: 1px solid rgba(201,168,76,0.4); padding-bottom: 8px; margin-bottom: 20px; min-width: 400px; }
          .course-label { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
          .course-name { font-size: 20px; color: #ffffff; margin-bottom: 30px; max-width: 600px; }
          .details { display: flex; gap: 60px; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
          .detail-item span { display: block; color: rgba(255,255,255,0.7); margin-top: 4px; }
          .cert-id { font-size: 10px; color: rgba(255,255,255,0.2); position: absolute; bottom: 24px; right: 40px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="cert-wrapper">
          <div class="cert-bg"></div>
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          <div class="cert-inner">
            <div class="logo">EduVerse</div>
            <div class="title">Certificate of Completion</div>
            <div class="subtitle">This is to certify that</div>
            <div class="name">${certData.studentName || ''}</div>
            <div class="course-label">has successfully completed the course</div>
            <div class="course-name">${certData.courseTitle || ''}</div>
            <div class="details">
              <div class="detail-item">Instructor<span>${certData.instructorName || ''}</span></div>
              <div class="detail-item">Category<span>${certData.category || ''}</span></div>
              <div class="detail-item">Completed<span>${certData.completedAt ? new Date(certData.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span></div>
              <div class="detail-item">Lessons<span>${certData.totalLessons || 0}</span></div>
            </div>
          </div>
          <div class="cert-id">Certificate ID: ${certData.enrollmentId || ''}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  }, []);

  useEffect(() => {
    const loadCert = async () => {
      try {
        const { data } = await getCertificate(courseId);
        setCert(data.certificate);
        certDataRef.current = data.certificate;
        if (searchParams.get('download') === 'true') {
          setTimeout(() => handleDownload(), 800);
        }
      } catch {
        toast.error('Certificate not available');
      } finally {
        setLoading(false);
      }
    };
    loadCert();
  }, [courseId, searchParams, handleDownload]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="text-center py-20">
        <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
        <p className="text-white/40 text-lg mb-2">Certificate not available</p>
        <p className="text-white/20 text-sm mb-6">Complete all lessons to earn your certificate.</p>
        <Link to="/student/my-courses" className="btn-primary inline-block">Go to My Courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/student/certificates" className="flex items-center gap-2 text-white/40 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
            className="btn-ghost !py-2 !px-3 text-sm flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary !py-2 !px-4 text-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate Preview */}
      <motion.div
        ref={certRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full aspect-[1.414/1] max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        style={{ background: 'linear-gradient(135deg, #0f0f19, #1a1a2e)' }}
      >
        {/* Border */}
        <div className="absolute inset-0 border-[3px] border-amber-600/60 rounded-2xl" />
        <div className="absolute inset-4 border border-amber-600/20 rounded-xl" />

        {/* Corner decorations */}
        {[
          'top-7 left-7 border-t-2 border-l-2',
          'top-7 right-7 border-t-2 border-r-2',
          'bottom-7 left-7 border-b-2 border-l-2',
          'bottom-7 right-7 border-b-2 border-r-2',
        ].map((pos, i) => (
          <div key={i} className={`absolute w-14 h-14 border-amber-600/50 ${pos}`} />
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-16 text-center">
          <p className="text-amber-500/80 text-xs lg:text-sm tracking-[0.5em] uppercase mb-4 lg:mb-6 font-medium">EduVerse</p>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-amber-500 mb-2 lg:mb-3">
            Certificate of Completion
          </h1>

          <p className="text-white/40 text-xs lg:text-sm tracking-widest uppercase mb-6 lg:mb-10">This is to certify that</p>

          <p className="text-xl sm:text-2xl lg:text-4xl text-white font-serif italic border-b border-amber-600/30 pb-2 mb-5 lg:mb-8 min-w-[50%]">
            {cert.studentName}
          </p>

          <p className="text-white/30 text-xs lg:text-sm mb-2">has successfully completed the course</p>

          <p className="text-base sm:text-lg lg:text-2xl text-white font-medium mb-6 lg:mb-10 max-w-[70%]">
            {cert.courseTitle}
          </p>

          <div className="flex items-center gap-6 lg:gap-16 text-[10px] lg:text-xs text-white/30">
            <div>
              <p>Instructor</p>
              <p className="text-white/60 mt-1">{cert.instructorName}</p>
            </div>
            <div>
              <p>Category</p>
              <p className="text-white/60 mt-1">{cert.category}</p>
            </div>
            <div>
              <p>Completed</p>
              <p className="text-white/60 mt-1">
                {new Date(cert.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p>Lessons</p>
              <p className="text-white/60 mt-1">{cert.totalLessons}</p>
            </div>
          </div>
        </div>

        <p className="absolute bottom-4 right-6 text-[9px] text-white/10">
          Certificate ID: {cert.enrollmentId}
        </p>
      </motion.div>
    </div>
  );
};

export default CertificateView;
