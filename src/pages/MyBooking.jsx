import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaChevronRight, FaCheckCircle, FaHistory, FaTimesCircle,
  FaSpinner, FaUser, FaShieldAlt, FaArrowRight, FaDotCircle, FaFingerprint
} from 'react-icons/fa';
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
      const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('--- ALL BOOKINGS FROM BACKEND ---', data.bookings);
      if (data.success) setBookings(data.bookings || []);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId') || storedUser?._id;
    const userRole = localStorage.getItem('role') || 'user';
    if (!userId) return;
    const socket = io(API_BASE_URL.replace('/api', ''));
    socket.emit('join_room', { userId, role: userRole });
    socket.on('booking_update', () => fetchBookings());
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
      background: '#111', color: '#fff'
    });
    if (reason) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/cancel/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Cancelled!', 'Your ride has been cancelled.', 'success');
          fetchBookings();
        } else {
          Swal.fire('Error', data.message || 'Failed to cancel.', 'error');
        }
      } catch {
        Swal.fire('Error', 'Server connection failed.', 'error');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!b) return false;
    // Map status from potential fields and lowercase it
    const status = (b.bookingStatus || b.status || '').toLowerCase().trim();

    if (activeTab === 'Upcoming') {
      return ['pending', 'accepted', 'ongoing', 'confirmed', 'driver_assigned', 'accepted_by_driver'].includes(status);
    } else {
      // Past Rides: Completed, Cancelled, Expired
      return ['completed', 'cancelled', 'expired', 'rejected', 'timeout'].includes(status);
    }
  });

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'completed') return { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', strip: 'bg-emerald-500', icon: FaCheckCircle, label: 'Completed' };
    if (s === 'cancelled') return { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', strip: 'bg-red-500', icon: FaTimesCircle, label: 'Cancelled' };
    if (s === 'accepted' || s === 'driver_assigned') return { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', strip: 'bg-primary', icon: FaShieldAlt, label: 'Accepted' };
    if (s === 'ongoing') return { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', strip: 'bg-amber-500', icon: FaClock, label: 'Trip Live' };
    if (s === 'expired') return { bg: 'bg-gray-500/10 border-gray-500/20', text: 'text-gray-400', strip: 'bg-gray-500', icon: FaHistory, label: 'Expired' };
    return { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', strip: 'bg-primary', icon: FaSpinner, label: 'Processing...' };
  };

  return (
    <div className="bg-[#060606] min-h-screen text-white pb-24">
      <PageHeader title="My Bookings" breadcrumb="My Bookings" />

      <div className="container mx-auto px-4 max-w-7xl mt-14">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h2 className="text-white font-black text-2xl uppercase tracking-widest">Ride History</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Total Journeys: {bookings.length}</p>
            </div>
          </div>
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5">
            {['Upcoming', 'Past Rides'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-primary text-black' : 'text-white/20 hover:text-white/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <FaTaxi className="text-primary text-5xl animate-bounce" />
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Trips...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] p-20 rounded-[3rem] border border-white/5 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
              <FaHistory className="text-white/10 text-4xl" />
            </div>
            <h3 className="text-white font-black text-xl mb-2 uppercase tracking-wider">No Rides Found</h3>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-10">No {activeTab} journeys on your account yet.</p>
            <Link to="/" className="inline-flex items-center gap-3 bg-primary text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all">
              <FaTaxi /> Start Booking <FaArrowRight size={9} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking, index) => {
                const sc = getStatusConfig(booking.bookingStatus || booking.status || 'pending');
                const StatusIcon = sc.icon;
                const fare = Math.round(booking.totalFare || booking.fareEstimate || 0);

                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <div className="bg-[#0d0d0d] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">

                      {/* Status color strip */}
                      <div className={`h-[3px] w-full ${sc.strip}`} />

                      <div className="p-6 sm:p-8">

                        {/* Row 1 — Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                            <StatusIcon size={9} className={sc.label === 'Processing...' ? 'animate-spin' : ''} />
                            {sc.label}
                          </span>
                          <span className="bg-white/5 border border-white/5 text-primary/70 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {booking.rideType || booking.carCategory?.name || 'Ride'}
                          </span>
                          <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <FaFingerprint size={9} /> OTP: {booking.tripData?.startOtp || booking.otp || '---'}
                          </span>
                          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest sm:ml-auto">
                            #{booking._id?.slice(-8).toUpperCase()}
                          </span>
                        </div>

                        {/* Row 2 — Route + Info + Fare */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-6 items-start">

                          {/* Route */}
                          <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                            <div className="relative">
                              <FaDotCircle className="absolute -left-[25px] top-1 text-primary text-[10px] bg-[#0d0d0d]" />
                              <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-0.5">Pickup</p>
                              <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                                {booking.pickupAddress || booking.pickup?.address}
                              </p>
                            </div>
                            <div className="relative">
                              <FaMapMarkerAlt className="absolute -left-[25px] top-1 text-red-500 text-[10px] bg-[#0d0d0d]" />
                              <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-0.5">Destination</p>
                              <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                                {booking.dropAddress || booking.drop?.address}
                              </p>
                            </div>
                          </div>

                          {/* Driver */}
                          {booking.assignedDriver && (
                            <div className="lg:border-l lg:border-white/5 lg:pl-6">
                              <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Driver</p>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                                  {booking.assignedDriver.image ? (
                                    <img 
                                      src={`${API_BASE_URL.replace('/api', '')}/uploads/${booking.assignedDriver.image}`} 
                                      alt="Driver" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                                    />
                                  ) : (
                                    <FaUser size={12} />
                                  )}
                                </div>
                                <span className="text-white font-bold text-xs uppercase">{booking.assignedDriver.name}</span>
                              </div>
                            </div>
                          )}

                          {/* Date */}
                          <div className="lg:border-l lg:border-white/5 lg:pl-6">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Ride Date</p>
                            <div className="flex items-center gap-1.5">
                              <FaCalendarAlt className="text-primary text-[10px]" />
                              <span className="text-white font-bold text-xs">
                                {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Fare */}
                          <div className="lg:border-l lg:border-white/5 lg:pl-6">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Fare</p>
                            <span className="text-primary font-black text-3xl tracking-tighter">₹{fare}</span>
                          </div>
                        </div>

                        {/* Row 3 — Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-white/5">
                          {['pending', 'accepted', 'ongoing'].includes((booking.bookingStatus || booking.status || '').toLowerCase()) && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <Link
                            to={`/booking-details/${booking._id}`}
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-black text-white/70 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-white/5 hover:border-primary group"
                          >
                            View Details <FaChevronRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                          </Link>
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
