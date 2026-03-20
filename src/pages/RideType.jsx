import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUsers, FaArrowRight, FaCheckCircle, FaTaxi, FaLock, FaBolt, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const RideType = () => {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: ''
  });
  const navigate = useNavigate();

  const types = [
    {
      id: 'private',
      title: 'Private Ride',
      description: 'The entire cab is reserved for you. No stops, no sharing, maximum comfort and speed.',
      price: 'Full Fare',
      icon: <FaUser className="text-4xl" />,
      features: ['No co-passengers', 'Direct destination', 'Immediate pickup', 'Choice of vehicle'],
      color: '#FFBC00'
    },
    {
      id: 'shared',
      title: 'Shared Ride',
      description: 'Share your ride with others heading in the same direction and save up to 40% on your fare.',
      price: 'Per Seat Fare',
      icon: <FaUsers className="text-4xl" />,
      features: ['Split the cost', 'Environment friendly', 'Meet new people', 'Real-time matching'],
      color: '#ffffff'
    }
  ];

  const handleInputChange = (e) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleSelect = (id) => {
    setSelectedRide(id);
    setShowDetailsForm(true);
  };

  const handleFinalConfirm = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate a premium booking process
    setTimeout(() => {
      setIsProcessing(false);
      setTimeout(() => {
        navigate('/services/booking-summary');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Select Ride Type" subtitle="Choose your preferred travel mode" />
      
      <div className="section-padding container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {types.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`group relative bg-[#111111] p-10 rounded-[40px] overflow-hidden border-2 transition-all duration-500 shadow-2xl ${
                selectedRide === type.id ? 'border-primary' : 'border-transparent hover:border-primary/50'
              }`}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-[#111111] group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                    {type.icon}
                  </div>
                  {type.id === 'private' && (
                    <div className="bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 rounded-full border border-primary/20 tracking-widest flex items-center gap-1">
                      <FaBolt size={8} /> PREMIUM CHOICE
                    </div>
                  )}
                </div>
                
                <h3 className="text-3xl font-extrabold text-white mb-4 uppercase tracking-tight">{type.title}</h3>
                <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                  {type.description}
                </p>
                
                <div className="mb-8 flex items-center gap-2">
                   <span className="text-primary font-extrabold text-xl uppercase tracking-widest">{type.price}</span>
                   <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                   <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Guaranteed</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300 font-medium group/item">
                      <FaCheckCircle className="text-primary shrink-0 transition-transform group-hover/item:scale-125" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelect(type.id)}
                  className={`w-full font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-wider ${
                    selectedRide === type.id 
                    ? 'bg-primary text-[#111111]' 
                    : 'bg-white text-[#111111] hover:bg-primary group-hover:shadow-[0_10px_30px_rgba(255,193,7,0.3)]'
                  }`}
                >
                  Select {type.title} <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Journey Details Form Overlay */}
        <AnimatePresence>
          {showDetailsForm && !isProcessing && selectedRide !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
            >
              <div className="absolute inset-0 bg-[#111111]/95 backdrop-blur-xl" onClick={() => setShowDetailsForm(false)}></div>
              
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                <div className="bg-[#111111] p-6 sm:p-10 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -mr-24 -mt-24"></div>
                   
                   <motion.div 
                     initial={{ y: -10, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 rotate-6"
                   >
                      <FaTaxi className="text-[#111111] text-2xl" />
                   </motion.div>
                   
                   <h3 className="text-2xl font-extrabold text-white uppercase tracking-tighter leading-none mb-2">Journey Details</h3>
                   <p className="text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-80">Almost there!</p>
                </div>

                <div className="p-6 sm:p-10">
                   <form onSubmit={handleFinalConfirm} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="sm:col-span-2 group">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5 group-focus-within:text-primary transition-colors">Pickup</label>
                            <div className="relative">
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-[#111111] transition-all">
                                  <FaMapMarkerAlt size={12} />
                                </div>
                               <input 
                                 type="text" 
                                 name="pickup"
                                 required
                                 className="w-full bg-gray-50 border-2 border-transparent px-14 py-4 rounded-xl text-sm font-bold text-[#111111] placeholder:text-gray-400 focus:bg-white focus:border-primary transition-all outline-none"
                                 placeholder="Pickup Address"
                                 value={bookingFormData.pickup}
                                 onChange={handleInputChange}
                               />
                            </div>
                         </div>
                         <div className="sm:col-span-2 group">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5 group-focus-within:text-secondary transition-colors">Destination</label>
                            <div className="relative">
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-[#111111] group-focus-within:bg-secondary group-focus-within:text-white transition-all">
                                  <FaMapMarkerAlt size={12} />
                               </div>
                               <input 
                                 type="text" 
                                 name="destination"
                                 required
                                 className="w-full bg-gray-50 border-2 border-transparent px-14 py-4 rounded-xl text-sm font-bold text-[#111111] placeholder:text-gray-400 focus:bg-white focus:border-primary transition-all outline-none"
                                 placeholder="Drop-off Address"
                                 value={bookingFormData.destination}
                                 onChange={handleInputChange}
                               />
                            </div>
                         </div>
                         <div className="group">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5 group-focus-within:text-secondary transition-colors">Date</label>
                            <input 
                              type="date" 
                              name="date"
                              required
                              className="w-full bg-gray-50 border-2 border-transparent px-5 py-4 rounded-xl text-sm font-bold text-[#111111] focus:bg-white focus:border-primary transition-all outline-none"
                              value={bookingFormData.date}
                              onChange={handleInputChange}
                            />
                         </div>
                         <div className="group">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5 group-focus-within:text-secondary transition-colors">Time</label>
                            <input 
                              type="time" 
                              name="time"
                              required
                              className="w-full bg-gray-50 border-2 border-transparent px-5 py-4 rounded-xl text-sm font-bold text-[#111111] focus:bg-white focus:border-primary transition-all outline-none"
                              value={bookingFormData.time}
                              onChange={handleInputChange}
                            />
                         </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3">
                         <button 
                           type="button"
                           onClick={() => setShowDetailsForm(false)}
                           className="w-full sm:w-1/3 py-4 rounded-xl font-extrabold text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                         >
                            CANCEL
                         </button>
                         <button 
                           type="submit"
                           className="w-full sm:w-2/3 bg-primary text-[#111111] py-4 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-lg shadow-primary/20"
                         >
                            CONFIRM BOOKING
                         </button>
                      </div>
                   </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing/Success Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/80 backdrop-blur-xl"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40"
                >
                  <FaTaxi className="text-[#111111] text-4xl" />
                </motion.div>
                <h3 className="text-white text-2xl font-extrabold uppercase tracking-tighter mb-2">Processing Ride...</h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Preparing your journey</p>
              </div>
            </motion.div>
          )}

          {selectedRide && !isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/90 backdrop-blur-2xl"
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/40"
                >
                  <FaCheckCircle className="text-white text-6xl" />
                </motion.div>
                <h3 className="text-white text-4xl font-extrabold uppercase tracking-tighter mb-4">Confirmed!</h3>
                <p className="text-gray-400 font-bold mb-8">Your {selectedRide} ride is locked in.</p>
                <div className="flex items-center justify-center gap-2 text-primary font-extrabold text-xs uppercase tracking-widest">
                  <span className="w-12 h-0.5 bg-primary/30"></span>
                  Redirecting to Summary
                  <span className="w-12 h-0.5 bg-primary/30"></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RideType;
