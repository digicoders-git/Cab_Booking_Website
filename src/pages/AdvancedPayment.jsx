import { motion } from 'framer-motion';
import { FaCreditCard, FaLock, FaCheckCircle, FaTaxi, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const AdvancedPayment = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <PageHeader title="Advanced Payment" subtitle="Secure prepaid booking for your convenience" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Payment Form */}
          <div className="bg-white p-10 rounded-[40px] shadow-2xl">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tighter">Payment Details</h3>
                <div className="flex gap-2">
                   <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                   <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">MC</div>
                </div>
             </div>

             <form className="space-y-6">
                <div className="space-y-4">
                   <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="MR. JOHN DOE"
                        className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111] uppercase" 
                      />
                   </div>

                   <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Card Number</label>
                      <div className="relative flex items-center">
                         <FaCreditCard className="absolute left-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                         <input 
                           type="text" 
                           placeholder="0000 0000 0000 0000"
                           className="w-full bg-gray-50 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Expiry Date</label>
                         <input 
                           type="text" 
                           placeholder="MM / YY"
                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                         />
                      </div>
                      <div className="group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">CVV</label>
                         <div className="relative flex items-center">
                            <FaLock className="absolute left-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="password" 
                              placeholder="•••"
                              className="w-full bg-gray-50 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl text-green-700 text-xs font-bold mb-6">
                   <FaCheckCircle className="shrink-0" />
                   Secure SSL encrypted connection enabled.
                </div>

                <button className="w-full bg-[#111111] text-white font-black py-5 rounded-2xl text-lg hover:bg-primary hover:text-[#111111] transition-all duration-300 shadow-xl">
                   PAY $124.00 NOW
                </button>
             </form>
          </div>

          {/* Right: Summary */}
          <div className="p-4 flex flex-col justify-center">
             <div className="bg-[#111111] p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16"></div>
                
                <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4 uppercase tracking-tighter">Booking Summary</h4>
                
                <div className="space-y-6 mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary"><FaTaxi /></div>
                      <div>
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Selected Vehicle</div>
                         <div className="font-bold">Toyota Camry (Premium)</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary"><FaCalendarAlt /></div>
                      <div>
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date & Time</div>
                         <div className="font-bold">12 March 2026, 04:30 PM</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary"><FaMapMarkerAlt /></div>
                      <div>
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Route</div>
                         <div className="font-bold">Downtown to Airport</div>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-widest">Base Fare</span>
                      <span className="font-black">$120.00</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-widest">Service Fee</span>
                      <span className="font-black">$4.00</span>
                   </div>
                   <div className="flex justify-between text-2xl font-black mt-6 pt-4 border-t border-white/5 text-primary">
                      <span>Total</span>
                      <span>$124.00</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdvancedPayment;
