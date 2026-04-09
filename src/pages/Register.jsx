import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaTaxi, FaUser, FaPhoneAlt, FaShieldAlt, FaArrowRight, FaBolt } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import PageHeader from '../components/PageHeader';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    otp: '123456' // Using fixed OTP as per backend
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          customClass: {
            popup: 'rounded-[30px] border border-white/10'
          }
        });

        setTimeout(() => {
          window.location.reload();
        }, 2100);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: data.message,
          background: '#111',
          color: '#fff',
          customClass: {
            popup: 'rounded-[30px] border border-white/10'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Server connection failed',
        background: '#111',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHeader title="Access Account" breadcrumb="Authentication" />

      <div className="flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-[#111] rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 relative z-10"
        >

          {/* Left Side: Branding / Marketing */}
          <div className="hidden lg:block relative overflow-hidden group">
            <img
              src="/unnamed.jpg"
              alt="Premium Taxi"
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>

            <div className="absolute inset-x-0 bottom-0 p-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <FaBolt size={10} className="animate-pulse" /> Limited Edition Experience
                </div>

                <h1 className="text-2xl font-bold text-white leading-tight uppercase tracking-tight mb-6">
                  The Future of <br />
                  <span className="text-primary">Urban Motion.</span>
                </h1>

                <p className="text-white/50 text-lg font-medium leading-relaxed max-w-sm mb-10">
                  Join the elite network of travelers. premium comfort, zero wait time, and complete security.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-primary text-2xl font-black">20M+</div>
                    <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Rides Completed</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-primary text-2xl font-black">4.9/5</div>
                    <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Customer Rating</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative bg-gradient-to-b from-white/[0.02] to-transparent">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="mb-12">
                <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                  <img src={logo} alt="KwikCabs  Logo" className="h-16 w-auto object-contain" />
                </Link>

                <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-tight leading-none">
                  Access <span className="text-primary">Account</span>
                </h2>
                <p className="text-white/40 font-medium text-sm tracking-tight text-justify">
                  Enter your credentials to unlock the premium ride-hailing experience within our network.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative group">
                      <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/5 py-4.5 pl-14 pr-5 rounded-[24px] outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all font-bold text-white placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Connect Number</label>
                    <div className="relative group">
                      <FaPhoneAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/5 py-4.5 pl-14 pr-5 rounded-[24px] outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all font-bold text-white placeholder:text-white/10"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Terminal (Optional)</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="email"
                      type="email"
                      placeholder="user@KwikCabs .com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/5 py-4.5 pl-14 pr-5 rounded-[24px] outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all font-bold text-white placeholder:text-white/10"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Security Token (Demo)</label>
                  <div className="relative group">
                    <FaShieldAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="otp"
                      type="text"
                      required
                      placeholder="000 000"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/5 py-4.5 pl-14 pr-5 rounded-[24px] outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all font-bold text-white placeholder:text-white/10"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-primary text-[#0a0a0a] font-black py-5 rounded-[24px] text-[13px] uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,188,0,0.2)] hover:shadow-white/10 transition-all duration-500 active:scale-98 disabled:opacity-50 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? 'Decrypting Access...' : (
                        <>Initialize Session <FaArrowRight /></>
                      )}
                    </span>
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center pt-8">
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    Protected by KwibSecure Advanced Encryption System
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default Register;

