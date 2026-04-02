import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChevronRight, FaCheckCircle, FaHistory, FaTimesCircle, FaSpinner } from 'react-icons/fa';
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
          fetchBookings(); // Refresh list
        } else {
          Swal.fire('Error', data.message || 'Failed to cancel.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Server connection failed.', 'error');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!b || !b.status) return false;
    const status = b.status.toLowerCase();
    if (activeTab === 'Upcoming') return status === 'pending' || status === 'confirmed' || status === 'driver_assigned';
    return status === 'completed' || status === 'cancelled';
  });

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans">
      <PageHeader title="My Rides" subtitle="History of your KwibCabs journeys" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-[#111111] shadow-xl shadow-primary/20">
                   <FaHistory className="text-2xl" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>Ride History</h3>
                   <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Manage your recent and upcoming trips</p>
                </div>
             </div>

             <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                {['Upcoming', 'Past Rides'].map(tab => (
                   <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-white shadow-md text-[#111111]' : 'text-gray-400 hover:text-[#111111]'
                    }`}
                   >
                     {tab}
                   </button>
                ))}
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <FaSpinner className="text-primary animate-spin text-4xl" />
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Searching your journeys...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTaxi className="text-gray-200 text-3xl" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">No {activeTab} rides found</h3>
               <p className="text-gray-400 text-sm mb-8">Ready to start your next journey? Book a KwibCab now!</p>
               <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                 Book Now <FaChevronRight />
               </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode='popLayout'>
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-grow">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300">
                          <FaTaxi className="text-2xl" />
                        </div>
                        
                        <div className="space-y-3 flex-grow">
                          <div className="flex flex-wrap items-center gap-3">
                              <span className="text-base font-black text-[#111111] uppercase tracking-tighter">#{booking._id?.slice(-8).toUpperCase()}</span>
                              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {(booking.status || 'Unknown').replace('_', ' ')}
                              </span>
                              <span className="bg-gray-100 px-3 py-1 rounded-lg text-[9px] font-bold text-gray-500 uppercase">{booking.rideType}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-start gap-2.5">
                                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                                <div>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">From: <span className="text-gray-800">{(booking.pickupAddress || 'Address').split(',')[0]}</span></p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mt-1">To: <span className="text-gray-800">{(booking.dropAddress || 'Address').split(',')[0]}</span></p>
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                  <FaCalendarAlt className="text-primary text-[10px]" />
                                  <span className="text-[11px]">{new Date(booking.pickupDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                  <FaClock className="text-primary text-[10px]" />
                                  <span className="text-[11px]">{booking.pickupTime}</span>
                                </div>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                        <div className="text-left lg:text-right">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Fare</div>
                          <div className="text-xl font-black text-green-600 italic tracking-tighter">₹{booking.totalFare || 0}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'driver_assigned') && (
                             <button 
                              onClick={() => handleCancelBooking(booking._id)}
                              className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              title="Cancel Ride"
                             >
                               <FaTimesCircle />
                             </button>
                           )}
                           <Link 
                            to="/booking-details"
                            state={{ bookingId: booking._id }}
                            className="w-10 h-10 bg-[#111111] text-white rounded-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                           >
                            <FaChevronRight className="text-xs" />
                           </Link>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-16 text-center">
             <Link to="/booking" className="bg-primary text-[#111111] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:bg-[#111111] hover:text-white transition-all transform hover:scale-105 active:scale-95 inline-block">
                Start A New Journey
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyBooking;
