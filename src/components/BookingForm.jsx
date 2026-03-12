import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaChevronDown, FaCheckCircle, FaTimes, FaUsers, FaSuitcase, FaInfoCircle } from 'react-icons/fa';

const cars = [
  {
    id: 1,
    name: 'Economy Class',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    price: 15,
    type: 'Economy',
    capacity: 4,
    luggage: 2,
    desc: 'Affordable, everyday rides'
  },
  {
    id: 2,
    name: 'Business Class',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=400',
    price: 35,
    type: 'Standard',
    capacity: 4,
    luggage: 3,
    desc: 'Professional & comfortable'
  },
  {
    id: 3,
    name: 'Luxury Suite',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    price: 75,
    type: 'Luxury',
    capacity: 3,
    luggage: 2,
    desc: 'Premium high-end experience'
  }
];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '1',
    vehicle: 'Economy'
  });

  const [showCarSelection, setShowCarSelection] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCarSelection(true);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowCarSelection(false);
      setSelectedCar(null);
    }, 3000);
  };

  return (
    <>
      <section className="relative z-20 -mt-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] p-8 lg:p-12 relative overflow-hidden"
          >
            {/* Accent decoration */}
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FaCar size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#111111] uppercase tracking-tighter">Quick Booking</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Get your ride in seconds</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-11 gap-6 items-end">
              
              {/* Pickup Location */}
              <div className="xl:col-span-4 group">
                <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-primary pl-1">
                  <FaMapMarkerAlt size={10} /> Pickup Location
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="pickup" 
                    required 
                    placeholder="From Address" 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#111111] focus:bg-white focus:border-primary focus:shadow-[0_0_20px_rgba(255,193,7,0.15)] outline-none transition-all placeholder:text-gray-300" 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              {/* Drop Location */}
              <div className="xl:col-span-4 group">
                <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-secondary pl-1">
                  <FaMapMarkerAlt size={10} /> Drop Location
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="dropoff" 
                    required 
                    placeholder="To Address" 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#111111] focus:bg-white focus:border-secondary focus:shadow-[0_0_20px_rgba(17,17,17,0.1)] outline-none transition-all placeholder:text-gray-300" 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="xl:col-span-2 group">
                <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-primary pl-1">
                  <FaCalendarAlt size={10} /> Date & Time
                </label>
                <input 
                  type="datetime-local" 
                  name="date" 
                  required 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-[#111111] focus:bg-white focus:border-primary outline-none transition-all appearance-none cursor-pointer" 
                  onChange={handleChange} 
                />
              </div>

              {/* Submit Button */}
              <div className="xl:col-span-1">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-primary text-[#111111] h-[58px] rounded-2xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  BOOK
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CAR SELECTION OVERLAY */}
      <AnimatePresence>
        {showCarSelection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <div className="absolute inset-0 bg-[#111111]/95 backdrop-blur-xl" onClick={() => setShowCarSelection(false)}></div>
            
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-6xl bg-[#f8f9fa] rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#111111] p-8 sm:p-12 text-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <button 
                  onClick={() => setShowCarSelection(false)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                  <FaTimes size={24} />
                </button>
                <h3 className="text-3xl font-extrabold text-white uppercase tracking-tighter mb-2">Select Your Vehicle</h3>
                <p className="text-primary text-[10px] font-extrabold uppercase tracking-[0.3em] opacity-80">Choose the perfect ride for your journey</p>
              </div>

              {/* Car Grid */}
              <div className="p-8 sm:p-12 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-[32px] overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-xl group cursor-pointer"
                      onClick={() => handleCarSelect(car)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-primary text-[#111111] font-extrabold px-4 py-2 rounded-xl text-lg shadow-lg">
                          ${car.price}
                        </div>
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-extrabold text-[#111111] uppercase tracking-tight mb-2">{car.name}</h4>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6">{car.desc}</p>
                        
                        <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-primary" />
                            <span className="text-[13px] font-extrabold text-[#111111]">{car.capacity} Seats</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaSuitcase className="text-primary" />
                            <span className="text-[13px] font-extrabold text-[#111111]">{car.luggage} Bags</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirmModal && selectedCar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-md" onClick={() => setShowConfirmModal(false)}></div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                  <FaInfoCircle size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-[#111111] uppercase tracking-tight">Confirm Booking</h3>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Almost ready to go!</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Vehicle</span>
                  <span className="text-[#111111] font-extrabold">{selectedCar.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Pickup</span>
                  <span className="text-[#111111] font-extrabold truncate max-w-[150px]">{formData.pickup}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Fare</span>
                  <span className="text-primary font-extrabold text-xl">${selectedCar.price}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-4 rounded-xl font-extrabold text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors"
                >
                  Edit Plans
                </button>
                <button 
                  onClick={handleFinalConfirm}
                  className="flex-[2] bg-secondary text-white py-4 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-[#111111] transition-all shadow-xl shadow-secondary/20"
                >
                  Confirm & Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#111111] text-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full"
            >
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
                <FaCheckCircle className="text-[#111111] text-6xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tighter mb-4">Booking Successful!</h2>
              <p className="text-gray-400 font-bold text-xs tracking-widest uppercase mb-10 leading-relaxed">
                Your ride is on its way. We've sent the details to your email and phone.
              </p>
              <div className="flex items-center justify-center gap-3 text-primary font-bold text-[10px] tracking-[0.4em] uppercase">
                <span className="w-16 h-0.5 bg-primary/20"></span>
                Safe Travels
                <span className="w-16 h-0.5 bg-primary/20"></span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

};

export default BookingForm;
