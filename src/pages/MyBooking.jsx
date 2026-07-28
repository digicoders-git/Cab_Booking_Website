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
import RateDriverModal from '../components/RateDriverModal';
import { FaStar } from 'react-icons/fa';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#111',
  color: '#fff'
});

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [fixedBookings, setFixedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [rateModalBooking, setRateModalBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [response, fixedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings/my-bookings`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/fixed-routes/bookings/my-bookings`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const data = await response.json();
      const fixedData = await fixedRes.json();
      
      if (data.success) setBookings(data.bookings || []);
      if (fixedData.success) setFixedBookings(fixedData.bookings || []);
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
    
    // 🔥 Re-join room on every reconnect!
    socket.on('connect', () => {
      console.log('Socket Connected! Joining room for user:', userId);
      socket.emit('join_room', { userId, role: userRole });
    });

    socket.on('booking_update', () => fetchBookings());
    socket.on('fixedBookingPaymentSuccess', () => fetchBookings());
    
    // Specific events for Toasts
    socket.on('fixedBookingAccepted', () => {
      Toast.fire({ icon: 'success', title: 'A driver has accepted your package ride!' });
      fetchBookings();
    });
    socket.on('fixedBookingStarted', () => {
      Toast.fire({ icon: 'info', title: '🚖 Your package ride has started!' });
      fetchBookings();
    });
    socket.on('fixedBookingCompleted', () => {
      Swal.fire({
        title: 'Ride Completed', 
        text: 'Your package ride is complete. Please pay if pending.', 
        icon: 'success',
        background: '#111',
        color: '#fff'
      });
      fetchBookings();
    });
    socket.on('fixedBookingCancelled', () => {
      Toast.fire({ icon: 'error', title: 'Your package ride was cancelled.' });
      fetchBookings();
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      Swal.fire('Success', 'Payment completed successfully!', 'success');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCancelBooking = async (bookingId, isPackageBooking = false) => {
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
        const url = isPackageBooking 
          ? `${API_BASE_URL}/fixed-routes/bookings/${bookingId}/cancel`
          : `${API_BASE_URL}/bookings/cancel/${bookingId}`;
          
        const res = await fetch(url, {
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

  const handlePayment = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/fixed-routes/bookings/${bookingId}/pay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        return Swal.fire('Error', data.message || 'Failed to initialize payment', 'error');
      }

      if (data.session && data.session.payment_links && data.session.payment_links.web) {
          window.location.href = data.session.payment_links.web;
      } else {
          Swal.fire('Error', 'Invalid payment link from server', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed', 'error');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!b) return false;
    const status = (b.bookingStatus || b.status || '').toLowerCase().trim();
    if (activeTab === 'Upcoming') {
      return ['pending', 'accepted', 'ongoing', 'confirmed', 'driver_assigned', 'accepted_by_driver'].includes(status);
    } else if (activeTab === 'Past Rides') {
      return ['completed', 'cancelled', 'expired', 'rejected', 'timeout'].includes(status);
    }
    return false;
  });

  const filteredFixedBookings = fixedBookings.filter(b => {
    if (!b) return false;
    const status = (b.status || '').toLowerCase().trim();
    if (activeTab === 'Upcoming Packages') {
      return ['marketplace', 'accepted', 'started'].includes(status);
    } else if (activeTab === 'Past Packages') {
      return ['completed', 'cancelled'].includes(status);
    }
    return false;
  });

  const displayBookings = activeTab.includes('Packages') ? filteredFixedBookings : filteredBookings;

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'completed') return { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', strip: 'bg-emerald-500', icon: FaCheckCircle, label: 'Completed' };
    if (s === 'cancelled') return { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', strip: 'bg-red-500', icon: FaTimesCircle, label: 'Cancelled' };
    if (s === 'accepted' || s === 'driver_assigned') return { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', strip: 'bg-primary', icon: FaShieldAlt, label: 'Accepted' };
    if (s === 'started') return { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', strip: 'bg-green-500', icon: FaClock, label: 'Trip Live 🚀' };
    if (s === 'ongoing') return { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', strip: 'bg-amber-500', icon: FaClock, label: 'Trip Live' };
    if (s === 'marketplace') return { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', strip: 'bg-blue-500', icon: FaClock, label: 'Finding Driver' };
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
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Total Bookings: {bookings.length + fixedBookings.length}</p>
            </div>
          </div>
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 flex-wrap gap-1 justify-center">
            {['Upcoming', 'Past Rides', 'Upcoming Packages', 'Past Packages'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
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
        ) : displayBookings.length === 0 ? (
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
              {displayBookings.map((booking, index) => {
                const sc = getStatusConfig(booking.bookingStatus || booking.status || 'pending');
                const StatusIcon = sc.icon;
                const isPackage = activeTab.includes('Packages');
                // For packages: use finalPrice if extra charges were applied, else use base price
                const fare = Math.round(
                  (isPackage && booking.finalPrice > 0)
                    ? booking.finalPrice
                    : (booking.actualFare || booking.fareEstimate || booking.price || 0)
                );

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
                            {isPackage ? (booking.tripType || 'One-Way') + ' Package' : (booking.rideType || booking.carCategory?.name || 'Ride')}
                          </span>
                          {/* OTP: Show for normal rides AND for package rides when trip is not yet started */}
                          {!isPackage && (
                            <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <FaFingerprint size={9} /> OTP: {booking.tripData?.startOtp || booking.otp || '---'}
                            </span>
                          )}
                          {isPackage && booking.startOtp && ['marketplace', 'accepted', 'started'].includes((booking.status || '').toLowerCase()) && (
                            <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <FaFingerprint size={9} /> Start OTP: {booking.startOtp}
                            </span>
                          )}
                          {isPackage && booking.maxTimeHours > 0 && (
                            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                              ⏱ {booking.maxTimeHours}h Limit | +₹{booking.extraTimeChargePerHour}/hr extra
                            </span>
                          )}
                          {isPackage && booking.extraTimeCharges > 0 && (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                              Extra Charges: +₹{booking.extraTimeCharges}
                            </span>
                          )}
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
                                {isPackage ? booking.pickupLocation : (booking.pickupAddress || booking.pickup?.address)}
                              </p>
                            </div>
                            <div className="relative">
                              <FaMapMarkerAlt className="absolute -left-[25px] top-1 text-red-500 text-[10px] bg-[#0d0d0d]" />
                              <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-0.5">Destination</p>
                              <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                                {isPackage ? booking.dropLocation : (booking.dropAddress || booking.drop?.address)}
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
                              <span className="text-white font-bold text-xs flex flex-col gap-1">
                                <span>{new Date(isPackage ? booking.pickupDate : booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {isPackage && <span className="text-white/60 text-[10px]">{booking.pickupTime}</span>}
                              </span>
                            </div>
                          </div>

                          {/* Fare */}
                          <div className="lg:border-l lg:border-white/5 lg:pl-6">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Fare</p>
                            <span className="text-primary font-black text-3xl tracking-tighter">₹{fare}</span>
                            {isPackage && booking.extraTimeCharges > 0 && (
                              <p className="text-orange-400 text-[9px] font-black mt-0.5">
                                Base ₹{booking.price} + Extra ₹{booking.extraTimeCharges}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Row 3 — Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-white/5">
                          {['pending', 'accepted', 'ongoing', 'marketplace'].includes((booking.bookingStatus || booking.status || '').toLowerCase()) && (
                            <button
                              onClick={() => handleCancelBooking(booking._id, isPackage)}
                              className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          {isPackage && ['marketplace', 'accepted'].includes((booking.status || '').toLowerCase()) && (
                            <span className="px-5 py-2.5 rounded-xl border border-yellow-500/20 text-yellow-500/60 font-black text-[9px] uppercase tracking-widest mr-auto">
                              Package Confirmed
                            </span>
                          )}
                          {isPackage && (booking.status || '').toLowerCase() === 'completed' && booking.paymentMethod === 'Online' && booking.paymentStatus === 'Pending' && (
                            <button
                              onClick={() => handlePayment(booking._id)}
                              className="px-6 py-2.5 rounded-xl bg-green-500 text-black hover:bg-green-400 font-black text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2 mr-auto animate-pulse"
                            >
                              Pay ₹{fare} Now
                            </button>
                          )}
                          {isPackage && (booking.status || '').toLowerCase() === 'completed' && booking.paymentMethod === 'Online' && booking.paymentStatus === 'Completed' && (
                            <span className="px-5 py-2.5 rounded-xl border border-green-500/20 text-green-500 font-black text-[9px] uppercase tracking-widest mr-auto flex items-center gap-2">
                              <FaCheckCircle /> Paid Online
                            </span>
                          )}
                          {!isPackage && (booking.bookingStatus || booking.status || '').toLowerCase() === 'completed' && !booking.driverRating && (
                            <button
                                onClick={() => setRateModalBooking(booking._id)}
                                className="px-5 py-2.5 rounded-xl bg-primary text-black hover:bg-yellow-400 font-black text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(250,205,22,0.3)] transition-all flex items-center gap-2"
                            >
                                <FaStar /> Rate Driver
                            </button>
                          )}
                          {!isPackage && (booking.bookingStatus || booking.status || '').toLowerCase() === 'completed' && booking.driverRating && (
                            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                <FaStar className="text-primary text-[10px]" /> Rated {booking.driverRating}/5
                            </div>
                          )}
                          {!isPackage && (
                            <Link
                              to={`/booking-details/${booking._id}`}
                              className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-black text-white/70 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-white/5 hover:border-primary group"
                            >
                              View Details <FaChevronRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          )}
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

      <RateDriverModal 
        isOpen={!!rateModalBooking}
        bookingId={rateModalBooking}
        onClose={() => setRateModalBooking(null)}
        onSuccess={() => {
          setRateModalBooking(null);
          fetchBookings();
        }}
      />
    </div>
  );
};

export default MyBooking;
