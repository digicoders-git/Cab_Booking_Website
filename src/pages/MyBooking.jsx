import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaChevronRight, FaCheckCircle, FaHistory, FaTimesCircle,
  FaSpinner, FaUser, FaStar, FaShieldAlt, FaHeadset
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancel Booking?',
      input: 'text',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'e.g. Plan changed',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#111',
      confirmButtonText: 'Yes, Cancel it!',
      inputValidator: (value) => {
        if (!value) return 'Please provide a reason!';
      }
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
    return ['completed', 'cancelled'].includes(status);
  });

  // Status config for better UI
  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'completed') return { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-600', icon: FaCheckCircle, label: 'Completed' };
    if (s === 'cancelled') return { bg: 'bg-rose-500', bgLight: 'bg-rose-50', text: 'text-rose-600', icon: FaTimesCircle, label: 'Cancelled' };
    if (s === 'accepted') return { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', text: 'text-indigo-600', icon: FaShieldAlt, label: 'Driver Assigned' };
    if (s === 'ongoing') return { bg: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-600', icon: FaClock, label: 'On Trip' };
    return { bg: 'bg-sky-500', bgLight: 'bg-sky-50', text: 'text-sky-600', icon: FaClock, label: 'Pending' };
  };

  return (
    <div className="bg-gradient-to-br from-[#faf9ff] via-white to-[#fef9f0] min-h-screen font-sans">
      <PageHeader title="My Rides" subtitle="History of your journeys" />

      <div className="section-padding container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">

          {/* Modern Header with Glass Morphism */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl blur-xl opacity-40"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center text-black shadow-xl">
                  <FaHistory className="text-2xl" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Ride History
                  <span className="text-amber-500 ml-2">✨</span>
                </h3>
                <p className="text-gray-400 font-semibold text-[11px] uppercase tracking-widest mt-1">Manage your recent and upcoming trips</p>
              </div>
            </div>

            {/* Modern Tab Switcher */}
            <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-gray-100">
              {['Upcoming', 'Past Rides'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                      : 'text-gray-400 hover:text-gray-700'
                    }`}
                >
                  {tab === 'Upcoming' ? '📅 Upcoming' : '📜 Past Rides'}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full blur-2xl animate-pulse"></div>
                <FaSpinner className="relative text-amber-500 animate-spin text-5xl" />
              </div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Fetching your Journeys...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            /* Empty State - Modern Design */
            <div className="relative bg-white/50 backdrop-blur-sm p-16 rounded-[3rem] shadow-2xl text-center border border-white/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <FaTaxi className="text-gray-300 text-5xl" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-3 uppercase tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                  No {activeTab} rides found
                </h3>
                <p className="text-gray-400 text-sm mb-10 font-medium max-w-md mx-auto">
                  Ready to start your next journey? Book a ride now!
                </p>
                <Link to="/booking" className="inline-flex bg-gradient-to-r from-amber-400 to-amber-500 text-black px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-amber-400/30 hover:scale-105 transition-transform items-center gap-3 group">
                  <FaTaxi className="group-hover:rotate-12 transition-transform" />
                  Book Now
                  <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            /* Booking Cards List */
            <div className="space-y-6">
              <AnimatePresence mode='popLayout'>
                {filteredBookings.map((booking, index) => {
                  const status = (booking.bookingStatus || booking.status || 'Unknown').toLowerCase();
                  const pickupAddr = booking.pickup?.address || booking.pickupAddress || 'Address not found';
                  const dropAddr = booking.drop?.address || booking.dropAddress || 'Address not found';
                  const fare = booking.fareEstimate || booking.totalFare || 0;
                  const statusConfig = getStatusConfig(status);
                  const StatusIcon = statusConfig.icon;
                  const isCancelable = ['pending', 'accepted', 'ongoing', 'confirmed', 'driver_assigned'].includes(status);

                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                      className="group relative"
                    >
                      {/* Modern Card with Glass Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                      <div className="relative bg-white rounded-[2rem] shadow-xl border border-gray-100/80 hover:shadow-2xl transition-all duration-500 overflow-hidden">

                        {/* Animated Gradient Border Top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${status === 'completed' ? 'from-emerald-400 to-emerald-500' : status === 'cancelled' ? 'from-rose-400 to-rose-500' : 'from-amber-400 to-amber-500'}`}></div>

                        <div className="p-6 md:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                            {/* Left Section - Icon & Details */}
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-grow">
                              {/* Animated Icon Box */}
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-inner">
                                  <FaTaxi className="text-3xl" />
                                </div>
                              </div>

                              {/* Details */}
                              <div className="space-y-4 flex-grow">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    #{booking._id?.slice(-8).toUpperCase()}
                                  </span>
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${statusConfig.bgLight} ${statusConfig.text}`}>
                                    <StatusIcon className="text-[10px]" />
                                    {statusConfig.label}
                                  </span>
                                  <span className="bg-gradient-to-r from-gray-900 to-gray-800 text-amber-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                                    <HiSparkles className="text-[10px]" />
                                    {booking.rideType}
                                  </span>
                                </div>

                                {/* Location Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4 relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-300 before:to-gray-200 before:rounded-full">
                                    <div className="relative group/loc">
                                      <div className="absolute -left-[27px] top-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow-md group-hover/loc:scale-125 transition-transform"></div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-[8px]" /> FROM
                                      </p>
                                      <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-1">{pickupAddr}</h4>
                                    </div>
                                    <div className="relative group/loc">
                                      <div className="absolute -left-[27px] top-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full border-2 border-white shadow-md group-hover/loc:scale-125 transition-transform"></div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        📍 TO POINT
                                      </p>
                                      <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-1">{dropAddr}</h4>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex flex-col p-3 bg-gray-50 rounded-xl">
                                      <span className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                                        <FaCalendarAlt className="text-[8px]" /> DATE
                                      </span>
                                      <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
                                        <span>{new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </div>
                                    </div>
                                    {booking.assignedDriver && (
                                      <div className="flex flex-col p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                                        <span className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                                          <FaUser className="text-[8px]" /> DRIVER
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
                                          <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center">
                                            <FaUser className="text-[8px] text-indigo-600" />
                                          </div>
                                          <span>{booking.assignedDriver.name}</span>
                                          <div className="flex text-[8px] text-amber-400">
                                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Fare & Actions */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-5 border-t lg:border-t-0 pt-5 lg:pt-0 border-gray-100 min-w-[140px]">
                              <div className="text-left lg:text-right">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-1">
                                  <FaClock className="text-[8px]" /> TOTAL ESTIMATE
                                </div>
                                <div className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent italic tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                                  ₹{fare}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {isCancelable && (
                                  <motion.button
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-600 hover:text-white transition-all duration-300 shadow-sm group/btn"
                                    title="Cancel Ride"
                                  >
                                    <FaTimesCircle size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                  </motion.button>
                                )}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Link
                                    to={`/booking-details/${booking._id}`}
                                    className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl flex items-center justify-center hover:from-amber-400 hover:to-amber-500 hover:text-black transition-all duration-300 shadow-lg group/btn"
                                  >
                                    <FaChevronRight className="text-xs group-hover/btn:translate-x-0.5 transition-transform" />
                                  </Link>
                                </motion.div>
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
    </div>
  );
};

export default MyBooking;