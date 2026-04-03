import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaChevronRight, FaCheckCircle, FaHistory, FaTimesCircle,
  FaSpinner, FaUser, FaStar, FaShieldAlt, FaArrowRight, FaDotCircle, FaFingerprint
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId') || storedUser?._id;
    const userRole = localStorage.getItem('role') || (storedUser?._id ? 'user' : 'user');

    if (!userId) return;

    const backendServer = API_BASE_URL.replace('/api', '');
    const socket = io(backendServer);

    socket.emit('join_room', { userId, role: userRole });

    socket.on('booking_update', (data) => {
        console.log("Real-time list update received 🔔", data.status);
        fetchBookings(); // Refresh the list
    });

    return () => socket.disconnect();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancel Booking?',
      input: 'text',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'e.g. Plan changed',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
    });

    if (reason) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire('Cancelled!', 'Your ride has been cancelled.', 'success');
          fetchBookings();
        } else {
          Swal.fire('Error', data.message || 'Failed to cancel.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Server connection failed.', 'error');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!b) return false;
    const status = (b.bookingStatus || b.status || '').toLowerCase();
    if (activeTab === 'Upcoming') {
      return ['pending', 'accepted', 'ongoing', 'confirmed', 'driver_assigned'].includes(status);
    }
    return ['completed', 'cancelled', 'expired'].includes(status);
  });

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'completed') return { 
        bg: 'bg-emerald-500/10 border-emerald-500/20', 
        text: 'text-emerald-500', 
        icon: FaCheckCircle, 
        label: 'Completed' 
    };
    if (s === 'cancelled') return { 
        bg: 'bg-red-500/10 border-red-500/20', 
        text: 'text-red-500', 
        icon: FaTimesCircle, 
        label: 'Cancelled' 
    };
    if (s === 'accepted' || s === 'driver_assigned') return { 
        bg: 'bg-primary/10 border-primary/20', 
        text: 'text-primary', 
        icon: FaShieldAlt, 
        label: 'Accepted' 
    };
    if (s === 'ongoing') return { 
        bg: 'bg-amber-500/10 border-amber-500/20', 
        text: 'text-amber-500', 
        icon: FaClock, 
        label: 'Trip Live' 
    };
    if (s === 'expired') return { 
        bg: 'bg-gray-500/10 border-gray-500/20', 
        text: 'text-gray-500', 
        icon: FaHistory, 
        label: 'Expired' 
    };
    return { 
        bg: 'bg-primary/10 border-primary/20', 
        text: 'text-primary', 
        icon: FaSpinner, 
        label: 'Processing...' 
    };
  };

  return (
    <div className="bg-[#060606] min-h-screen text-white pt-[140px] pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section - Dashboard Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 px-4">
          <div className="space-y-4">
            <h1 className="text-white font-black text-2xl sm:text-3xl uppercase tracking-widest leading-none">
              Ride History
            </h1>
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Total Journeys: {bookings.length}</p>
            </div>
          </div>

          {/* Tab Switcher - Segmented Style */}
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            {['Upcoming', 'Past Rides'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab 
                    ? 'bg-primary text-black shadow-xl shadow-primary/10' 
                    : 'text-white/20 hover:text-white/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Action Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <FaTaxi className="relative text-primary animate-bounce text-5xl" />
            </div>
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Trips...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] p-24 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full" />
            <div className="relative z-10 font-sans">
              <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-inner">
                <FaHistory className="text-white/10 text-5xl" />
              </div>
              <h3 className="text-white font-black text-2xl mb-3 uppercase tracking-wider">Empty History</h3>
              <p className="text-white/20 text-xs mb-12 max-w-xs mx-auto font-black uppercase tracking-[0.3em] leading-relaxed">No {activeTab} journeys found on your account yet.</p>
              <Link to="/" className="inline-flex items-center gap-4 bg-primary text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-2xl shadow-primary/20 active:scale-95 group">
                <FaTaxi className="group-hover:translate-x-1 transition-transform" /> 
                Start Booking
                <FaArrowRight className="text-[8px] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 px-2">
            <AnimatePresence mode='popLayout'>
              {filteredBookings.map((booking, index) => {
                const statusConfig = getStatusConfig(booking.bookingStatus || booking.status || 'pending');
                const StatusIcon = statusConfig.icon;
                const fareValue = Math.round(booking.totalFare || booking.fareEstimate || 0);

                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden shadow-2xl">
                      <div className="p-6 sm:p-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                          
                          {/* Info Column */}
                          <div className="flex-1 w-full space-y-8">
                             <div className="flex flex-wrap items-center gap-4">
                               <span className={`px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text}`}>
                                 <StatusIcon size={10} className={statusConfig.label === 'Processing...' ? 'animate-spin' : ''} /> {statusConfig.label}
                               </span>
                               <span className="bg-white/5 text-primary/80 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">
                                 {booking.rideType || booking.carCategory?.name || "Ride"}
                               </span>
                               <span className="bg-cyan-500/15 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 flex items-center gap-2 shadow-lg shadow-cyan-500/5">
                                 <FaFingerprint className="text-cyan-500 text-[12px]" /> OTP: {booking.tripData?.startOtp || booking.otp || "---"}
                               </span>
                               <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">ID: #{booking._id?.slice(-8).toUpperCase()}</span>
                             </div>

                             {/* Location Details */}
                             <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5 before:border-dashed before:border-l">
                               <div className="relative">
                                  <FaDotCircle className="absolute -left-[31px] top-1 text-primary text-[10px] p-0.5 bg-[#0a0a0a]" />
                                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1 italic">Pickup</p>
                                  <h4 className="text-white font-bold text-sm leading-tight line-clamp-1">{booking.pickupAddress || booking.pickup?.address}</h4>
                               </div>
                               <div className="relative">
                                  <FaMapMarkerAlt className="absolute -left-[31px] top-1 text-red-500 text-[10px] p-0.5 bg-[#0a0a0a]" />
                                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1 italic">Destination</p>
                                  <h4 className="text-white font-bold text-sm leading-tight line-clamp-1">{booking.dropAddress || booking.drop?.address}</h4>
                               </div>
                             </div>
                          </div>

                          {/* Data Column */}
                          <div className="grid grid-cols-2 lg:flex items-center gap-6 lg:gap-14 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-white/5">
                             {booking.assignedDriver && (
                               <div>
                                 <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Driver</p>
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary text-xs border border-white/10">
                                      <FaUser />
                                   </div>
                                   <div>
                                      <h4 className="text-white font-bold text-[11px] uppercase leading-none">{booking.assignedDriver.name}</h4>
                                      <div className="flex text-[7px] text-primary mt-1">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                      </div>
                                   </div>
                                 </div>
                               </div>
                             )}
                             <div>
                               <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Ride Date</p>
                               <div className="flex items-center gap-2">
                                 <FaCalendarAlt className="text-primary text-xs" />
                                 <span className="text-white font-bold text-xs uppercase italic">{new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               </div>
                             </div>
                             <div>
                               <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Total Fare</p>
                               <h2 className="text-primary font-black text-3xl tracking-tighter italic">₹{fareValue}</h2>
                             </div>
                             
                             {/* CTA Actions */}
                             <div className="col-span-2 lg:col-auto">
                               <Link 
                                 to={`/booking-details/${booking._id}`}
                                 className="flex items-center justify-center gap-3 bg-white/5 hover:bg-primary hover:text-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all group"
                               >
                                 Details <FaChevronRight size={8} className="group-hover:translate-x-1 transition-transform" />
                               </Link>
                             </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;