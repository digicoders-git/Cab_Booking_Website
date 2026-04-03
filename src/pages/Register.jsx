import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaTaxi, FaUser, FaPhoneAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
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
        // Store Token and User Info
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
          color: '#fff'
        });

        // Redirect to profile or home
        setTimeout(() => {
          window.location.reload(); // Refresh to update Auth state in all components
        }, 2100);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: data.message,
          background: '#111',
          color: '#fff'
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-[100px] sm:pt-[160px] pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#111111] hidden lg:block  "></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex-row-reverse">

        {/* Right Side: Form */}
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <FaTaxi className="text-[#111111]" />
              </div>
              <span className="text-2xl font-black text-[#111111] lowercase tracking-tighter">kwibcabs</span>
            </Link>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111111] mb-2 uppercase tracking-tight">Access Account</h2>
            <p className="text-gray-500 font-medium tracking-tight">Enter details to Register or Login instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <label className="text-[10px] font-black text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Full Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Phone Number</label>
                <div className="relative flex items-center">
                  <FaPhoneAlt className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]"
                  />
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">OTP (Fixed for Demo)</label>
              <div className="relative flex items-center">
                <FaPhoneAlt className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="otp"
                  type="text"
                  required
                  placeholder="123456"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white font-black py-5 rounded-2xl text-[12px] uppercase tracking-widest hover:bg-primary hover:text-[#111111] hover:scale-[1.02] shadow-xl shadow-black/10 transition-all duration-300 active:scale-95 mt-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Register / Login Now'}
            </button>
          </form>
        </div>

        {/* Left Side: Image/Branding */}
        <div className="hidden lg:block relative bg-[#111111] order-2 lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&q=80&w=1920"
            alt="Taxi background"
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>

          <div className="absolute bottom-16 left-12 right-12 text-white">
            <div className="inline-block px-4 py-2 bg-primary rounded-full text-[#111111] font-black text-[9px] uppercase tracking-widest mb-6 border border-primary/20">
              New Member Offer
            </div>
            <h3 className="text-3xl font-black mb-4 leading-tight uppercase tracking-tight">GET 20% OFF ON YOUR <span className="text-primary">FIRST RIDE</span></h3>
            <p className="text-gray-300 font-medium leading-relaxed text-sm">Experience the ultimate comfort and reliability. Join KwibCabs and enjoy exclusive benefits on your travel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
