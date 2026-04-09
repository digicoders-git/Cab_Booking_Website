import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaEnvelope, FaPhoneAlt, FaCamera,
  FaSignOutAlt, FaTaxi, FaEdit, FaCheck, FaTimes,
  FaShieldAlt, FaCalendarAlt, FaUniversity, FaCreditCard,
  FaIdCard, FaBuilding, FaWallet, FaChartLine
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL, BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Register from './Register';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '',
    accountNumber: '', ifscCode: '', accountHolderName: '', bankName: ''
  });
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
        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          accountNumber: data.user.bankDetails?.accountNumber || '',
          ifscCode: data.user.bankDetails?.ifscCode || '',
          accountHolderName: data.user.bankDetails?.accountHolderName || '',
          bankName: data.user.bankDetails?.bankName || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleFormChange = useCallback((field) => (e) => {
    const val = field === 'ifscCode' ? e.target.value.toUpperCase() : e.target.value;
    setForm(p => ({ ...p, [field]: val }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('accountNumber', form.accountNumber);
      fd.append('ifscCode', form.ifscCode);
      fd.append('accountHolderName', form.accountHolderName);
      fd.append('bankName', form.bankName);
      if (imageFile) fd.append('image', imageFile);

      // Debug: FormData check
      for (let [k, v] of fd.entries()) console.log('FormData →', k, v);

      const res = await fetch(`${API_BASE_URL}/users/update-profile/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        // NOTE: Content-Type header bilkul mat lagao — browser khud multipart/form-data set karta hai boundary ke saath
        body: fd
      });
      const data = await res.json();
      console.log('Update response →', data);

      if (data.success) {
        // Server se jo image naam aaya use use karo, local preview nahi
        setUser(data.user);
        setEditMode(false);
        setImageFile(null);
        setImagePreview(null); // preview hata do — ab server image dikhegi
        localStorage.setItem('user', JSON.stringify(data.user));
        Swal.fire({
          icon: 'success', title: 'Profile Updated!',
          background: '#111', color: '#fff',
          confirmButtonColor: '#FFD60A', timer: 2000, showConfirmButton: false
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: data.message, background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
      }
    } catch (e) {
      console.error('Save error:', e);
      Swal.fire({ icon: 'error', title: 'Server Error', text: e.message, background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
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
        popup: 'rounded-3xl border border-white/10',
        confirmButton: 'font-black uppercase tracking-widest text-sm rounded-2xl px-8 py-3',
        cancelButton: 'font-black uppercase tracking-widest text-sm rounded-2xl px-8 py-3',
      }
    }).then(r => {
      if (r.isConfirmed) { localStorage.clear(); navigate('/'); }
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setImageFile(null);
    setImagePreview(null);
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        accountNumber: user.bankDetails?.accountNumber || '',
        ifscCode: user.bankDetails?.ifscCode || '',
        accountHolderName: user.bankDetails?.accountHolderName || '',
        bankName: user.bankDetails?.bankName || '',
      });
    }
  };

  // imagePreview = local blob (sirf edit mode mein preview ke liye)
  // user.image = server se aaya filename (save hone ke baad yahi use hoga)
  const avatarSrc = imagePreview
    ? imagePreview
    : user?.image
      ? `${BASE_URL}/uploads/${user.image}?t=${Date.now()}`  // cache bust karo
      : null;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const hasBankDetails = user?.bankDetails?.accountNumber;

  if (loading) return (
    <div className="bg-[#060606] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <FaUser className="text-primary text-5xl mx-auto animate-pulse" />
        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Loading Profile...</p>
      </div>
    </div>
  );

  if (!token || !userId) return <Register />;

  return (
    <div className="bg-[#060606] min-h-screen text-white pb-24">
      <PageHeader title="My Profile" breadcrumb="My Profile" />

      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Card ── */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
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
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{user?.email || '—'}</p>
                <p className="text-white/20 text-[10px] font-bold mb-3">+91 {user?.phone || '—'}</p>

                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  <HiSparkles /> Verified Member
                </div>

                {/* Wallet & Earnings */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <FaWallet className="text-primary text-sm mx-auto mb-2" />
                    <p className="text-white font-black text-lg">₹{user?.walletBalance || 0}</p>
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Wallet</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <FaChartLine className="text-emerald-400 text-sm mx-auto mb-2" />
                    <p className="text-white font-black text-lg">₹{user?.totalEarnings || 0}</p>
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Earnings</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 space-y-3">
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
                  className="w-full mt-6 bg-red-500/10 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 text-[11px] uppercase tracking-widest"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── Right Panel ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">Account Details</h4>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">Personal Information</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                    >
                      <FaEdit size={11} /> Edit Profile
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
                        <FaCheck size={10} /> {saving ? 'Saving...' : 'Save All'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <Field label="Full Name" icon={<FaUser />} editMode={editMode}>
                    {editMode
                      ? <input value={form.name} onChange={handleFormChange('name')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="Your name" />
                      : <span className="text-white font-bold text-sm">{user?.name || '—'}</span>
                    }
                  </Field>

                  {/* Email */}
                  <Field label="Email Address" icon={<FaEnvelope />} editMode={editMode}>
                    {editMode
                      ? <input value={form.email} onChange={handleFormChange('email')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="Your email" type="email" />
                      : <span className="text-white font-bold text-sm">{user?.email || '—'}</span>
                    }
                  </Field>

                  {/* Phone (read-only) */}
                  <Field label="Phone Number" icon={<FaPhoneAlt />} editMode={false}>
                    <span className="text-white font-bold text-sm">+91 {user?.phone || '—'}</span>
                  </Field>

                  {/* Joined */}
                  <Field label="Joined On" icon={<FaCalendarAlt />} editMode={false}>
                    <span className="text-white font-bold text-sm">{joinedDate}</span>
                  </Field>
                </div>
              </div>
            </motion.div>

            {/* Bank Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                    <FaUniversity size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">Bank Details</h4>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-0.5">
                      {hasBankDetails ? 'Linked for withdrawals' : 'Not linked yet'}
                    </p>
                  </div>
                  {!hasBankDetails && !editMode && (
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                      Add Bank
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Account Number */}
                  <Field label="Account Number" icon={<FaCreditCard />} editMode={editMode}>
                    {editMode
                      ? <input value={form.accountNumber} onChange={handleFormChange('accountNumber')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="e.g. 123456789012" />
                      : <span className="text-white font-bold text-sm">
                          {hasBankDetails ? `••••••${user.bankDetails.accountNumber.slice(-4)}` : '—'}
                        </span>
                    }
                  </Field>

                  {/* IFSC Code */}
                  <Field label="IFSC Code" icon={<FaIdCard />} editMode={editMode}>
                    {editMode
                      ? <input value={form.ifscCode} onChange={handleFormChange('ifscCode')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="e.g. SBIN0001234" />
                      : <span className="text-white font-bold text-sm">{user?.bankDetails?.ifscCode || '—'}</span>
                    }
                  </Field>

                  {/* Account Holder Name */}
                  <Field label="Account Holder Name" icon={<FaUser />} editMode={editMode}>
                    {editMode
                      ? <input value={form.accountHolderName} onChange={handleFormChange('accountHolderName')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="As per bank records" />
                      : <span className="text-white font-bold text-sm">{user?.bankDetails?.accountHolderName || '—'}</span>
                    }
                  </Field>

                  {/* Bank Name */}
                  <Field label="Bank Name" icon={<FaBuilding />} editMode={editMode}>
                    {editMode
                      ? <input value={form.bankName} onChange={handleFormChange('bankName')} className="bg-transparent text-white font-bold text-sm w-full outline-none placeholder:text-white/20" placeholder="e.g. SBI, HDFC, ICICI" />
                      : <span className="text-white font-bold text-sm">{user?.bankDetails?.bankName || '—'}</span>
                    }
                  </Field>
                </div>

                {/* Bank linked badge */}
                {hasBankDetails && !editMode && (
                  <div className="mt-6 flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-3.5">
                    <FaShieldAlt className="text-emerald-400 text-sm shrink-0" />
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      Bank account verified & linked for withdrawals
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Field wrapper
const Field = ({ label, icon, editMode, children }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block">{label}</label>
    <div className={`flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border transition-all ${editMode ? 'border-primary/40 bg-primary/5' : 'border-white/5'}`}>
      <span className="text-primary text-xs shrink-0">{icon}</span>
      {children}
    </div>
  </div>
);

export default Profile;
