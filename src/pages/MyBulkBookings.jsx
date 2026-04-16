import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaClock,
    FaTimes, FaCheckCircle, FaArrowRight, FaHistory,
    FaPlus, FaSyncAlt, FaBolt, FaRoute, FaUsers,
    FaExclamationTriangle, FaHourglassHalf, FaBan, FaEye, FaPhoneAlt, FaBuilding
} from 'react-icons/fa';

import { API_BASE_URL } from '../config/api';

const statusConfig = {
    Marketplace: {
        label: 'Live on Market',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        dot: 'bg-amber-400',
        icon: <FaHourglassHalf size={12} />,
        pulse: true,
    },
    Ongoing: {
        label: 'Ongoing',
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20',
        dot: 'bg-indigo-400',
        icon: <FaSyncAlt size={12} className="animate-spin" />,
        pulse: true,
    },
    Accepted: {

        label: 'Accepted',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20',
        dot: 'bg-green-400',
        icon: <FaCheckCircle size={12} />,
        pulse: false,
    },
    Completed: {
        label: 'Completed',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20',
        dot: 'bg-blue-400',
        icon: <FaCheckCircle size={12} />,
        pulse: false,
    },
    Cancelled: {
        label: 'Cancelled',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        dot: 'bg-red-400',
        icon: <FaBan size={12} />,
        pulse: false,
    },
};

const StatCard = ({ label, value, icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
    >
        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-white leading-none">{value}</p>
            <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-bold tracking-widest mt-1 leading-tight">{label}</p>
        </div>
    </motion.div>
);

const MyBulkBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [refreshing, setRefreshing] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);


    useEffect(() => { fetchMyBookings(); }, []);

    const fetchMyBookings = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/bulk-bookings/my-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBookings(data.bookings || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCancel = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Cancel Request?',
            text: 'Are you sure you want to cancel this bulk booking request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel it!',
            cancelButtonText: 'Go Back',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#FFD60A',
            background: '#111',
            color: '#fff',
            customClass: {
                popup: 'rounded-3xl border border-white/10',
                title: 'text-white font-black',
                confirmButton: 'rounded-xl font-black text-xs uppercase tracking-widest',
                cancelButton: 'rounded-xl font-black text-xs uppercase tracking-widest !text-black',
            }
        });
        if (!isConfirmed) return;
        setCancellingId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/bulk-bookings/cancel/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) fetchMyBookings();
            else alert(data.message || 'Cancellation failed.');
        } catch (err) {
            console.error(err);
        } finally {
            setCancellingId(null);
        }
    };

    const filtered = bookings.filter(b =>
        activeTab === 'active'
            ? b.status === 'Marketplace' || b.status === 'Accepted' || b.status === 'Ongoing'
            : b.status === 'Completed' || b.status === 'Cancelled'
    );


    const stats = {
        total: bookings.length,
        live: bookings.filter(b => b.status === 'Marketplace').length,
        accepted: bookings.filter(b => b.status === 'Accepted').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
    };

    return (
        <div className="bg-[#080808] min-h-screen">

            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden bg-[#0a0a0a] border-b border-white/5 pt-28 pb-10 px-4">
                {/* glow blobs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
                                <FaBolt className="text-primary text-[10px]" />
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Bulk Fleet Dashboard</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                                My Bulk <span className="text-primary">Bookings</span>
                            </h1>
                            <p className="text-white/30 text-sm max-w-md">
                                Track your wedding, event & corporate fleet requests in real-time.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/bulk-booking')}
                                className="flex items-center gap-2 bg-primary text-black font-black px-5 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-yellow-400 transition-all"
                            >
                                <FaPlus size={11} /> New Request
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
                        <StatCard label="Total Requests" value={stats.total} icon={<FaTruck size={18} />} color="bg-white/5 text-white/40" />
                        <StatCard label="Live on Market" value={stats.live} icon={<FaHourglassHalf size={18} />} color="bg-amber-400/10 text-amber-400" />
                        <StatCard label="Accepted" value={stats.accepted} icon={<FaCheckCircle size={18} />} color="bg-green-400/10 text-green-400" />
                        <StatCard label="Completed" value={stats.completed} icon={<FaRoute size={18} />} color="bg-blue-400/10 text-blue-400" />
                    </div>
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="container mx-auto max-w-6xl px-4 py-14">

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-2xl p-1 w-fit mb-10">
                    {[
                        { key: 'active', label: 'Live Requests', icon: <FaBolt size={11} /> },
                        { key: 'history', label: 'Past History', icon: <FaHistory size={11} /> },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.key ? 'text-black' : 'text-white/30 hover:text-white'}`}
                        >
                            {activeTab === tab.key && (
                                <motion.div layoutId="tabBg" className="absolute inset-0 bg-primary rounded-xl" />
                            )}
                            <span className="relative z-10">{tab.icon}</span>
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-8 animate-pulse">
                                <div className="h-4 bg-white/5 rounded-full w-1/3 mb-4" />
                                <div className="h-3 bg-white/5 rounded-full w-2/3 mb-3" />
                                <div className="h-3 bg-white/5 rounded-full w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24 bg-[#0A0A0A] border border-dashed border-white/10 rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                            {activeTab === 'active' ? <FaTruck size={32} /> : <FaHistory size={32} />}
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">No {activeTab === 'active' ? 'live' : 'past'} requests</h3>
                        <p className="text-white/30 text-sm max-w-xs mx-auto mb-8">
                            {activeTab === 'active'
                                ? 'Place a bulk booking request to see it here.'
                                : 'Your completed or cancelled bookings will appear here.'}
                        </p>
                        {activeTab === 'active' && (
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/bulk-booking')}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-black font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-yellow-400 transition-all"
                            >
                                <FaPlus size={11} /> Create New Request
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    /* Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filtered.map((booking, idx) => {
                                const cfg = statusConfig[booking.status] || statusConfig.Marketplace;
                                return (
                                    <motion.div
                                        key={booking._id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.06 }}
                                        className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 transition-all group"
                                    >
                                        {/* Card Top Bar */}
                                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                                            {/* Status Badge */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                                                {cfg.pulse && (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`} />
                                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                                                    </span>
                                                )}
                                                {cfg.icon}
                                                {cfg.label}
                                            </div>

                                            {/* Price + ID */}
                                            <div className="text-right">
                                                <p className="text-xl font-black text-primary">₹{booking.offeredPrice.toLocaleString()}</p>
                                                <p className="text-[9px] text-white/20 font-mono uppercase">#{booking._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-5">
                                            {/* Route */}
                                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                        <FaMapMarkerAlt className="text-primary text-[10px]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-0.5">Pickup</p>
                                                        <p className="text-sm font-bold text-white line-clamp-1">{booking.pickup.address}</p>
                                                    </div>
                                                </div>
                                                <div className="ml-3.5 w-px h-4 bg-white/10" />
                                                <div className="flex items-start gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                        <FaMapMarkerAlt className="text-red-400 text-[10px]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-0.5">Drop</p>
                                                        <p className="text-sm font-bold text-white line-clamp-1">{booking.drop.address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <FaCalendarAlt className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{new Date(booking.pickupDateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">Date</p>
                                                </div>
                                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <FaClock className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{booking.numberOfDays}d</p>
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">Duration</p>
                                                </div>
                                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <FaRoute className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{booking.totalDistance}km</p>
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">Distance</p>
                                                </div>
                                            </div>

                                            {/* Fleet Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {booking.carsRequired.map((car, i) => (
                                                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 uppercase tracking-wider">
                                                        <FaTruck size={9} className="text-primary" />
                                                        {car.quantity}× {car.category?.name || 'Vehicle'}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Area */}
                                            <div className="flex items-center gap-3 pt-2">
                                                {/* View Details Button (Shows when Fleet is assigned) */}
                                                {booking.assignedFleet && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <FaEye size={10} className="text-primary" /> View Details
                                                    </motion.button>
                                                )}

                                                {/* Cancel Button (Only for Marketplace and Accepted) */}
                                                {(booking.status === 'Marketplace' || booking.status === 'Accepted') && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleCancel(booking._id)}
                                                        disabled={cancellingId === booking._id}
                                                        className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                                                    >
                                                        {cancellingId === booking._id ? (
                                                            <span className="animate-pulse">...</span>
                                                        ) : (
                                                            <><FaTimes size={10} /> Cancel</>
                                                        )}
                                                    </motion.button>
                                                )}
                                            </div>

                                            {booking.status === 'Accepted' && (
                                                <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-4 flex items-center gap-4">
                                                    <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                        <FaCheckCircle className="text-green-400" size={16} />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-white text-[10px] font-black mb-0.5 uppercase tracking-wider">Fleet Owner Accepted!</h5>
                                                        <p className="text-[10px] text-white/30 tracking-tight">OTP to Start: <span className="text-primary font-black text-xs ml-1 tracking-[0.2em]">{booking.startOtp}</span></p>
                                                    </div>
                                                </div>
                                            )}


                                            {booking.status === 'Completed' && (
                                                <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-4 flex items-center gap-4">
                                                    <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                        <FaRoute className="text-blue-400" size={16} />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-white text-xs font-black mb-0.5">Trip Completed</h5>
                                                        <p className="text-[10px] text-white/30">This bulk booking has been successfully completed.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── VIEW DETAILS MODAL ── */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[32px] overflow-hidden relative z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-white font-black text-lg uppercase tracking-tight">Booking Details</h3>
                                <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                    <FaTimes size={14} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Fleet Info (Only if accepted) */}
                                {selectedBooking.assignedFleet && (
                                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black">
                                                <FaBuilding size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-0.5">Assigned Fleet</p>
                                                <h4 className="text-white font-black text-base">{selectedBooking.assignedFleet.companyName || 'Unknown Fleet'}</h4>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-white/60">
                                                <FaPhoneAlt size={10} className="text-primary" />
                                                <span className="text-xs font-bold">{selectedBooking.assignedFleet.phone || 'Contact Support'}</span>
                                            </div>
                                            <a href={`tel:${selectedBooking.assignedFleet.phone}`} className="bg-primary text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
                                                Call Now
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* OTP Section */}
                                {selectedBooking.status === 'Accepted' && (
                                    <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-5 text-center">
                                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">Share this OTP with Driver to start</p>
                                        <div className="text-4xl font-black text-primary tracking-[0.3em] font-mono">{selectedBooking.startOtp}</div>
                                    </div>
                                )}

                                {/* Trip Details */}
                                <div className="space-y-4">
                                    <h5 className="text-white/30 text-[10px] uppercase font-black tracking-widest border-b border-white/5 pb-2">Location & Schedule</h5>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <FaMapMarkerAlt className="text-primary shrink-0 mt-1" size={14} />
                                            <div>
                                                <p className="text-white text-sm font-bold">{selectedBooking.pickup.address}</p>
                                                <p className="text-[10px] text-white/20 uppercase font-bold">Pickup Point</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <FaMapMarkerAlt className="text-red-400 shrink-0 mt-1" size={14} />
                                            <div>
                                                <p className="text-white text-sm font-bold">{selectedBooking.drop.address}</p>
                                                <p className="text-[10px] text-white/20 uppercase font-bold">Drop Point</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicles */}
                                <div className="space-y-4">
                                    <h5 className="text-white/30 text-[10px] uppercase font-black tracking-widest border-b border-white/5 pb-2">Vehicles Requested</h5>
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedBooking.carsRequired.map((car, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
                                                <span className="text-white text-sm font-bold">{car.category?.name}</span>
                                                <span className="text-primary font-black px-3 py-1 bg-primary/10 rounded-lg text-xs">x{car.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10">
                                    <div>
                                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Total Agreed Price</p>
                                        <p className="text-white text-2xl font-black">₹{selectedBooking.offeredPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Status</p>
                                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${statusConfig[selectedBooking.status]?.bg} ${statusConfig[selectedBooking.status]?.color}`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default MyBulkBookings;
