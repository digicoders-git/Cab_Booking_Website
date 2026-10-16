import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaClock, 
    FaTicketAlt, 
    FaExclamationCircle,
    FaTimes,
    FaCheckCircle,
    FaTimesCircle,
    FaCar,
    FaUserCheck
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const MySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState(null);
    const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'present', 'absent', 'upcoming'
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('payment_status');

        if (paymentStatus === 'success') {
            Swal.fire({
                title: 'Payment Successful!',
                text: 'Your subscription is now active.',
                icon: 'success',
                confirmButtonColor: '#FFD60A'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
            Swal.fire({
                title: 'Payment Failed',
                text: 'There was an issue with your payment. Please try again.',
                icon: 'error',
                confirmButtonColor: '#FFD60A'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [location]);

    useEffect(() => {
        const fetchMySubscriptions = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/users/my-subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSubscriptions(data.subscriptions);
                }
            } catch (error) {
                console.error("Error fetching my subscriptions:", error);
                Swal.fire('Error', 'Failed to load subscriptions', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchMySubscriptions();
    }, [navigate]);

    // Generate full calendar register from startDate to endDate
    const getRegisterDays = (sub) => {
        if (!sub || !sub.startDate || !sub.endDate) return [];
        const days = [];
        
        const cleanStart = typeof sub.startDate === 'string' ? sub.startDate.split('T')[0] : new Date(sub.startDate).toISOString().split('T')[0];
        const cleanEnd = typeof sub.endDate === 'string' ? sub.endDate.split('T')[0] : new Date(sub.endDate).toISOString().split('T')[0];
        
        const [sy, sm, sd] = cleanStart.split('-').map(Number);
        const [ey, em, ed] = cleanEnd.split('-').map(Number);
        
        let cur = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        
        const todayStr = new Date().toISOString().split('T')[0];
        let dayCounter = 1;

        while (cur <= end) {
            const year = cur.getFullYear();
            const month = String(cur.getMonth() + 1).padStart(2, '0');
            const day = String(cur.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const log = sub.dailyLogs?.find(l => l.date === dateStr);

            const formatTrip = (trip, scheduledTime) => {
                if (trip?.status === 'Completed') {
                    return {
                        status: 'Completed',
                        label: 'Present',
                        time: trip.completedAt ? new Date(trip.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : scheduledTime
                    };
                }
                if (trip?.status === 'Started') {
                    return {
                        status: 'Started',
                        label: 'In Progress',
                        time: trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : scheduledTime
                    };
                }
                if (trip?.status === 'Missed') {
                    return {
                        status: 'Missed',
                        label: 'Absent (Missed)',
                        time: scheduledTime
                    };
                }
                if (dateStr < todayStr) {
                    return {
                        status: 'Absent',
                        label: 'Absent (No Show)',
                        time: scheduledTime
                    };
                }
                if (dateStr === todayStr) {
                    return {
                        status: 'Pending',
                        label: 'Scheduled Today',
                        time: scheduledTime
                    };
                }
                return {
                    status: 'Upcoming',
                    label: 'Upcoming',
                    time: scheduledTime
                };
            };

            const goTripInfo = formatTrip(log?.goTrip, sub.pickupTime);
            const returnTripInfo = sub.returnTime ? formatTrip(log?.returnTrip, sub.returnTime) : null;

            // Day Status Calculation
            let dayStatus = 'Upcoming';
            let filterType = 'upcoming';

            if (dateStr > todayStr) {
                dayStatus = 'Upcoming';
                filterType = 'upcoming';
            } else if (dateStr === todayStr) {
                const isGoComplete = goTripInfo.status === 'Completed';
                const isReturnComplete = returnTripInfo ? returnTripInfo.status === 'Completed' : true;
                if (isGoComplete && isReturnComplete) {
                    dayStatus = 'Present';
                    filterType = 'present';
                } else if (goTripInfo.status === 'Started' || returnTripInfo?.status === 'Started') {
                    dayStatus = 'In Progress';
                    filterType = 'present';
                } else {
                    dayStatus = 'Today Scheduled';
                    filterType = 'upcoming';
                }
            } else {
                // Past day
                const isGoPresent = goTripInfo.status === 'Completed';
                const isReturnPresent = returnTripInfo ? returnTripInfo.status === 'Completed' : true;
                if (isGoPresent && isReturnPresent) {
                    dayStatus = 'Present';
                    filterType = 'present';
                } else if (isGoPresent || (returnTripInfo && isReturnPresent)) {
                    dayStatus = 'Half Day';
                    filterType = 'present';
                } else {
                    dayStatus = 'Absent';
                    filterType = 'absent';
                }
            }

            const formattedDate = cur.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            days.push({
                dayNumber: dayCounter++,
                date: dateStr,
                formattedDate,
                isToday: dateStr === todayStr,
                isPast: dateStr < todayStr,
                isFuture: dateStr > todayStr,
                goTrip: goTripInfo,
                returnTrip: returnTripInfo,
                dayStatus,
                filterType
            });

            cur.setDate(cur.getDate() + 1);
        }

        return days;
    };

    const registerDays = selectedSub ? getRegisterDays(selectedSub) : [];
    const totalDays = registerDays.length;
    const presentDays = registerDays.filter(d => d.dayStatus === 'Present' || d.dayStatus === 'Half Day').length;
    const absentDays = registerDays.filter(d => d.dayStatus === 'Absent').length;
    const upcomingDays = registerDays.filter(d => d.filterType === 'upcoming').length;
    const pastDaysCount = presentDays + absentDays;
    const attendanceRate = pastDaysCount > 0 ? Math.round((presentDays / pastDaysCount) * 100) : 100;

    const filteredRegister = registerDays.filter(d => {
        if (historyFilter === 'present') return d.filterType === 'present';
        if (historyFilter === 'absent') return d.filterType === 'absent';
        if (historyFilter === 'upcoming') return d.filterType === 'upcoming';
        return true;
    });

    return (
        <div className="bg-[#0A0A0A] min-h-screen font-sans">
            <PageHeader title="My Subscriptions" breadcrumb="My Passes" />

            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {subscriptions.map(sub => (
                            <div key={sub._id} className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden relative flex flex-col md:flex-row group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,214,10,0.15)] transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                
                                {/* Left Side Summary */}
                                <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 md:w-1/3 flex flex-col justify-center items-center text-center bg-black/20 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                                        <FaTicketAlt className="text-primary text-2xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-1">{sub.plan?.name}</h3>
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mt-2 ${sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {sub.status}
                                    </span>
                                    
                                    <button 
                                        onClick={() => { setSelectedSub(sub); setHistoryFilter('all'); }}
                                        className="mt-4 text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FaCalendarAlt size={10} /> View Report
                                    </button>
                                </div>
                                
                                {/* Right Side Details */}
                                <div className="p-6 flex-1 relative z-10 flex flex-col justify-between">
                                    <div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1"><FaCalendarAlt className="inline mr-1 text-primary"/> Start Date</p>
                                                <p className="text-xs font-bold text-white">{new Date(sub.startDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1"><FaCalendarAlt className="inline mr-1 text-primary"/> End Date</p>
                                                <p className="text-xs font-bold text-white">{new Date(sub.endDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1"><FaClock className="inline mr-1 text-primary"/> Pickup Time</p>
                                                <p className="text-xs font-bold text-white">{sub.pickupTime}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1"><FaClock className="inline mr-1 text-primary"/> Return Time</p>
                                                <p className="text-xs font-bold text-white">{sub.returnTime || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Pickup Point</p>
                                                    <p className="text-xs text-white/80 line-clamp-2 mt-0.5">{sub.pickup?.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                                                    <FaMapMarkerAlt size={10} className="text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Drop Point</p>
                                                    <p className="text-xs text-white/80 line-clamp-2 mt-0.5">{sub.drop?.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Captain and Action Button Section */}
                                    <div className="pt-4 mt-5 border-t border-white/5 space-y-3">
                                        {sub.assignedDriver ? (
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
                                                        {sub.assignedDriver.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Assigned Captain</p>
                                                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                                            {sub.assignedDriver.name}
                                                            {sub.assignedDriver.vehicleNumber && (
                                                                <span className="text-[10px] text-primary/80 font-mono font-normal">
                                                                    • {sub.assignedDriver.vehicleNumber}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                {sub.assignedDriver.phone && (
                                                    <a href={`tel:${sub.assignedDriver.phone}`} className="text-xs text-primary font-bold hover:underline">
                                                        {sub.assignedDriver.phone}
                                                    </a>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                                                <p className="text-xs text-white/40">Captain will be assigned before your scheduled pickup</p>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => { setSelectedSub(sub); setHistoryFilter('all'); }}
                                            className="w-full py-3 bg-gradient-to-r from-primary to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(255,214,10,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <FaCalendarAlt size={13} /> View Attendance Report
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                        {subscriptions.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 text-white/50 bg-[#141414] rounded-[2.5rem] border border-white/5">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                    <FaExclamationCircle className="h-8 w-8 text-white/20" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">No Active Subscriptions</h3>
                                <p className="text-sm text-white/50 mb-8">You haven't purchased any monthly passes yet.</p>
                                <button onClick={() => navigate('/subscriptions')} className="px-8 py-3.5 bg-primary text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,214,10,0.4)] transition-all">
                                    Browse Passes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Attendance Register & Duty Report Modal */}
            {selectedSub && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-fadeIn">
                    <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-black via-[#1a1a1a] to-[#141414] text-white shrink-0">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-primary/20 text-primary text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-primary/30">
                                        Commute Pass Report
                                    </span>
                                    <span className="text-xs text-white/60 font-medium">
                                        {selectedSub.plan?.name}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Daily Duty & Attendance Register
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-white/60">
                                    <span className="flex items-center gap-1">
                                        <FaCalendarAlt className="text-primary" size={11} />
                                        {new Date(selectedSub.startDate).toLocaleDateString()} - {new Date(selectedSub.endDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-primary" size={11} />
                                        Pick: <strong className="text-white">{selectedSub.pickupTime}</strong> {selectedSub.returnTime ? `| Return: ${selectedSub.returnTime}` : ''}
                                    </span>
                                    {selectedSub.assignedDriver && (
                                        <span className="flex items-center gap-1">
                                            Captain: <strong className="text-primary">{selectedSub.assignedDriver.name}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedSub(null); setHistoryFilter('all'); }} 
                                className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Top KPI Summary Stats */}
                        <div className="p-4 bg-black/40 border-b border-white/10 shrink-0">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                    <p className="text-[9px] uppercase font-black text-white/40 tracking-wider">Total Pass Days</p>
                                    <p className="text-xl font-extrabold text-white mt-0.5">{totalDays}</p>
                                </div>
                                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center">
                                    <p className="text-[9px] uppercase font-black text-emerald-400 tracking-wider">Present Days</p>
                                    <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{presentDays}</p>
                                </div>
                                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                                    <p className="text-[9px] uppercase font-black text-red-400 tracking-wider">Absent / Missed</p>
                                    <p className="text-xl font-extrabold text-red-400 mt-0.5">{absentDays}</p>
                                </div>
                                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center">
                                    <p className="text-[9px] uppercase font-black text-blue-400 tracking-wider">Upcoming Days</p>
                                    <p className="text-xl font-extrabold text-blue-400 mt-0.5">{upcomingDays}</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-center col-span-2 sm:col-span-1">
                                    <p className="text-[9px] uppercase font-black text-primary tracking-wider">Attendance %</p>
                                    <p className="text-xl font-extrabold text-primary mt-0.5">{attendanceRate}%</p>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                                <span className="text-xs font-bold text-white/40">Filter:</span>
                                <button 
                                    onClick={() => setHistoryFilter('all')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        historyFilter === 'all' ? 'bg-primary text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                                >
                                    All Days ({totalDays})
                                </button>
                                <button 
                                    onClick={() => setHistoryFilter('present')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        historyFilter === 'present' ? 'bg-emerald-500 text-black' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                                >
                                    Present ({presentDays})
                                </button>
                                <button 
                                    onClick={() => setHistoryFilter('absent')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        historyFilter === 'absent' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    }`}
                                >
                                    Absent ({absentDays})
                                </button>
                                <button 
                                    onClick={() => setHistoryFilter('upcoming')}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        historyFilter === 'upcoming' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                                    }`}
                                >
                                    Upcoming ({upcomingDays})
                                </button>
                            </div>
                        </div>

                        {/* Register Table Body */}
                        <div className="p-4 overflow-y-auto flex-1">
                            {filteredRegister.length === 0 ? (
                                <p className="text-center text-white/40 py-12">No records matching selected filter.</p>
                            ) : (
                                <div className="border border-white/10 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black text-white/50 uppercase tracking-widest">
                                                <th className="p-3.5">Day & Date</th>
                                                <th className="p-3.5">Morning Pickup ({selectedSub.pickupTime})</th>
                                                <th className="p-3.5">Evening Return ({selectedSub.returnTime || 'N/A'})</th>
                                                <th className="p-3.5 text-right">Day Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-xs">
                                            {filteredRegister.map((day) => (
                                                <tr 
                                                    key={day.date} 
                                                    className={`hover:bg-white/[0.02] transition-colors ${day.isToday ? 'bg-primary/5' : ''}`}
                                                >
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="w-7 h-7 rounded-lg bg-white/5 text-white/70 font-bold flex items-center justify-center text-[10px] border border-white/10">
                                                                #{day.dayNumber}
                                                            </span>
                                                            <div>
                                                                <p className="font-bold text-white">{day.formattedDate}</p>
                                                                {day.isToday && (
                                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/20 px-1.5 py-0.5 rounded border border-primary/30">
                                                                        Today
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="p-3.5">
                                                        {day.goTrip.status === 'Completed' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                <FaCheckCircle size={11} /> Present ({day.goTrip.time})
                                                            </span>
                                                        ) : day.goTrip.status === 'Started' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                                                                <FaCar size={11} /> In Progress
                                                            </span>
                                                        ) : day.goTrip.status === 'Missed' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                                                <FaTimesCircle size={11} /> Absent (Missed)
                                                            </span>
                                                        ) : day.isPast ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                                                <FaTimesCircle size={11} /> Absent (No Show)
                                                            </span>
                                                        ) : day.isToday ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                                                <FaClock size={11} /> Scheduled Today
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-white/5 text-white/40 border border-white/10">
                                                                <FaClock size={11} /> Scheduled
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="p-3.5">
                                                        {!day.returnTrip ? (
                                                            <span className="text-white/30 text-[11px] italic">One-way Pass</span>
                                                        ) : day.returnTrip.status === 'Completed' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                <FaCheckCircle size={11} /> Present ({day.returnTrip.time})
                                                            </span>
                                                        ) : day.returnTrip.status === 'Started' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                                                                <FaCar size={11} /> In Progress
                                                            </span>
                                                        ) : day.returnTrip.status === 'Missed' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                                                <FaTimesCircle size={11} /> Absent (Missed)
                                                            </span>
                                                        ) : day.isPast ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                                                <FaTimesCircle size={11} /> Absent (No Show)
                                                            </span>
                                                        ) : day.isToday ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                                                <FaClock size={11} /> Scheduled Today
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-white/5 text-white/40 border border-white/10">
                                                                <FaClock size={11} /> Scheduled
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="p-3.5 text-right">
                                                        {day.dayStatus === 'Present' ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                <FaCheckCircle size={11} /> Present
                                                            </span>
                                                        ) : day.dayStatus === 'Half Day' ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                                Half Day
                                                            </span>
                                                        ) : day.dayStatus === 'In Progress' ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                                                                <FaCar size={11} /> In Progress
                                                            </span>
                                                        ) : day.dayStatus === 'Absent' ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs bg-red-500/15 text-red-400 border border-red-500/30">
                                                                <FaTimesCircle size={11} /> Absent
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-xs bg-white/5 text-white/40 border border-white/10">
                                                                Upcoming
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySubscriptions;
