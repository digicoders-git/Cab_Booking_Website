import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaEnvelope, FaPhoneAlt, FaCamera, FaKey,
  FaSignOutAlt, FaTaxi, FaEdit, FaCheck, FaTimes,
  FaShieldAlt, FaCalendarAlt
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Register from './Register';

const BASE_URL = API_BASE_URL.replace('/api', '');

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = storedUser?._id || localStorage.getItem('userId');

  const fetchProfile = async () => {
    if (!userId || !token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setForm({ name: data.user.name, email: data.user.email });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${API_BASE_URL}/users/update-profile/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        setImageFile(null);
        setImagePreview(null);
        localStorage.setItem('user', JSON.stringify(data.user));
        Swal.fire({ icon: 'success', title: 'Profile Updated!', background: '#111', color: '#fff', confirmButtonColor: '#f5c518', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: data.message, background: '#111', color: '#fff' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Server Error', background: '#111', color: '#fff' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#111',
      background: '#0d0d0d',
      color: '#fff',
      customClass: {
        popup: 'rounded-3xl border border-white/10 shadow-2xl',
        title: 'font-black uppercase tracking-widest text-white text-lg',
        htmlContainer: 'text-white/40 text-sm',
        confirmButton: 'font-black uppercase tracking-widest text-sm rounded-2xl px-8 py-3',
        cancelButton: 'font-black uppercase tracking-widest text-sm rounded-2xl px-8 py-3 border border-white/10',
      }
    }).then(r => {
      if (r.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setImageFile(null);
    setImagePreview(null);
    if (user) setForm({ name: user.name, email: user.email });
  };

  const avatarSrc = imagePreview
    ? imagePreview
    : user?.image
      ? `${BASE_URL}/uploads/${user.image}`
      : null;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  if (loading) return (
    <div className="bg-[#060606] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <FaUser className="text-primary text-5xl mx-auto animate-pulse" />
        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Loading Profile...</p>
      </div>
    </div>
  );

  if (!token || !userId) {
    return <Register />;
  }

  return (
    <div className="bg-[#060606] min-h-screen text-white pb-24">
      <PageHeader title="My Profile" breadcrumb="My Profile" />

      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Card ── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              {/* Top glow strip */}
              <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

              <div className="p-8 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-28 h-28 rounded-[1.5rem] overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/10 bg-white/5">
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white/20"><FaUser size={40} /></div>
                    }
                  </div>
                  {editMode && (
                    <button
                      onClick={() => fileRef.current.click()}
                      className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary text-black rounded-xl flex items-center justify-center hover:bg-yellow-400 transition-all shadow-lg"
                    >
                      <FaCamera size={13} />
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <h3 className="text-white font-black text-xl uppercase tracking-tight mb-1">{user?.name || '—'}</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.25em] mb-1">{user?.email}</p>

                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mt-2">
                  <HiSparkles /> Verified Member
                </div>

                {/* Stats */}
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <FaTaxi className="text-primary text-xs" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Member Since</span>
                    </div>
                    <span className="text-white font-black text-xs">{joinedDate}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <FaShieldAlt className="text-primary text-xs" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status</span>
                    </div>
                    <span className={`text-xs font-black uppercase ${user?.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-8 bg-red-500/10 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 text-[11px] uppercase tracking-widest"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── Right Panel ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                {/* Header row */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">Account Details</h4>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">Personal Information</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                    >
                      <FaEdit size={11} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                      >
                        <FaTimes size={10} /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-50"
                      >
                        <FaCheck size={10} /> {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block">Full Name</label>
                    <div className={`flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border transition-all ${editMode ? 'border-primary/40' : 'border-white/5'}`}>
                      <FaUser className="text-primary text-xs shrink-0" />
                      {editMode
                        ? <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="Your name" />
                        : <span className="text-white font-bold text-sm">{user?.name || '—'}</span>
                      }
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block">Email Address</label>
                    <div className={`flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border transition-all ${editMode ? 'border-primary/40' : 'border-white/5'}`}>
                      <FaEnvelope className="text-primary text-xs shrink-0" />
                      {editMode
                        ? <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="Your email" />
                        : <span className="text-white font-bold text-sm">{user?.email || '—'}</span>
                      }
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block">Phone Number</label>
                    <div className="flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border border-white/5">
                      <FaPhoneAlt className="text-primary text-xs shrink-0" />
                      <span className="text-white font-bold text-sm">{user?.phone || '—'}</span>
                    </div>
                  </div>

                  {/* Joined */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block">Joined On</label>
                    <div className="flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border border-white/5">
                      <FaCalendarAlt className="text-primary text-xs shrink-0" />
                      <span className="text-white font-bold text-sm">{joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <FaKey />
                </div>
                <div>
                  <h5 className="text-white font-black uppercase tracking-tight">Security</h5>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">Manage your password</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/forgot-password')}
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all"
              >
                Change Password
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
