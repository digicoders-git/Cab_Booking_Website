import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';
import {
    FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaClock,
    FaTimes, FaCheckCircle, FaArrowRight, FaHistory,
    FaPlus, FaSyncAlt, FaBolt, FaRoute, FaUsers,
    FaExclamationTriangle, FaHourglassHalf, FaBan, FaEye, FaPhoneAlt, FaBuilding, FaDownload
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

    const generateReceipt = (booking) => {
        const doc = new jsPDF();
        
        // 1. External Border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, 200, 287); // Page Border

        // 🛡️ WATERMARK (LOGO)
        const img = new Image();
        img.src = logo;
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.05 }));
        doc.addImage(img, 'PNG', 45, 110, 120, 120);
        doc.restoreGraphicsState();
        
        // 2. Top Header Section (PAN & TAX INVOICE)
        doc.line(5, 15, 205, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("PAN: GWKPS6928H", 10, 11);
        doc.text("TAX INVOICE", 175, 11);
        
        // 3. Company Branding (Logo + Name)
        const topLogo = new Image();
        topLogo.src = logo;
        doc.addImage(topLogo, 'PNG', 92, 18, 25, 25); // Top Centered Logo
        
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text("KWIK CABS", 105, 52, { align: "center" });
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Arun Bhawan Kalu Kuwan Baberu Road, Banda UP", 105, 59, { align: "center" });
        doc.text("MOB : +91 7310221010", 105, 64, { align: "center" });
        
        // 4. Details Section (Receiver & Invoice Info)
        doc.line(5, 72, 205, 72);
        doc.line(125, 72, 125, 125); // Vertical separator
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("DETAIL OF RECEIVER / CONSIGNEE", 15, 80);
        doc.setLineWidth(0.2);
        doc.line(15, 81, 75, 81); // Underline
        
        doc.setFontSize(9);
        doc.text("Name :", 10, 89);
        doc.setFont("helvetica", "normal");
        
        // 🛡️ CORRECT USER DATA FETCHING
        let userData = {};
        try {
            userData = JSON.parse(localStorage.getItem('user') || '{}');
        } catch (e) {}

        const userName = userData.name || booking.createdBy?.name || 'Valued Customer';
        const userPhone = userData.phone || booking.createdBy?.phone || 'N/A';
        const userEmail = userData.email || booking.createdBy?.email || 'N/A';

        doc.text(`${userName}`, 25, 89);
        
        doc.setFont("helvetica", "bold");
        doc.text("Phone :", 10, 97);
        doc.setFont("helvetica", "normal");
        doc.text(`${userPhone}`, 25, 97);
        
        doc.setFont("helvetica", "bold");
        doc.text("Email :", 10, 105);
        doc.setFont("helvetica", "normal");
        doc.text(`${userEmail}`, 25, 105);
        
        doc.setFont("helvetica", "bold");
        doc.text("Pickup :", 10, 113);
        doc.setFont("helvetica", "normal");
        doc.text(`${booking.pickup.address.slice(0, 55)}...`, 25, 113);
        
        doc.setFont("helvetica", "bold");
        doc.text("Drop :", 10, 121);
        doc.setFont("helvetica", "normal");
        doc.text(`${booking.drop.address.slice(0, 55)}...`, 25, 121);
        
        // Invoice Info (Right side)
        doc.setFont("helvetica", "bold");
        doc.text(`Invoice No. : PT/${booking._id.toString().slice(-3).toUpperCase()}`, 130, 80);
        doc.text(`Invoice Date : ${new Date().toLocaleDateString('en-GB')}`, 130, 88);
        doc.text(`Pickup Date : ${new Date(booking.pickupDateTime).toLocaleDateString('en-GB')}`, 130, 96);
        
        if (booking.tripType === 'RoundTrip' && booking.returnDateTime) {
            doc.text(`Return Date : ${new Date(booking.returnDateTime).toLocaleDateString('en-GB')}`, 130, 104);
        } else {
            doc.text(`Duration : ${booking.numberOfDays} Day(s)`, 130, 104);
        }
        doc.text(`Trip Mode : ${booking.tripType}`, 130, 112);
        
        // 5. Table Header
        const tableTop = 125;
        doc.line(5, tableTop, 205, tableTop);
        doc.line(5, tableTop + 10, 205, tableTop + 10);
        
        doc.setFont("helvetica", "bold");
        doc.text("S. NO.", 8, tableTop + 7);
        doc.text("Description", 70, tableTop + 7, { align: "center" });
        doc.text("Unit", 130, tableTop + 7);
        doc.text("Qty.", 150, tableTop + 7);
        doc.text("Rate", 170, tableTop + 7);
        doc.text("Total", 190, tableTop + 7);
        
        // Vertical lines for table - PERFECT ALIGNMENT
        const tableBottom = 230;
        doc.line(18, tableTop, 18, tableBottom);
        doc.line(125, tableTop, 125, tableBottom);
        doc.line(145, tableTop, 145, tableBottom);
        doc.line(165, tableTop, 165, tableBottom);
        doc.line(185, tableTop, 185, tableBottom);
        
        // 6. Table Body (Dynamic Data)
        let currentY = tableTop + 17;

        // Calculate Total Base Weight for proportional distribution
        const totalBaseWeight = booking.carsRequired.reduce((sum, item) => {
            return sum + (item.category?.bulkBookingBasePrice || 0) * item.quantity;
        }, 0);

        booking.carsRequired.forEach((item, index) => {
           doc.setFont("helvetica", "normal");
           doc.text(`${index + 1}`, 11, currentY);
           doc.text(`Bulk Booking - ${item.category?.name || 'Vehicle'} (${booking.tripType})`, 25, currentY);
           doc.text("NOS", 129, currentY);
           doc.text(`${item.quantity}`, 152, currentY);
           
           // Calculate proportional share
           let totalForCategory = 0;
           if (totalBaseWeight > 0) {
               const weight = (item.category?.bulkBookingBasePrice || 0) * item.quantity;
               totalForCategory = Math.round((weight / totalBaseWeight) * booking.offeredPrice);
           } else {
               totalForCategory = Math.round(booking.offeredPrice / booking.carsRequired.length);
           }
           
           const rate = Math.round(totalForCategory / item.quantity);
           
           doc.text(`${rate}`, 168, currentY);
           doc.setFont("helvetica", "bold");
           doc.text(`${totalForCategory}`, 188, currentY);
           
           doc.line(5, currentY + 3, 205, currentY + 3); // ROW SEPARATOR LINE
           currentY += 10;
        });
        
        // Draw empty grid lines for remaining space
        for(let i = currentY; i < tableBottom; i += 10) {
            doc.line(5, i, 205, i);
        }
        doc.line(5, tableBottom, 205, tableBottom);
        
        // 7. Totals Section
        doc.setFont("helvetica", "bold");
        const advancePaid = booking.advancePayment?.amount || 0;
        const remainingBalance = booking.offeredPrice - advancePaid;

        doc.text("TOTAL PRICE", 130, tableBottom + 7);
        doc.text(`${booking.offeredPrice.toLocaleString()}`, 185, tableBottom + 7);
        doc.line(80, tableBottom + 10, 205, tableBottom + 10);
        
        doc.text("ADVANCE PAID", 130, tableBottom + 17);
        doc.text(`${advancePaid.toLocaleString()}`, 185, tableBottom + 17);
        doc.line(80, tableBottom + 20, 205, tableBottom + 20);
        
        doc.setFillColor(230, 230, 230);
        doc.rect(80, tableBottom + 20, 125, 10, 'F');
        doc.text("REMAINING BALANCE", 130, tableBottom + 27);
        doc.text(`INR ${remainingBalance.toLocaleString()}`, 185, tableBottom + 27);
        doc.line(80, tableBottom + 30, 205, tableBottom + 30);
        
        // 8. Bottom Footer
        doc.setFontSize(8);
        doc.text(`Total Amount (in words) : RUPEES ${booking.offeredPrice.toLocaleString()} ONLY`, 10, tableBottom + 35);
        doc.text(`Note: Balance of INR ${remainingBalance.toLocaleString()} to be paid directly to the fleet owner.`, 10, tableBottom + 40);
        
        doc.setFont("helvetica", "bold");
        doc.text("For KWIK CABS", 150, tableBottom + 50);
        doc.line(140, tableBottom + 75, 200, tableBottom + 75);
        doc.text("Authorized Signatory", 155, tableBottom + 82);
        
        doc.save(`Invoice_${booking._id.toString().slice(-6)}.pdf`);
    };


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

                                            {/* Trip Type Badge */}
                                            <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${booking.tripType === 'RoundTrip' ? 'bg-primary text-black border-primary/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                                                {booking.tripType === 'RoundTrip' ? 'Round Trip' : 'One Way'}
                                            </div>

                                            {/* Price + ID */}
                                            <div className="text-right shrink-0">
                                                <p className="text-xl font-black text-primary">₹{booking.offeredPrice.toLocaleString()}</p>
                                                {booking.startOtp && (
                                                    <div className="mt-1 bg-primary/20 border border-primary/30 rounded px-2 py-0.5 inline-block">
                                                        <p className="text-[10px] text-primary font-black tracking-[0.15em] uppercase">OTP: {booking.startOtp}</p>
                                                    </div>
                                                )}
                                                <p className="text-[9px] text-white/20 font-mono uppercase mt-1">#{booking._id.slice(-6).toUpperCase()}</p>
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
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">{booking.tripType === 'RoundTrip' ? 'Pickup' : 'Date'}</p>
                                                </div>
                                                {booking.tripType === 'RoundTrip' && (
                                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                                                    <FaCalendarAlt className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{booking.returnDateTime ? new Date(booking.returnDateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'N/A'}</p>
                                                    <p className="text-[9px] text-primary/50 uppercase font-bold mt-0.5">Return</p>
                                                </div>
                                                )}
                                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <FaClock className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{booking.numberOfDays}d</p>
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">Duration</p>
                                                </div>
                                                {booking.tripType !== 'RoundTrip' && (
                                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <FaRoute className="text-primary mx-auto mb-1.5" size={12} />
                                                    <p className="text-white text-xs font-black">{booking.totalDistance}km</p>
                                                    <p className="text-[9px] text-white/20 uppercase font-bold mt-0.5">Distance</p>
                                                </div>
                                                )}
                                            </div>

                                            {/* Fleet Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {booking.carsRequired.map((car, i) => (
                                                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 uppercase tracking-wider">
                                                        <FaTruck size={9} className="text-primary" />
                                                        {car.quantity}× {car.category?.name || 'Vehicle'}
                                                    </span>
                                                ))}
                                                {booking.assignedDrivers && booking.assignedDrivers.length > 0 && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase tracking-wider">
                                                        <FaUsers size={9} />
                                                        {booking.assignedDrivers.length} Drivers Ready
                                                    </span>
                                                )}
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

                                                {/* Download Receipt Button */}
                                                <motion.button
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => generateReceipt(booking)}
                                                    className="flex-1 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    <FaDownload size={10} /> Receipt
                                                </motion.button>

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

                                            {/* Action Area Removed redundant OTP box from here */}


                                            {/* Assigned Fleet Info - QUICK VIEW ON CARD */}
                                            {booking.assignedFleet && (
                                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3 group-hover:bg-primary/10 transition-all">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                                                                {booking.assignedFleet.image ? (
                                                                    <img 
                                                                        src={`${API_BASE_URL.replace('/api', '')}/uploads/${booking.assignedFleet.image}`} 
                                                                        alt="" 
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                ) : (
                                                                    <FaBuilding size={16} className="text-primary" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-primary font-black uppercase tracking-widest">Fleet Owner</p>
                                                                <h5 className="text-white text-xs font-black leading-tight mt-0.5">{booking.assignedFleet.companyName || booking.assignedFleet.name}</h5>
                                                            </div>
                                                        </div>
                                                        <a 
                                                            href={`tel:${booking.assignedFleet.phone}`}
                                                            className="w-8 h-8 bg-primary text-black rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20"
                                                        >
                                                            <FaPhoneAlt size={10} />
                                                        </a>
                                                    </div>

                                                    {/* DRIVERS LIST ON CARD */}
                                                    {booking.assignedDrivers && booking.assignedDrivers.length > 0 && (
                                                        <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3">
                                                            {booking.assignedDrivers.map((item, dIdx) => (
                                                                <div key={dIdx} className="flex items-center gap-2 bg-white/5 pr-3 py-1 rounded-full border border-white/5">
                                                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                                                        {item.driver?.image ? (
                                                                            <img src={`${API_BASE_URL.replace('/api', '')}/uploads/${item.driver.image}`} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <FaUsers size={10} className="text-white/20" />
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[10px] font-black text-white leading-none truncate max-w-[80px]">{item.driver?.name}</p>
                                                                        <p className="text-[8px] text-white/40 font-bold mt-0.5 leading-none">{item.driver?.phone}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
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
                                            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-black overflow-hidden border border-primary/30">
                                                {selectedBooking.assignedFleet.image ? (
                                                    <img 
                                                        src={`${API_BASE_URL.replace('/api', '')}/uploads/${selectedBooking.assignedFleet.image}`} 
                                                        alt="" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <FaBuilding size={20} className="text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-0.5">Assigned Fleet</p>
                                                <h4 className="text-white font-black text-base leading-tight">{selectedBooking.assignedFleet.companyName || 'Premium Fleet'}</h4>
                                                <p className="text-white/40 text-[10px] font-bold mt-0.5">Owner: {selectedBooking.assignedFleet.name}</p>
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

                                {/* Assigned Drivers Section */}
                                {selectedBooking.assignedDrivers && selectedBooking.assignedDrivers.length > 0 && (
                                    <div className="space-y-4">
                                        <h5 className="text-primary/40 text-[10px] uppercase font-black tracking-widest border-b border-primary/10 pb-2 flex items-center justify-between">
                                            Assigned Drivers
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px]">{selectedBooking.assignedDrivers.length} Ready</span>
                                        </h5>
                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedBooking.assignedDrivers.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                                                            {item.driver?.image ? (
                                                                <img 
                                                                    src={`${API_BASE_URL.replace('/api', '')}/uploads/${item.driver.image}`} 
                                                                    alt="" 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            ) : (
                                                                <FaUserCircle size={16} className="text-white/20" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h6 className="text-white text-sm font-black leading-tight">{item.driver?.name || 'Assigned Driver'}</h6>
                                                            <p className="text-[10px] text-white/30 font-bold mt-0.5">{item.driver?.phone || 'No phone'}</p>
                                                        </div>
                                                    </div>
                                                    {item.driver?.phone && (
                                                        <a 
                                                            href={`tel:${item.driver.phone}`}
                                                            className="w-8 h-8 bg-white/5 text-white/40 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            <FaPhoneAlt size={10} />
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
