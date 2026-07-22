import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaCheckCircle, FaTag, FaInfoCircle, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTimes, FaMoneyBillWave, FaSuitcase } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Offers = () => {
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'packages'
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  
  // Booking Modal State
  const [bookingModal, setBookingModal] = useState({ isOpen: false, pkg: null });
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    pickupTime: '',
    paymentMethod: 'Cash'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  // Socket for real-time fixed routes
  useEffect(() => {
    const socket = io(API_BASE_URL.replace('/api', ''));
    
    socket.on('newFixedRoute', (data) => {
      if (data && data.route) {
        // Show a nice toast toast for the user
        Swal.fire({
          title: 'New Package Available!',
          text: `A new package from ${data.route.pickupLocation} to ${data.route.dropLocation} has just been added.`,
          icon: 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          background: '#1a1a1a',
          color: '#ffb703'
        });
        
        // Add it to the packages state dynamically if it's active
        if (data.route.isActive) {
          setPackages(prev => [data.route, ...prev]);
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'offers') {
          if (offers.length === 0) {
            const response = await fetch(`${API_BASE_URL}/offers/active`);
            const data = await response.json();
            if (data.success) setOffers(data.offers);
          }
        } else {
          if (packages.length === 0) {
            const response = await fetch(`${API_BASE_URL}/fixed-routes/routes/active`);
            const data = await response.json();
            if (data.success) setPackages(data.routes);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openBookingModal = (pkg) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to book a package ride.',
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ffb703'
      });
      navigate('/login', { state: { returnUrl: '/offers' } });
      return;
    }
    setBookingModal({ isOpen: true, pkg });
    setBookingData({ pickupDate: '', pickupTime: '', paymentMethod: 'Cash' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/fixed-routes/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId: bookingModal.pkg._id,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          paymentMethod: bookingData.paymentMethod
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingModal({ isOpen: false, pkg: null });
        Swal.fire({
          title: 'Booking Confirmed!',
          text: 'Your package ride has been booked successfully.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#ffb703'
        });
        navigate('/my-booking');
      } else {
        throw new Error(data.message || 'Failed to book package');
      }
    } catch (error) {
      Swal.fire({
        title: 'Booking Failed',
        text: error.message,
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ffb703'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20 pb-20 relative">
      <PageHeader 
        title="Offers & Packages" 
        subtitle="Exclusive discounts and fixed route packages for you" 
      />

      <div className="container mx-auto px-4 max-w-6xl mt-12">
        
        {/* Tabs Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#111] border border-white/10 rounded-full p-1.5 flex shadow-lg">
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'offers' 
                  ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaTag />
              <span>Discount Offers</span>
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'packages' 
                  ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaSuitcase />
              <span>Fixed Packages</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </motion.div>
          ) : activeTab === 'offers' ? (
            /* OFFERS TAB */
            <motion.div 
              key="offers"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {offers.length === 0 ? (
                <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5">
                  <FaInfoCircle className="text-6xl text-white/20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Active Offers</h3>
                  <p className="text-white/60">Check back later for exciting new deals and discounts!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {offers.map((offer, index) => (
                    <motion.div
                      key={offer._id}
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group relative bg-[#111] rounded-3xl p-8 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/50"
                    >
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-500"></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex justify-center items-center">
                            <FaTag className="text-2xl text-primary" />
                          </div>
                          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-white/70">
                            {offer.bookingType} Booking
                          </div>
                        </div>

                        <h3 className="text-3xl font-black text-white mb-2">
                          Save <span className="text-primary">₹{offer.discountAmount}</span>
                        </h3>
                        
                        <p className="text-white/60 text-sm mb-8 flex-grow">
                          Valid on your next {offer.bookingType.toLowerCase()} ride. Apply the promo code during checkout to avail this exclusive discount.
                        </p>

                        <div className="mt-auto">
                          <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Promo Code</p>
                          <div 
                            onClick={() => copyToClipboard(offer.code)}
                            className="flex justify-between items-center bg-black border border-white/10 rounded-xl p-4 cursor-pointer group/code hover:border-primary/50 transition-colors"
                          >
                            <span className="text-xl font-bold tracking-widest text-white group-hover/code:text-primary transition-colors">
                              {offer.code}
                            </span>
                            {copiedCode === offer.code ? (
                              <FaCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <FaCopy className="text-white/40 group-hover/code:text-white transition-colors text-lg" />
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                          <span>Valid till</span>
                          <span className="font-medium text-white/60">
                            {new Date(offer.validTill).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* PACKAGES TAB */
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {packages.length === 0 ? (
                <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5">
                  <FaSuitcase className="text-6xl text-white/20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Packages Available</h3>
                  <p className="text-white/60">Currently there are no fixed route packages available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group relative bg-[#111] rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/50 flex flex-col"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                          <FaCar />
                          <span>{pkg.carCategory?.name}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4 flex-grow">
                        <div className="relative pl-6 pb-4 border-l-2 border-dashed border-white/20 ml-2">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-[#111]"></div>
                          <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Pickup</p>
                          <h4 className="text-white font-medium text-lg leading-tight">{pkg.pickupLocation}</h4>
                        </div>
                        <div className="relative pl-6 ml-2">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-[#111]"></div>
                          <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Drop</p>
                          <h4 className="text-white font-medium text-lg leading-tight">{pkg.dropLocation}</h4>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Fixed Fare</p>
                          <p className="text-3xl font-black text-white">₹{pkg.price}</p>
                        </div>
                        <button 
                          onClick={() => openBookingModal(pkg)}
                          className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-primary/20"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setBookingModal({ isOpen: false, pkg: null })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setBookingModal({ isOpen: false, pkg: null })}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Book Package Ride</h2>
              <p className="text-white/60 text-sm mb-8">Fill out the details below to confirm your booking.</p>

              <div className="bg-black/50 rounded-2xl p-4 mb-6 border border-white/5">
                <p className="text-primary font-bold text-lg mb-1">{bookingModal.pkg?.pickupLocation} ➔ {bookingModal.pkg?.dropLocation}</p>
                <div className="flex justify-between items-center text-sm text-white/60 mt-2">
                  <span><FaCar className="inline mr-1" /> {bookingModal.pkg?.carCategory?.name}</span>
                  <span className="text-white font-bold text-lg">₹{bookingModal.pkg?.price}</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                      <FaCalendarAlt className="inline mr-1" /> Date
                    </label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.pickupDate}
                      onChange={(e) => setBookingData({...bookingData, pickupDate: e.target.value})}
                      className="w-full bg-black border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                      <FaClock className="inline mr-1" /> Time
                    </label>
                    <input 
                      type="time" 
                      required
                      value={bookingData.pickupTime}
                      onChange={(e) => setBookingData({...bookingData, pickupTime: e.target.value})}
                      className="w-full bg-black border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                    <FaMoneyBillWave className="inline mr-1" /> Payment Method
                  </label>
                  <select 
                    value={bookingData.paymentMethod}
                    onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                    className="w-full bg-black border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Cash">Cash to Driver</option>
                    <option value="Online">Online Payment</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl mt-4 transition duration-300 flex justify-center items-center"
                >
                  {bookingLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Offers;
