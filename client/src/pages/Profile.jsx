import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, FileText, Camera, Save, Lock, Eye, EyeOff,
  Shield, Globe, Upload, X, CheckCircle2, Image
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, uploadAvatar } from '../utils/api';
import PageTransition from '../components/ui/PageTransition';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await uploadAvatar(formData);
      updateUser(data.user);
      setProfile(prev => ({ ...prev, avatar: data.avatar }));
      toast.success('Profile photo updated!');
      setAvatarPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    setLoading(true);
    try {
      const { data } = await updateProfile({ name: profile.name, phone: profile.phone, bio: profile.bio, avatar: '' });
      updateUser(data.user);
      setProfile(prev => ({ ...prev, avatar: '' }));
      setAvatarPreview(null);
      toast.success('Profile photo removed');
    } catch { toast.error('Failed to remove photo'); }
    finally { setLoading(false); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const { data } = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        avatar: profile.avatar,
      });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  const displayAvatar = avatarPreview || user?.avatar;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="glass-card mb-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center ring-2 ring-white/[0.06]">
                {displayAvatar ? (
                  <img src={displayAvatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white/60">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center rounded-2xl">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-dark-900/0 hover:bg-dark-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              {displayAvatar && !uploading && (
                <button onClick={removeAvatar} className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{user?.name}</h1>
              <p className="text-sm text-white/40 truncate">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="badge badge-primary capitalize text-xs">{user?.role}</span>
                <span className="badge badge-success text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Active
                </span>
              </div>
              <p className="text-xs text-white/20 mt-2">
                Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          {user?.bio && (
            <p className="text-sm text-white/30 mt-4 pt-4 border-t border-white/[0.04] line-clamp-2 italic">"{user.bio}"</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.02] p-1 rounded-xl">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-1 justify-center transition ${tab === t.id ? 'bg-primary-500/10 text-primary-400' : 'text-white/40 hover:text-white/60'}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Photo Upload Section */}
            <div className="glass-card mb-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <Image className="w-4 h-4 text-primary-400" /> Profile Photo
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-2">Upload a photo from your computer. Max 5MB. JPG, PNG, GIF, WebP.</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5 disabled:opacity-50">
                      <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    {displayAvatar && (
                      <button type="button" onClick={removeAvatar} className="btn-ghost !py-1.5 !px-3 text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="glass-card space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="glass-input pl-11 w-full" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type="email" value={profile.email} disabled className="glass-input pl-11 w-full opacity-50 cursor-not-allowed" />
                </div>
                <p className="text-[10px] text-white/20 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="glass-input pl-11 w-full" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-5 h-5 text-white/20" />
                  <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="glass-input pl-11 w-full min-h-[100px] resize-y" placeholder="Tell us about yourself..." maxLength={500} />
                </div>
                <p className="text-[10px] text-white/20 mt-1 text-right">{profile.bio.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Profile Photo URL (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type="url" value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} className="glass-input pl-11 w-full" placeholder="https://example.com/photo.jpg" />
                </div>
                <p className="text-[10px] text-white/20 mt-1">Or paste a URL instead of uploading</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handlePasswordChange} className="glass-card space-y-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-400" /> Change Password
              </h3>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type={showPwd ? 'text' : 'password'} value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="glass-input pl-11 pr-11 w-full" placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="glass-input w-full" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Confirm New Password</label>
                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="glass-input w-full" placeholder="Re-enter new password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Update Password</>}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Profile;
