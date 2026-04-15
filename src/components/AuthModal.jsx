import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaLock, FaUser, FaEnvelope, FaTimes, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Register (Optional)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [authData, setAuthData] = useState({
        phone: '',
        otp: '',
        name: '',
        email: ''
    });

    const handleChange = (e) => setAuthData({ ...authData, [e.target.name]: e.target.value });

    // Step 1: Handle Login/Register Request
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authData)
            });
            const data = await res.json();

            if (data.success) {
                // If it was just a login, or registration with enough data
                if (data.isNewUser && step !== 3) {
                    // It's a new user and we haven't asked for name/email yet
                    setStep(3);
                } else {
                    // Login successful or Registration complete
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    onAuthSuccess(data.user);
                    onClose();
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
                    onClick={onClose} 
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    {/* Pattern Overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    
                    <div className="p-8 sm:p-10 relative z-10">
                        {/* Close button */}
                        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                            <FaTimes size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 rotate-12">
                                <FaLock className="text-[#111] text-2xl" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                                {step === 3 ? 'Complete Profile' : 'Secure Login'}
                            </h2>
                            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">
                                {step === 1 ? 'Enter phone to verify' : step === 2 ? 'Verification required' : 'One last step'}
                            </p>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold p-3 rounded-xl mb-6 text-center uppercase tracking-wider">
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1.5 group-focus-within:text-primary transition-colors">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                                <FaPhone size={14} />
                                            </div>
                                            <input 
                                                type="tel" name="phone" required 
                                                placeholder="Enter 10 digit number"
                                                className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-xl text-white font-bold text-sm outline-none focus:border-primary transition-all"
                                                value={authData.phone} onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="button" onClick={() => setStep(2)}
                                        className="w-full bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        Verify Number <FaArrowRight size={12} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1.5 group-focus-within:text-primary transition-colors">OTP Code</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                                <FaCheckCircle size={14} />
                                            </div>
                                            <input 
                                                type="text" name="otp" required 
                                                placeholder="Enter 6 digit OTP"
                                                className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-xl text-white font-bold text-sm outline-none focus:border-primary tracking-[0.5em] transition-all"
                                                value={authData.otp} onChange={handleChange}
                                            />
                                        </div>
                                        <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest">Testing? Use 123456</p>
                                    </div>
                                    <button 
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying...' : 'Login Now'}
                                    </button>
                                    <button type="button" onClick={() => setStep(1)} className="w-full text-white/30 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                        Back to Phone
                                    </button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1.5 group-focus-within:text-primary transition-colors">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                                <FaUser size={14} />
                                            </div>
                                            <input 
                                                type="text" name="name" required 
                                                placeholder="John Doe"
                                                className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-xl text-white font-bold text-sm outline-none focus:border-primary transition-all"
                                                value={authData.name} onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1.5 group-focus-within:text-primary transition-colors">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                                <FaEnvelope size={14} />
                                            </div>
                                            <input 
                                                type="email" name="email" required 
                                                placeholder="john@example.com"
                                                className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-xl text-white font-bold text-sm outline-none focus:border-primary transition-all"
                                                value={authData.email} onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Register and Continue'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
