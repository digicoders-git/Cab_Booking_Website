import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle, FaTimes, FaUsers, FaArrowRight, FaMobileAlt, FaDotCircle, FaSpinner, FaSearch } from 'react-icons/fa';

const cars = [
  { id: 1, name: 'Economy Bike', emoji: '🛵', price: 15, eta: '3 min', capacity: 1, desc: 'Quick bike ride' },
  { id: 2, name: 'Auto', emoji: '🛺', price: 25, eta: '5 min', capacity: 3, desc: 'Budget friendly' },
  { id: 3, name: 'Mini Cab', emoji: '🚗', price: 45, eta: '6 min', capacity: 4, desc: 'AC sedan' },
  { id: 4, name: 'Prime SUV', emoji: '🚙', price: 75, eta: '8 min', capacity: 4, desc: 'Premium SUV' },
];

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ pickup: '', dropoff: '' });
  const [showCarSelection, setShowCarSelection] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState('phone');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    setShowCarSelection(true);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setShowPhoneModal(true);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const mock = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mock);
    setOtp(['', '', '', '']);
    setOtpError(false);
    setStep('otp');
    console.log('OTP (mock):', mock);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    setOtpError(false);
    if (val && idx < 3) otpRefs[idx + 1].current.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs[idx - 1].current.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join('') === generatedOtp) {
      setShowPhoneModal(false);
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '']);
      setShowFinalConfirm(true);
    } else {
      setOtpError(true);
    }
  };

  const handleFinalBooking = () => {
    setShowFinalConfirm(false);
    setIsSearching(true);
    setTimeout(() => {
      navigate('/driver-tracking');
    }, 3000);
  };

  return (
    <>
      {/* HERO + BOOKING FORM */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
          >
            Fast & Reliable — KwibCabs
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Where to?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 mb-10 text-sm"
          >
            Book a KwibCabs ride in seconds — professional drivers, zero hassle.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleLocationSubmit}
            className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-3 text-left"
          >
            <div className="relative flex items-center">
              <FaDotCircle className="absolute left-4 text-primary text-xs" />
              <input
                type="text"
                required
                placeholder="Pickup location"
                value={formData.pickup}
                onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white text-sm outline-none focus:border-primary transition-all placeholder:text-white/30"
              />
            </div>

            <div className="flex items-center gap-3 px-4">
              <div className="w-px h-4 bg-white/20 ml-[3px]" />
            </div>

            <div className="relative flex items-center">
              <FaMapMarkerAlt className="absolute left-4 text-white/40 text-xs" />
              <input
                type="text"
                required
                placeholder="Drop-off location"
                value={formData.dropoff}
                onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white text-sm outline-none focus:border-white/40 transition-all placeholder:text-white/30"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-primary text-black font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-yellow-400 transition-all mt-1"
            >
              See Available Rides <FaArrowRight />
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* CAR SELECTION MODAL */}
      <AnimatePresence>
        {showCarSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowCarSelection(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#111111] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header with locations */}
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-black text-xl mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Choose Your Ride</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FaDotCircle className="text-primary text-xs" />
                        <span className="text-white/70">Pickup:</span>
                        <span className="text-white font-bold">{formData.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-red-400 text-xs" />
                        <span className="text-white/70">Drop-off:</span>
                        <span className="text-white font-bold">{formData.dropoff}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowCarSelection(false)} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white">
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>

              {/* Car options */}
              <div className="overflow-y-auto p-4 space-y-3">
                {cars.map((car) => (
                  <motion.div
                    key={car.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCarSelect(car)}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-2xl cursor-pointer transition-all"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                      {car.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-base">{car.name}</h4>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">{car.eta}</span>
                      </div>
                      <p className="text-white/40 text-xs mb-2">{car.desc}</p>
                      <div className="flex items-center gap-1 text-white/50 text-xs">
                        <FaUsers size={10} /> {car.capacity} seats
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-primary font-black text-2xl">₹{car.price}</div>
                      <div className="text-white/30 text-xs">base fare</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHONE + OTP MODAL */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { setShowPhoneModal(false); setStep('phone'); }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl p-7 shadow-2xl"
            >
              <button onClick={() => { setShowPhoneModal(false); setStep('phone'); }} className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white">
                <FaTimes size={12} />
              </button>

              <AnimatePresence mode="wait">
                {step === 'phone' ? (
                  <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                      <FaMobileAlt className="text-primary text-xl" />
                    </div>
                    <h3 className="text-white font-black text-2xl mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Enter Mobile</h3>
                    <p className="text-white/40 text-xs mb-6">We'll send an OTP to verify your booking</p>
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary transition-all">
                        <span className="px-4 text-white/50 text-sm font-bold border-r border-white/10 py-4">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 bg-transparent px-4 py-4 text-white text-sm outline-none placeholder:text-white/30"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={phone.length !== 10}
                        className="w-full bg-primary text-black font-black py-4 rounded-2xl text-sm hover:bg-yellow-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        SEND OTP
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <button onClick={() => setStep('phone')} className="text-white/40 text-xs mb-4 hover:text-white flex items-center gap-1">← Change number</button>
                    <h3 className="text-white font-black text-2xl mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Verify OTP</h3>
                    <p className="text-white/40 text-xs mb-6">Sent to +91 {phone}</p>
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="flex gap-3 justify-center">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={otpRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className={`w-14 h-14 text-center text-white text-xl font-black bg-white/5 border rounded-2xl outline-none transition-all ${
                              otpError ? 'border-red-500' : digit ? 'border-primary' : 'border-white/10 focus:border-primary'
                            }`}
                          />
                        ))}
                      </div>
                      {otpError && <p className="text-red-400 text-xs text-center">Invalid OTP. Try again.</p>}
                      <p className="text-white/20 text-xs text-center">Demo OTP: {generatedOtp}</p>
                      <button
                        type="submit"
                        disabled={otp.join('').length !== 4}
                        className="w-full bg-primary text-black font-black py-4 rounded-2xl text-sm hover:bg-yellow-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        VERIFY & CONTINUE
                      </button>
                      <button type="button" onClick={handleSendOtp} className="w-full text-white/40 text-xs hover:text-primary transition-colors">
                        Resend OTP
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL BOOKING CONFIRMATION */}
      <AnimatePresence>
        {showFinalConfirm && selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowFinalConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="text-6xl mb-3">{selectedCar.emoji}</div>
                <h3 className="text-white font-black text-2xl mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Confirm Your Booking</h3>
                <p className="text-white/40 text-xs">{selectedCar.name}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 space-y-3 mb-6">
                <div className="flex items-start gap-3 pb-3 border-b border-white/5">
                  <FaDotCircle className="text-primary text-xs mt-1" />
                  <div className="flex-1">
                    <p className="text-white/40 text-xs mb-1">Pickup Location</p>
                    <p className="text-white font-bold text-sm">{formData.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-white/5">
                  <FaMapMarkerAlt className="text-red-400 text-xs mt-1" />
                  <div className="flex-1">
                    <p className="text-white/40 text-xs mb-1">Drop-off Location</p>
                    <p className="text-white font-bold text-sm">{formData.dropoff}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white/40 text-sm">Total Fare</span>
                  <span className="text-primary font-black text-2xl">₹{selectedCar.price}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinalConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl text-white/40 hover:text-white text-sm font-bold border border-white/10 hover:border-white/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalBooking}
                  className="flex-[2] bg-primary text-black py-3.5 rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCHING DRIVER */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center px-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/20 border-t-primary"
              >
                <FaSearch className="text-primary text-3xl" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Searching Driver...</h2>
              <p className="text-white/40 text-sm">Finding the best driver near you 🚀</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingForm;
