import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaCar, FaTimes, FaSuitcase, FaInfoCircle, FaCheckCircle, FaUser, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

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

const Booking = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '1',
    vehicle: 'Economy',
    comments: ''
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
    }, 4000);
  };

  return (
    <>
      <PageHeader title="Book a Taxi" breadcrumb="Booking" />
      
      <section className="section-padding bg-gray-50 pb-32">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 lg:p-16 rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                    <FaTaxi size={28} />
                 </div>
                 <h2 className="text-3xl font-extrabold text-secondary uppercase tracking-tight">Reserve Your Ride</h2>
                 <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Personal & Journey Details</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Section 1: Personal Info */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-3">
                      <span className="w-8 h-8 bg-secondary text-white rounded-lg flex items-center justify-center text-xs font-extrabold">01</span>
                      <h3 className="text-lg font-extrabold text-secondary uppercase tracking-tight">Personal Information</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaUser size={10} /> First Name *
                        </label>
                        <input type="text" name="firstName" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary focus:shadow-[0_0_20px_rgba(255,193,7,0.1)] outline-none transition-all" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaUser size={10} /> Last Name *
                        </label>
                        <input type="text" name="lastName" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary focus:shadow-[0_0_20px_rgba(255,193,7,0.1)] outline-none transition-all" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaEnvelope size={10} /> Email *
                        </label>
                        <input type="email" name="email" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary transition-all outline-none" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaPhoneAlt size={10} /> Phone *
                        </label>
                        <input type="tel" name="phone" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary transition-all outline-none" onChange={handleChange} />
                      </div>
                   </div>
                </div>

                {/* Section 2: Journey Info */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-3">
                      <span className="w-8 h-8 bg-secondary text-white rounded-lg flex items-center justify-center text-xs font-extrabold">02</span>
                      <h3 className="text-lg font-extrabold text-secondary uppercase tracking-tight">Journey Details</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="md:col-span-2 group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaMapMarkerAlt size={10} /> Pickup Address *
                        </label>
                        <input type="text" name="pickup" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary transition-all outline-none" onChange={handleChange} />
                      </div>
                      <div className="md:col-span-2 group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-secondary">
                           <FaMapMarkerAlt size={10} /> Dropoff Address *
                        </label>
                        <input type="text" name="dropoff" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-secondary transition-all outline-none" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaCalendarAlt size={10} /> Date *
                        </label>
                        <input type="date" name="date" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all cursor-pointer" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaClock size={10} /> Time *
                        </label>
                        <input type="time" name="time" required className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all cursor-pointer" onChange={handleChange} />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">
                           <FaUsers size={10} /> Passengers *
                        </label>
                        <select name="passengers" className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all cursor-pointer appearance-none" onChange={handleChange}>
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4 People</option>
                          <option value="5+">5+ People</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* Section 3: Extra */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-3">
                      <span className="w-8 h-8 bg-secondary text-white rounded-lg flex items-center justify-center text-xs font-extrabold">03</span>
                      <h3 className="text-lg font-extrabold text-secondary uppercase tracking-tight">Additional Notes</h3>
                   </div>
                   <textarea 
                    name="comments" 
                    rows="4"
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                    placeholder="Tell us about special requirements (Child seats, extra luggage, etc.)"
                   ></textarea>
                </div>

                <div className="pt-10">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    className="w-full bg-primary text-secondary py-6 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all shadow-xl shadow-primary/20"
                  >
                    SELECT VEHICLE & CONFIRM
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODALS RENDERED AT TOP LEVEL FOR Z-INDEX PROTECTION */}
      
      {/* 1. CAR SELECTION */}
      <AnimatePresence>
        {showCarSelection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0 bg-secondary/98 backdrop-blur-xl" onClick={() => setShowCarSelection(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="relative w-full max-w-6xl bg-gray-50 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-secondary p-10 md:p-16 text-center relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                 <button onClick={() => setShowCarSelection(false)} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                    <FaTimes size={24} />
                 </button>
                 <h3 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tighter mb-4">Choose Your Vehicle</h3>
                 <p className="text-primary text-[10px] font-extrabold uppercase tracking-[0.4em] opacity-80">Finalize your journey with the perfect car</p>
              </div>

              <div className="p-8 md:p-16 overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                   {cars.map((car) => (
                      <motion.div
                        key={car.id}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[40px] overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-xl group cursor-pointer p-2"
                        onClick={() => handleCarSelect(car)}
                      >
                        <div className="relative h-60 rounded-[32px] overflow-hidden">
                          <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-6 right-6 bg-primary text-secondary font-extrabold px-6 py-3 rounded-2xl text-xl shadow-xl">
                            ${car.price}
                          </div>
                        </div>
                        <div className="p-10">
                          <h4 className="text-xl font-extrabold text-secondary uppercase tracking-tight mb-3">{car.name}</h4>
                          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-8 leading-relaxed">{car.desc}</p>
                          
                          <div className="flex items-center gap-8 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3">
                              <FaUsers className="text-primary text-lg" />
                              <span className="text-sm font-extrabold text-secondary">{car.capacity} Seats</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <FaSuitcase className="text-primary text-lg" />
                              <span className="text-sm font-extrabold text-secondary">{car.luggage} Bags</span>
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

      {/* 2. CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirmModal && selectedCar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setShowConfirmModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mx-auto mb-8">
                  <FaInfoCircle size={36} />
                </div>
                <h3 className="text-xl font-extrabold text-secondary uppercase tracking-tight">Final Verification</h3>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-3">Please confirm your booking details</p>
              </div>

              <div className="bg-gray-50 rounded-[32px] p-8 space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Guest</span>
                  <span className="text-secondary font-extrabold truncate">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Vehicle</span>
                  <span className="text-secondary font-extrabold">{selectedCar.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Pay</span>
                  <span className="text-primary font-extrabold text-3xl tracking-tighter">${selectedCar.price}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-5 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors"
                >
                  Change
                </button>
                <button 
                  onClick={handleFinalConfirm}
                  className="flex-[2] bg-primary text-secondary py-5 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl shadow-primary/20"
                >
                  Confirm & Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SUCCESS MESSAGE */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100001] flex items-center justify-center bg-secondary text-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-lg w-full"
            >
              <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_20px_60px_rgba(255,193,7,0.4)]">
                <FaCheckCircle className="text-secondary text-7xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter mb-6 leading-none">Booking<br/>Successful!</h2>
              <p className="text-gray-400 font-bold text-[11px] tracking-[0.2em] uppercase mb-12 leading-relaxed">
                Your luxury ride is confirmed. We've sent the booking ticket to your email.
              </p>
              <div className="flex items-center justify-center gap-4 text-primary font-extrabold text-xs tracking-[0.6em] uppercase">
                <span className="w-20 h-0.5 bg-primary/20"></span>
                See You Soon
                <span className="w-20 h-0.5 bg-primary/20"></span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Booking;
