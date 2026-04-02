import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhoneAlt, FaStar, FaCreditCard, FaCheckCircle, FaChevronLeft, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../config/api';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingDetail = async () => {
    if (!bookingId) {
       setLoading(false);
       return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error("Fetch Detail Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const handleCancelBooking = async () => {
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
          fetchBookingDetail(); // Refresh data
        } else {
          Swal.fire('Error', data.message || 'Failed to cancel.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Server connection failed.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-primary animate-spin text-5xl" />
        <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Loading Ride Details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
         <FaTimesCircle className="text-red-100 text-7xl mb-6" />
         <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">No Booking Data Found</h2>
         <p className="text-gray-400 text-sm max-w-sm mb-8">We couldn't retrieve the details for this ride. It might have been deleted or the ID is invalid.</p>
         <Link to="/my-booking" className="btn-primary">Back to My Rides</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <PageHeader title="Ride Details" subtitle={`Detailed information for booking #${booking._id?.slice(-8).toUpperCase()}`} />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          <Link to="/my-booking" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-black text-[10px] uppercase tracking-widest mb-10 transition-all group">
             <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to history
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             
             {/* Left: Journey Info */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border border-gray-100">
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FaTaxi /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Booking ID</span>
                            <h3 className="text-xl sm:text-2xl font-black text-[#111111] uppercase tracking-tighter">#{booking._id?.toUpperCase()}</h3>
                         </div>
                      </div>
                      <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                         {booking.status.replace('_', ' ')}
                      </div>
                   </div>

                   <div className="space-y-10 relative">
                      {/* Route Line */}
                      <div className="absolute left-[27px] top-[40px] bottom-[40px] w-0.5 bg-gray-50 border-l-2 border-dotted border-gray-200"></div>

                      <div className="flex gap-8 relative z-10">
                         <div className="w-14 h-14 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 shadow-lg shrink-0">
                            <FaMapMarkerAlt />
                         </div>
                         <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pickup Location</span>
                            <p className="text-base sm:text-lg font-bold text-[#111111] leading-tight">{booking.pickupAddress}</p>
                         </div>
                      </div>

                      <div className="flex gap-8 relative z-10">
                         <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center text-red-500 shadow-lg shrink-0">
                            <FaMapMarkerAlt />
                         </div>
                         <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Drop-off Destination</span>
                            <p className="text-base sm:text-lg font-bold text-[#111111] leading-tight">{booking.dropAddress}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 pt-10 border-t border-gray-100">
                      <div className="flex gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaCalendarAlt /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date</span>
                            <p className="font-bold text-[#111111]">{new Date(booking.pickupDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaClock /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Pickup Time</span>
                            <p className="font-bold text-[#111111]">{booking.pickupTime}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border border-gray-100">
                   <h4 className="text-xl font-black text-[#111111] uppercase tracking-tighter mb-8 italic">Driver & Vehicle</h4>
                   <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary bg-gray-100 flex items-center justify-center">
                            {booking.driverId ? (
                              <img src={`http://localhost:5000/uploads/${booking.driverId.image}`} alt="Driver" className="w-full h-full object-cover" />
                            ) : (
                              <FaUser className="text-gray-300 text-3xl" />
                            )}
                         </div>
                         <div>
                            <h5 className="text-xl font-black text-[#111111] uppercase tracking-tighter">
                              {booking.driverId ? booking.driverId.name : "Assigning Driver..."}
                            </h5>
                            <div className="flex items-center gap-1 text-primary text-sm mt-1">
                               {[...Array(5)].map((_, i) => <FaStar key={i} className={i < (booking.driverId?.rating || 0) ? "text-primary" : "text-gray-200"} />)}
                               <span className="text-gray-400 font-bold ml-2">({booking.driverId?.rating || '0.0'})</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <a href={`tel:${booking.driverId?.phone}`} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300 border border-gray-100"><FaPhoneAlt /></a>
                         <button className="px-8 bg-[#111111] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">Chat</button>
                      </div>
                   </div>
                   <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between border border-gray-100">
                      <div className="flex items-center gap-4">
                         <FaTaxi className="text-primary text-2xl" />
                         <span className="font-bold text-[#111111]">{booking.carCategoryId?.name || 'Cab'}</span>
                      </div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-1.5 bg-primary/10 rounded-full">{booking.rideType} Mode</span>
                   </div>
                   {booking.selectedSeats?.length > 0 && (
                     <div className="mt-4 p-4 border border-blue-100 bg-blue-50/30 rounded-2xl">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Booked Seats</p>
                        <div className="flex flex-wrap gap-2">
                           {booking.selectedSeats.map((s, i) => (
                             <span key={i} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 rounded-lg text-[10px] font-bold">{s}</span>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
             </div>

             {/* Right: Payment & Status */}
             <div className="space-y-8">
                <div className="bg-[#111111] p-10 rounded-[3rem] text-white shadow-2x-l relative overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mb-16 -mr-16"></div>
                   <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4 uppercase tracking-tighter">Fare Summary</h4>
                   <div className="space-y-5">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Distance</span>
                         <span className="font-black text-primary">{booking.distanceKm} KM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Base Fare</span>
                         <span className="font-black">₹{booking.carCategoryId?.baseFare || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Rate / KM</span>
                         <span className="font-black">₹{booking.rideType === 'Shared' ? booking.carCategoryId?.sharedRatePerSeatPerKm : booking.carCategoryId?.privateRatePerKm}</span>
                      </div>
                      <div className="pt-6 border-t border-white/10 mt-6 md:mt-10">
                         <div className="flex justify-between items-baseline mb-8">
                            <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Total Amount</span>
                            <span className="text-4xl font-black text-primary">₹{booking.totalFare}</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <FaCreditCard className="text-primary text-xl" />
                            <div>
                               <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Payment Status</span>
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">{booking.paymentStatus}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center">
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${booking.status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      {booking.status === 'cancelled' ? <FaTimesCircle className="text-3xl" /> : <FaCheckCircle className="text-3xl" />}
                   </div>
                   <h4 className="text-lg font-black text-[#111111] uppercase tracking-tighter mb-2">
                     {booking.status === 'cancelled' ? 'Ride Cancelled' : 'Ride Verified'}
                   </h4>
                   <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8">
                     {booking.status === 'cancelled' ? 'This booking was cancelled. If you didn\'t do this, please contact support.' : 'Everything is set for your journey. Please be ready at the pickup point 5 mins before time.'}
                   </p>
                   {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'driver_assigned') && (
                     <button 
                      onClick={handleCancelBooking}
                      className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95"
                     >
                        Cancel Booking
                     </button>
                   )}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
