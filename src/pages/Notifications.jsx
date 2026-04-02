import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, FaRegBell, FaChevronLeft, FaTag, 
  FaInfoCircle, FaCalendarAlt, FaTrashAlt, 
  FaEllipsisV, FaCheckCircle, FaSpinner 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Latest first
                setNotifications(data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                setError(data.message || "Failed to load notifications");
            }
        } catch (err) {
            setError("Connection to server failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('off') || t.includes('discount') || t.includes('promo')) return <FaTag className="text-primary" />;
        if (t.includes('ride') || t.includes('booking')) return <FaCheckCircle className="text-green-500" />;
        return <FaInfoCircle className="text-blue-500" />;
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#060606] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <FaSpinner className="text-primary text-4xl" />
            </motion.div>
        </div>
    );

    return (
        <div className="bg-[#060606] min-h-screen pt-[110px] pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                
                {/* Header Area */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:bg-white/10 transition-all border border-white/5">
                            <FaChevronLeft size={14} />
                        </Link>
                        <div>
                            <h1 className="text-white font-black text-4xl italic tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>Updates & News</h1>
                            <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mt-1">Personalized Feed for you</p>
                        </div>
                    </div>
                    <div className="hidden md:flex bg-white/5 px-6 py-3 rounded-2xl border border-white/5 items-center gap-3">
                        <FaBell className="text-primary animate-pulse" />
                        <span className="text-white font-black text-xs uppercase tracking-widest">{notifications.length} Active</span>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        <AnimatePresence>
                            {notifications.map((note, index) => (
                                <motion.div 
                                    key={note._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 5 }}
                                    className="bg-[#111] p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-xl group relative overflow-hidden"
                                >
                                    {/* Accent Gradient on top */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex gap-6 items-start relative z-10">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 items-center justify-center flex border border-white/10 group-hover:bg-white/10 transition-all">
                                            {getIcon(note.title)}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                                <h3 className="text-white font-black text-xl italic tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>{note.title}</h3>
                                                <div className="flex items-center gap-2 text-white/20">
                                                    <FaCalendarAlt size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">{formatDate(note.createdAt)}</span>
                                                </div>
                                            </div>
                                            <p className="text-white/40 text-sm leading-relaxed max-w-2xl font-medium">{note.message}</p>
                                        </div>

                                        <button className="text-white/10 hover:text-white/40 transition-colors p-2">
                                            <FaEllipsisV size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-20 bg-[#111] rounded-[3.5rem] border border-white/5">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                <FaRegBell className="text-white/10 text-4xl" />
                            </div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic" style={{ fontFamily: 'Syne, sans-serif' }}>Inbox is Empty</h3>
                            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em]">Check back later for exciting offers and updates.</p>
                            <Link to="/" className="mt-10 btn-primary inline-flex">Explore Rides</Link>
                        </div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="mt-16 text-center">
                    <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">Powered by Taxica Real-Time Engine</p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
