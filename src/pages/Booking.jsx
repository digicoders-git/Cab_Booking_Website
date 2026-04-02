import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMotorcycle, FaTaxi, FaCheckCircle, FaTimes,
  FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers,
  FaSuitcase, FaDotCircle, FaArrowDown, FaBolt
} from 'react-icons/fa';

import PageHeader from '../components/PageHeader';

const rideTypes = [
  { id: 'bike', label: 'Bike', icon: <FaMotorcycle size={22} />, tag: 'Fastest', color: 'from-orange-500 to-red-500' },
  { id: 'auto', label: 'Auto', icon: <FaTaxi size={22} />, tag: 'Affordable', color: 'from-yellow-400 to-orange-400' },
  { id: 'cab', label: 'Cab', icon: <FaTaxi size={22} />, tag: 'Comfortable', color: 'from-primary to-yellow-300' },
];

const cars = [
  { id: 1, name: 'Economy', emoji: '🛵', price: 15, eta: '3 min', capacity: 1, desc: 'Quick bike ride', type: 'bike' },
  { id: 2, name: 'Auto', emoji: '🛺', price: 25, eta: '5 min', capacity: 3, desc: 'Budget friendly', type: 'auto' },
  { id: 3, name: 'Mini Cab', emoji: '🚗', price: 45, eta: '6 min', capacity: 4, desc: 'AC sedan', type: 'cab' },
  { id: 4, name: 'Prime', emoji: '🚙', price: 75, eta: '8 min', capacity: 4, desc: 'Premium SUV', type: 'cab' },
];

const Booking = () => {
  const [rideType, setRideType] = useState('cab');
  const [formData, setFormData] = useState({ pickup: '', dropoff: '', date: '', time: '', passengers: '1' });
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'in' }
    });

    const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'in' }
    });

    pickupAutocomplete.addListener('place_changed', () => {
      const place = pickupAutocomplete.getPlace();
      if (place.formatted_address) {
        setFormData(prev => ({ ...prev, pickup: place.formatted_address }));
      }
    });

    dropoffAutocomplete.addListener('place_changed', () => {
      const place = dropoffAutocomplete.getPlace();
      if (place.formatted_address) {
        setFormData(prev => ({ ...prev, dropoff: place.formatted_address }));
      }
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSheet(true);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowSheet(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedCar(null);
      setFormData({ pickup: '', dropoff: '', date: '', time: '', passengers: '1' });
    }, 3500);
  };

  const filteredCars = cars.filter(c => c.type === rideType || rideType === 'cab' && c.type === 'cab');

  return (
    <>
      <PageHeader title="Book a Ride" breadcrumb="Booking" />

      <section className="min-h-screen bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <FaBolt className="text-primary text-xs" />
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Instant Booking</span>
            </div>
            <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Where to?</h1>
            <p className="text-white/40 text-sm mt-2">Book in seconds, ride in minutes</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Ride Type Tabs */}
            <div className="flex border-b border-white/10">
              {rideTypes.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => setRideType(rt.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-4 text-xs font-bold transition-all relative ${rideType === rt.id ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                >
                  <span className={`p-2 rounded-xl transition-all ${rideType === rt.id ? `bg-gradient-to-br ${rt.color} text-black shadow-lg` : 'bg-white/5'}`}>
                    {rt.icon}
                  </span>
                  {rt.label}
                  {rideType === rt.id && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3">

              {/* Location Inputs */}
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                  <FaDotCircle className="text-primary text-sm shrink-0" />
                  <input
                    ref={pickupRef}
                    name="pickup" required value={formData.pickup} onChange={handleChange}
                    placeholder="Pickup location"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <FaMapMarkerAlt className="text-red-400 text-sm shrink-0" />
                  <input
                    ref={dropoffRef}
                    name="dropoff" required value={formData.dropoff} onChange={handleChange}
                    placeholder="Drop-off location"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Swap indicator */}
              <div className="flex justify-center">
                <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <FaArrowDown className="text-white/30 text-xs" />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 px-4 py-3.5">
                  <FaCalendarAlt className="text-primary text-xs shrink-0" />
                  <input
                    type="date" name="date" required value={formData.date} onChange={handleChange}
                    className="flex-1 bg-transparent text-white text-xs outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 px-4 py-3.5">
                  <FaClock className="text-primary text-xs shrink-0" />
                  <input
                    type="time" name="time" required value={formData.time} onChange={handleChange}
                    className="flex-1 bg-transparent text-white text-xs outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 px-4 py-3.5">
                <FaUsers className="text-primary text-sm shrink-0" />
                <select
                  name="passengers" value={formData.passengers} onChange={handleChange}
                  className="flex-1 bg-transparent text-white text-sm outline-none appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, '5+'].map(n => <option key={n} value={n} className="bg-[#111]">{n} Passenger{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-primary text-black font-black py-4 rounded-2xl text-sm shadow-lg shadow-primary/30 hover:bg-yellow-400 transition-all mt-1 flex items-center justify-center gap-2"
              >
                <FaBolt /> See Available Rides
              </motion.button>
            </form>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex justify-center gap-6 mt-6"
          >
            {['Safe Rides', 'Live Tracking', 'Best Fare'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-white/30 text-xs">
                <FaCheckCircle className="text-primary text-[10px]" /> {b}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOTTOM SHEET — Ride Options */}
      <AnimatePresence>
        {showSheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSheet(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-lg bg-[#111] border-t border-white/10 rounded-t-3xl overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-5 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-black text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Choose a Ride</h3>
                  <p className="text-white/40 text-xs">{formData.pickup} → {formData.dropoff}</p>
                </div>
                <button onClick={() => setShowSheet(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white">
                  <FaTimes size={12} />
                </button>
              </div>

              <div className="px-5 pb-6 space-y-3 mt-3 max-h-[60vh] overflow-y-auto">
                {cars.filter(c => rideType === 'bike' ? c.type === 'bike' : rideType === 'auto' ? c.type === 'auto' : c.type === 'cab').map((car) => (
                  <motion.div
                    key={car.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCarSelect(car)}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-2xl cursor-pointer transition-all"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      {car.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{car.name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{car.eta}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{car.desc}</p>
                      <div className="flex items-center gap-1 mt-1 text-white/30 text-xs">
                        <FaUsers size={9} /> {car.capacity} seats
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-primary font-black text-xl">₹{car.price}</div>
                      <div className="text-white/30 text-[10px]">base fare</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {showConfirm && selectedCar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">{selectedCar.emoji}</div>
                <h3 className="text-white font-black text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>{selectedCar.name}</h3>
                <p className="text-white/40 text-xs mt-1">{selectedCar.desc}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 space-y-3 mb-5">
                {[
                  { label: 'From', value: formData.pickup },
                  { label: 'To', value: formData.dropoff },
                  { label: 'Date & Time', value: `${formData.date} ${formData.time}` },
                  { label: 'Fare', value: `₹${selectedCar.price}`, highlight: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-white/40">{row.label}</span>
                    <span className={row.highlight ? 'text-primary font-black text-lg' : 'text-white font-bold truncate max-w-[55%] text-right'}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl text-white/40 hover:text-white text-sm font-bold border border-white/10 hover:border-white/30 transition-all">
                  Back
                </button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm}
                  className="flex-[2] bg-primary text-black py-3.5 rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                  <FaBolt size={12} /> Confirm Ride
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 18 }}
              className="text-center px-6"
            >
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40"
              >
                <FaCheckCircle className="text-black text-4xl" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Ride Booked!</h2>
              <p className="text-white/40 text-sm">Your driver is on the way 🚀</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Booking;
