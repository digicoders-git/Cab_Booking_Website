import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTaxi, FaPhoneAlt, FaShieldAlt, FaArrowRight, FaBolt } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

const Login = () => {
    const [formData, setFormData] = useState({
        phone: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length !== 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Number',
                text: 'Please enter a valid 10-digit phone number.',
                background: '#111',
                color: '#fff'
            });
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
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent!',
                    text: `Demo OTP is ${data.otp}.`,
                    background: '#111',
                    color: '#fff',
                    timer: 3000
                });
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to send OTP',
                background: '#111',
                color: '#fff'
            });
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
                    title: 'Login Successful',
                    text: 'Redirecting to your dashboard...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#111',
                    color: '#fff'
                });

                setTimeout(() => {
                    window.location.href = '/';
                }, 1600);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message,
                    background: '#111',
                    color: '#fff'
                });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Server error', background: '#111', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-[100px] sm:pt-[160px] pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#111111] hidden lg:block skew-x-[-10deg] translate-x-20"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10">
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                                <FaTaxi className="text-[#111111]" />
                            </div>
                            <span className="text-2xl font-black text-[#111111] lowercase tracking-tighter">KwikCabs </span>
                        </Link>
                        <h2 className="text-3xl font-black text-[#111111] mb-2 uppercase tracking-tight">Login Account</h2>
                        <p className="text-gray-500 font-medium italic">Secure access via Phone & OTP</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-xs font-bold text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Phone Number</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 flex items-center">
                                        <FaPhoneAlt className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="987 654 3210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]"
                                        />
                                    </div>
                                    {!otpSent && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={sendingOtp}
                                            className="px-6 bg-primary text-[#111] font-black rounded-2xl hover:bg-black hover:text-white transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                                        >
                                            {sendingOtp ? '...' : 'Send OTP'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative group"
                                    >
                                        <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1 mb-2 block">OTP Code</label>
                                        <div className="relative flex items-center">
                                            <FaShieldAlt className="absolute left-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                                            <input
                                                name="otp"
                                                type="text"
                                                required
                                                placeholder="Enter 6-digit OTP"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                className="w-full bg-primary/5 border-2 border-primary/20 py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-black text-[#111] placeholder:text-gray-300"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setOtpSent(false)}
                                                className="absolute right-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !otpSent}
                            className="w-full bg-primary text-[#111111] font-black py-5 rounded-2xl text-lg hover:bg-black hover:text-white hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'VERIFYING...' : (otpSent ? 'SECURE LOGIN ✅' : 'VERIFY PHONE FIRST')}
                        </button>

                        <p className="text-center text-gray-500 font-medium pt-4">
                            Don't have an account? <Link to="/register" className="text-primary font-black hover:underline ml-1">Join Now</Link>
                        </p>
                    </form>
                </div>

                <div className="hidden lg:block relative bg-[#111111]">
                    <img
                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920"
                        alt="Taxi background"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
                    <div className="absolute bottom-16 left-12 right-12 text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-[9px] font-black uppercase tracking-widest mb-6">
                            <FaBolt /> Trust Protocol Active
                        </div>
                        <h3 className="text-3xl font-black mb-4 leading-tight">PREMIUM MOBILITY <br /><span className="text-primary">REDEFINED.</span></h3>
                        <p className="text-gray-400 font-medium leading-relaxed">Experience a ride-hailing service where security meets luxury. Your journey, our priority.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
