import { motion } from 'framer-motion';
import { FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhoneAlt, FaStar, FaCreditCard, FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const BookingDetails = () => {
  const booking = {
    id: 'TX-7744321',
    status: 'Upcoming',
    date: '12 March 2026',
    time: '04:30 PM',
    pickup: 'Downtown Hotel, Luxury Suite 402',
    destination: 'International Airport, Terminal 1',
    vehicle: 'Toyota Camry (Premium White)',
    driver: 'Jack Sparrow',
    driverRating: 4.9,
    baseFare: '₹120.00',
    serviceFee: '₹4.00',
    totalFare: '₹124.00',
    paymentMethod: 'Visa Ending in •••• 4412'
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <PageHeader title="Booking Details" subtitle="Detailed breakdown of your scheduled journey" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          <Link to="/my-booking" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-black text-xs uppercase tracking-widest mb-10 transition-colors">
             <FaChevronLeft /> Back to list
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             
             {/* Left: Journey Info */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[50px] shadow-xl border border-gray-100">
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FaTaxi /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Booking ID</span>
                            <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tighter">{booking.id}</h3>
                         </div>
                      </div>
                      <div className="px-6 py-2 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {booking.status}
                      </div>
                   </div>

                   <div className="space-y-10 relative">
                      {/* Route Line */}
                      <div className="absolute left-[27px] top-[40px] bottom-[40px] w-0.5 bg-gray-100 border-l-2 border-dotted border-gray-200"></div>

                      <div className="flex gap-8 relative z-10">
                         <div className="w-14 h-14 bg-white border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-lg shrink-0">
                            <FaMapMarkerAlt />
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pickup Location</span>
                            <p className="text-lg font-bold text-[#111111]">{booking.pickup}</p>
                         </div>
                      </div>

                      <div className="flex gap-8 relative z-10">
                         <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center text-primary shadow-lg shrink-0">
                            <FaMapMarkerAlt />
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Drop-off Destination</span>
                            <p className="text-lg font-bold text-[#111111]">{booking.destination}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 pt-10 border-t border-gray-50">
                      <div className="flex gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaCalendarAlt /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date</span>
                            <p className="font-bold text-[#111111]">{booking.date}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaClock /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Pickup Time</span>
                            <p className="font-bold text-[#111111]">{booking.time}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[50px] shadow-xl border border-gray-100">
                   <h4 className="text-xl font-black text-[#111111] uppercase tracking-tighter mb-8">Driver & Vehicle</h4>
                   <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary">
                            <img src="https://images.unsplash.com/photo-1544168190-79c175319808?auto=format&fit=crop&q=80&w=200" alt="Driver" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h5 className="text-xl font-black text-[#111111] uppercase tracking-tighter">{booking.driver}</h5>
                            <div className="flex items-center gap-1 text-primary text-sm mt-1">
                               {[...Array(5)].map((_, i) => <FaStar key={i} className={i < 4 ? "text-primary" : "text-gray-200"} />)}
                               <span className="text-gray-400 font-bold ml-2">({booking.driverRating})</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300 shadow-sm"><FaPhoneAlt /></button>
                         <button className="px-8 bg-[#111111] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all duration-300 shadow-lg">Chat</button>
                      </div>
                   </div>
                   <div className="mt-8 p-6 bg-gray-50 rounded-3xl flex items-center justify-between border border-gray-100">
                      <div className="flex items-center gap-4">
                         <FaTaxi className="text-primary text-2xl" />
                         <span className="font-bold text-[#111111]">{booking.vehicle}</span>
                      </div>
                      <span className="text-xs font-black text-primary uppercase tracking-widest">Verified Vehicle</span>
                   </div>
                </div>
             </div>

             {/* Right: Payment & Status */}
             <div className="space-y-8">
                <div className="bg-[#111111] p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mb-16 -mr-16"></div>
                   <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4 uppercase tracking-tighter">Fare Details</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Base Fare</span>
                         <span className="font-black">{booking.baseFare}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Service Fee</span>
                         <span className="font-black">{booking.serviceFee}</span>
                      </div>
                      <div className="pt-6 border-t border-white/10 mt-6 md:mt-10">
                         <div className="flex justify-between items-baseline mb-8">
                            <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Total Paid</span>
                            <span className="text-4xl font-black text-primary">{booking.totalFare}</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                            <FaCreditCard className="text-primary" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{booking.paymentMethod}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[50px] shadow-xl border border-gray-100 text-center">
                   <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-3xl" />
                   </div>
                   <h4 className="text-lg font-black text-[#111111] uppercase tracking-tighter mb-2">Ride Verified</h4>
                   <p className="text-gray-400 text-sm font-medium mb-8">Everything is set for your upcoming journey. We will remind you 30 minutes before pickup.</p>
                   <button className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300">
                      Cancel Booking
                   </button>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
