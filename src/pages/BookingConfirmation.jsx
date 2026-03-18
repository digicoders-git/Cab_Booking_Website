import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaPrint, FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Booking Confirmation" subtitle="Your journey with Taxica begins here" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[60px] shadow-2xl overflow-hidden border border-gray-100"
          >
             {/* Success Hero */}
             <div className="bg-primary p-7 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                   <div className="w-24 h-24 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <FaCheckCircle className="text-primary text-5xl" />
                   </div>
                   <h2 className="text-[#111111] text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">AWESOME! YOUR RIDE IS BOOKED</h2>
                   <p className="text-[#111111] font-bold text-lg max-w-lg mx-auto opacity-70">
                      We've received your request. A professional driver will pick you up at the scheduled time.
                   </p>
                </div>
             </div>

             <div className="p-6 sm:p-10 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                   <div className="space-y-8">
                      <div>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Booking ID</span>
                         <div className="text-2xl font-black text-[#111111]">#TX-7744321</div>
                      </div>
                      <div className="flex gap-6">
                         <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaCalendarAlt className="text-2xl" /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Schedule</span>
                            <div className="text-lg font-bold text-[#111111]">12 March 2026, 04:30 PM</div>
                         </div>
                      </div>
                      <div className="flex gap-6">
                         <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100"><FaMapMarkerAlt className="text-2xl" /></div>
                         <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Route Details</span>
                            <div className="text-lg font-bold text-[#111111]">Downtown Hotel ➟ Airport Term 1</div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                         <FaTaxi className="text-primary text-3xl" />
                      </div>
                      <h4 className="text-xl font-black text-[#111111] uppercase tracking-tighter mb-2">Driver On The Way</h4>
                      <p className="text-gray-500 font-medium text-sm mb-6">Captain: Jack Sparrow</p>
                      <div className="flex justify-center gap-1 text-primary text-sm mb-8">
                         {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                      </div>
                      <button className="w-full bg-[#111111] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all">
                         CALL DRIVER
                      </button>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-gray-100">
                   <button className="flex-grow bg-[#111111] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all flex items-center justify-center gap-3">
                      <FaPrint /> Print Ticket
                   </button>
                   <Link to="/my-booking" className="flex-grow bg-white border-2 border-[#111111] text-[#111111] py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all text-center">
                      View My Bookings
                   </Link>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
