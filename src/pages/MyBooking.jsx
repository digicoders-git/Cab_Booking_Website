import { motion } from 'framer-motion';
import { FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChevronRight, FaCheckCircle, FaHistory } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const MyBooking = () => {
  const bookings = [
    {
      id: 'TX-7744321',
      date: '12 March 2026',
      time: '04:30 PM',
      pickup: 'Downtown Hotel',
      destination: 'International Airport',
      status: 'upcoming',
      fare: '₹124.00'
    },
    {
      id: 'TX-7744111',
      date: '10 March 2026',
      time: '10:00 AM',
      pickup: 'City Mall',
      destination: 'Central Station',
      status: 'completed',
      fare: '₹45.00'
    },
    {
      id: 'TX-7744005',
      date: '08 March 2026',
      time: '08:15 PM',
      pickup: 'Opera House',
      destination: 'East Side Appts',
      status: 'completed',
      fare: '₹32.00'
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans">
      <PageHeader title="My Bookings" subtitle="Track and manage your Taxica journeys" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-[#111111] shadow-xl">
                   <FaHistory className="text-2xl" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tighter">Ride History</h3>
                   <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Manage your recent and upcoming trips</p>
                </div>
             </div>

             <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                <button className="px-8 py-3 bg-white rounded-xl shadow-md font-black text-xs uppercase tracking-widest text-[#111111]">Upcoming</button>
                <button className="px-8 py-3 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors">Past Rides</button>
             </div>
          </div>

          <div className="space-y-6">
             {bookings.map((booking, index) => (
               <motion.div
                 key={booking.id}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-white p-5 sm:p-8 rounded-[40px] shadow-xl border border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-primary/20 transition-all duration-300"
               >
                 <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center flex-grow">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300 border border-gray-100">
                       <FaTaxi className="text-3xl" />
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                       <div className="flex flex-wrap items-center gap-4">
                          <span className="text-lg font-black text-[#111111] uppercase tracking-tighter">{booking.id}</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            booking.status === 'upcoming' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                             {booking.status}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          <div className="flex items-center gap-3 text-gray-500 font-medium">
                             <FaMapMarkerAlt className="text-primary" />
                             <span className="text-sm">{booking.pickup} ➟ {booking.destination}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500 font-medium">
                             <FaCalendarAlt className="text-primary" />
                             <span className="text-sm">{booking.date} at {booking.time}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-100">
                    <div className="text-right">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fare Amount</div>
                       <div className="text-2xl font-black text-[#111111]">{booking.fare}</div>
                    </div>
                    <Link 
                      to={`/booking-details`} 
                      className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center hover:bg-primary hover:text-[#111111] transition-all duration-300 group-hover:rotate-[-45deg]"
                    >
                       <FaChevronRight />
                    </Link>
                 </div>
               </motion.div>
             ))}
          </div>

          <div className="mt-16 text-center">
             <button className="bg-primary text-[#111111] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-[#111111] hover:text-white transition-all">
                Book A New Ride
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyBooking;
