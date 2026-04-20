import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUser, FaPhoneAlt, FaShieldAlt, FaArrowRight, FaBolt, FaCheckCircle, FaTaxi, FaStar } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      Swal.fire({ icon: 'warning', title: 'Wait!', text: 'Please enter a valid 10-digit phone number first.', background: '#111', color: '#fff' });
      return;
    }
    setSendingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        Swal.fire({ icon: 'success', title: 'OTP Sent!', text: `Demo OTP is ${data.otp}. Please enter it to continue.`, background: '#111', color: '#fff', timer: 3000 });
      } else throw new Error(data.message);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.message || 'Could not send OTP', background: '#111', color: '#fff' });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user._id);
        Swal.fire({
          icon: 'success',
          title: data.isNewUser ? 'Account Created!' : 'Welcome Back!',
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
          background: '#111',
          color: '#fff',
          customClass: { popup: 'rounded-[30px] border border-white/10' }
        });
        setTimeout(() => window.location.reload(), 2100);
      } else {
        Swal.fire({ icon: 'error', title: 'Authentication Failed', text: data.message, background: '#111', color: '#fff', customClass: { popup: 'rounded-[30px] border border-white/10' } });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Server connection failed', background: '#111', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── HERO SECTION ── */}
      <div
        className="relative w-full h-[55vh] min-h-[420px] flex flex-col items-center justify-center text-center overflow-hidden pt-[90px]"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Yellow bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-5 py-2 mb-6"
        >
          <FaBolt size={10} className="text-primary animate-pulse" />
          <span className="text-primary text-[11px] font-black uppercase tracking-[0.25em]">Join KwikCabs Network</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-4 px-4"
        >
          Create Your <span className="text-primary">Account</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-white/50 text-sm font-medium max-w-md px-6 mb-10"
        >
          Book rides instantly, track drivers live, and enjoy premium comfort across 150+ cities.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 flex items-center gap-6 sm:gap-10"
        >
          {[
            { value: '20M+', label: 'Rides' },
            { value: '4.9★', label: 'Rating' },
            { value: '150+', label: 'Cities' },
            { value: '24/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-primary font-black text-xl sm:text-2xl leading-none">{s.value}</div>
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FORM SECTION ── */}
      <div className="flex items-center justify-center px-4 py-14 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden border border-white/8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

        {/* ── LEFT SIDE: Branding ── */}
        <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0d0d0d]">
          <img
            src="/unnamed.jpg"
            alt="Premium Taxi"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />

          {/* Top badge */}
          <div className="relative z-10 p-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
              <FaBolt size={9} className="text-primary animate-pulse" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">KwikCabs Premium</span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="relative z-10 mt-auto p-10 pb-14">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

              {/* Taxi icon */}
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-8">
                <FaTaxi className="text-primary text-2xl" />
              </div>

              <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tight mb-4">
                The Future of<br />
                <span className="text-primary">Urban Motion.</span>
              </h1>

              <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
                Join the elite network of travelers — premium comfort, zero wait time, and complete security.
              </p>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-primary text-sm" />
                ))}
                <span className="text-white/30 text-xs ml-2 font-bold">4.9 / 5.0</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/8">
                <div>
                  <div className="text-primary text-2xl font-black mb-1">20M+</div>
                  <div className="text-white/25 text-[10px] uppercase font-bold tracking-widest">Rides Completed</div>
                </div>
                <div>
                  <div className="text-primary text-2xl font-black mb-1">150+</div>
                  <div className="text-white/25 text-[10px] uppercase font-bold tracking-widest">Cities Covered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Form ── */}
        <div className="bg-[#111] flex flex-col justify-center p-8 sm:p-12 lg:p-14">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link to="/">
              <img src={logo} alt="KwikCabs Logo" className="h-14 w-auto object-contain" />
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none mb-3">
              Create <span className="text-primary">Account</span>
            </h2>
            <p className="text-white/30 text-sm leading-relaxed">
              Enter your details to join the KwikCabs network.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors text-sm" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/8 py-4 pl-12 pr-5 rounded-2xl outline-none focus:bg-white/[0.07] focus:border-primary/50 transition-all text-white text-sm placeholder:text-white/15 font-medium"
                />
              </div>
            </motion.div>

            {/* Phone + Send OTP */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Phone Number</label>
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <FaPhoneAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors text-sm" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/[0.04] border border-white/8 py-4 pl-12 pr-5 rounded-2xl outline-none focus:bg-white/[0.07] focus:border-primary/50 transition-all text-white text-sm placeholder:text-white/15 font-medium"
                  />
                </div>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || formData.phone.length !== 10}
                    className="px-5 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-30 whitespace-nowrap shadow-lg shadow-primary/20"
                  >
                    {sendingOtp ? '...' : 'Send OTP'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <FaCheckCircle className="text-green-400 text-sm" />
                    <span className="text-green-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Sent</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Email <span className="text-white/15 normal-case tracking-normal font-medium">(Optional)</span></label>
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors text-sm" />
                <input
                  name="email"
                  type="email"
                  placeholder="user@kwikcabs.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/8 py-4 pl-12 pr-5 rounded-2xl outline-none focus:bg-white/[0.07] focus:border-primary/50 transition-all text-white text-sm placeholder:text-white/15 font-medium"
                />
              </div>
            </motion.div>

            {/* OTP Field — shows after OTP sent */}
            <AnimatePresence>
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-2 ml-1">OTP Code</label>
                  <div className="relative group">
                    <FaShieldAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors text-sm" />
                    <input
                      name="otp"
                      type="text"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full bg-primary/5 border border-primary/25 py-4 pl-12 pr-32 rounded-2xl outline-none focus:bg-primary/8 focus:border-primary/60 transition-all text-white text-sm placeholder:text-white/15 font-medium tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors"
                    >
                      Change No.
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
              <button
                type="submit"
                disabled={loading || !otpSent}
                className="w-full bg-primary text-black font-black py-4 rounded-2xl text-sm uppercase tracking-[0.15em] hover:bg-yellow-400 hover:scale-[1.01] shadow-[0_15px_35px_rgba(255,214,10,0.2)] transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : otpSent ? (
                  <><FaCheckCircle size={14} /> Complete Registration</>
                ) : (
                  <>Verify Phone First</>
                )}
              </button>
            </motion.div>



          </form>

          {/* Footer note */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/15 text-[10px] font-bold uppercase tracking-widest text-center mt-8">
            Protected by KwikSecure Encryption
          </motion.p>

        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;
