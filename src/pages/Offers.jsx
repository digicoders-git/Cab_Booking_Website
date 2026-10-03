import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaCheckCircle, FaTag, FaInfoCircle, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTimes, FaMoneyBillWave, FaSuitcase, FaLocationArrow, FaCrosshairs, FaRedo } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const Offers = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'packages' ? 'packages' : 'offers');
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  // Search & Radius Filter State
  const [searchPickup, setSearchPickup] = useState('');
  const [searchDrop, setSearchDrop] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null); // { lat, lng }
  const [dropCoords, setDropCoords] = useState(null); // { lat, lng }
  const [selectedRadiusKm, setSelectedRadiusKm] = useState(30);
  const [isLocating, setIsLocating] = useState(false);
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);

  // Haversine Distance Calculator (KM)
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Google Places Autocomplete Helpers
  const initPickupAutocomplete = (el) => {
    if (!el || el._hasAutocomplete) return;
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    try {
      const pickupAuto = new window.google.maps.places.Autocomplete(el, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' }
      });
      pickupAuto.addListener('place_changed', () => {
        const place = pickupAuto.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
          const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
          setPickupCoords({ lat, lng });
          setSearchPickup(place.formatted_address || place.name || el.value || '');
        } else if (place.name) {
          setSearchPickup(place.name);
        }
      });
      el._hasAutocomplete = true;
    } catch (err) {
      console.error("Error initializing pickup autocomplete:", err);
    }
  };

  const initDropAutocomplete = (el) => {
    if (!el || el._hasAutocomplete) return;
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    try {
      const dropAuto = new window.google.maps.places.Autocomplete(el, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' }
      });
      dropAuto.addListener('place_changed', () => {
        const place = dropAuto.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
          const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
          setDropCoords({ lat, lng });
          setSearchDrop(place.formatted_address || place.name || el.value || '');
        } else if (place.name) {
          setSearchDrop(place.name);
        }
      });
      el._hasAutocomplete = true;
    } catch (err) {
      console.error("Error initializing drop autocomplete:", err);
    }
  };

  // Google Places Autocomplete Initialization
  useEffect(() => {
    if (activeTab !== 'packages') return;

    let intervalId = setInterval(() => {
      if (pickupInputRef.current && !pickupInputRef.current._hasAutocomplete) {
        initPickupAutocomplete(pickupInputRef.current);
      }
      if (dropInputRef.current && !dropInputRef.current._hasAutocomplete) {
        initDropAutocomplete(dropInputRef.current);
      }
      if (pickupInputRef.current?._hasAutocomplete && dropInputRef.current?._hasAutocomplete) {
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [activeTab, loading]);

  const clearFilters = () => {
    setSearchPickup('');
    setSearchDrop('');
    setPickupCoords(null);
    setDropCoords(null);
    setSelectedRadiusKm(30);
    if (pickupInputRef.current) pickupInputRef.current.value = '';
    if (dropInputRef.current) dropInputRef.current.value = '';
  };

  const hasActiveFilters = Boolean(
    searchPickup.trim() ||
    searchDrop.trim() ||
    pickupCoords ||
    dropCoords ||
    selectedRadiusKm !== 30
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Not Supported',
        text: 'Your browser does not support geolocation.',
        background: '#1a1a1a',
        color: '#fff'
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPickupCoords({ lat, lng });

        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setSearchPickup(results[0].formatted_address);
              if (pickupInputRef.current) pickupInputRef.current.value = results[0].formatted_address;
            } else {
              setSearchPickup('Current Location');
              if (pickupInputRef.current) pickupInputRef.current.value = 'Current Location';
            }
            setIsLocating(false);
          });
        } else {
          setSearchPickup('Current Location');
          if (pickupInputRef.current) pickupInputRef.current.value = 'Current Location';
          setIsLocating(false);
        }
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        Swal.fire({
          icon: 'warning',
          title: 'Location Permission',
          text: 'Unable to retrieve your current location. Please allow location access.',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#ffb703'
        });
      }
    );
  };

  const filteredPackages = packages.filter((pkg) => {
    const qPickup = searchPickup.trim().toLowerCase();
    const qDrop = searchDrop.trim().toLowerCase();

    if (!pickupCoords && !dropCoords && !qPickup && !qDrop) {
      return true;
    }

    const pkgPickupLoc = (pkg.pickupLocation || '').toLowerCase();
    const pkgDropLoc = (pkg.dropLocation || '').toLowerCase();
    const rPickupLat = pkg.pickupLat;
    const rPickupLng = pkg.pickupLng;
    const rDropLat = pkg.dropLat;
    const rDropLng = pkg.dropLng;

    // 1. Pickup filter
    let matchesPickup = true;
    if (pickupCoords && rPickupLat != null && rPickupLng != null) {
      if (selectedRadiusKm > 0) {
        const distKm = calculateDistanceKm(pickupCoords.lat, pickupCoords.lng, rPickupLat, rPickupLng);
        matchesPickup = distKm <= selectedRadiusKm;
      }
    } else if (qPickup) {
      matchesPickup = pkgPickupLoc.includes(qPickup);
    }

    // 2. Drop filter
    let matchesDrop = true;
    if (dropCoords && rDropLat != null && rDropLng != null) {
      if (selectedRadiusKm > 0) {
        const distKm = calculateDistanceKm(dropCoords.lat, dropCoords.lng, rDropLat, rDropLng);
        matchesDrop = distKm <= selectedRadiusKm;
      }
    } else if (qDrop) {
      matchesDrop = pkgDropLoc.includes(qDrop);
    }

    return matchesPickup && matchesDrop;
  });
  
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
                          Save{' '}
                          <span className="text-primary">
                            {offer.discountType === 'PERCENTAGE'
                              ? `${offer.discountAmount}%`
                              : `₹${offer.discountAmount}`}
                          </span>
                          {offer.discountType === 'PERCENTAGE' && offer.maxDiscountAmount > 0 && (
                            <span className="text-lg font-bold text-white/50 ml-2">Upto ₹{offer.maxDiscountAmount}</span>
                          )}
                        </h3>
                        
                        <p className="text-white/60 text-sm mb-8 flex-grow">
                          {offer.discountType === 'PERCENTAGE'
                            ? `Get ${offer.discountAmount}% off${offer.maxDiscountAmount > 0 ? ` (max ₹${offer.maxDiscountAmount})` : ''} on your next ${offer.bookingType.toLowerCase()} ride.`
                            : `Flat ₹${offer.discountAmount} off on your next ${offer.bookingType.toLowerCase()} ride. Apply the promo code during checkout.`
                          }
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
              {/* SEARCH & RADIUS FILTER CARD */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Search Input */}
                  <div className="relative flex items-center bg-black/60 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3 shrink-0"></div>
                    <input
                      ref={(el) => {
                        pickupInputRef.current = el;
                        if (el) initPickupAutocomplete(el);
                      }}
                      type="text"
                      value={searchPickup}
                      onChange={(e) => {
                        setSearchPickup(e.target.value);
                        if (!e.target.value.trim()) setPickupCoords(null);
                      }}
                      placeholder="Search Pickup (e.g. Airport, City...)"
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-white/40 font-medium"
                    />
                    {searchPickup && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchPickup('');
                          setPickupCoords(null);
                          if (pickupInputRef.current) pickupInputRef.current.value = '';
                        }}
                        className="text-white/40 hover:text-white mr-2 p-1"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      title="Use Current Location"
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                    >
                      {isLocating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      ) : (
                        <FaLocationArrow className="text-sm" />
                      )}
                    </button>
                  </div>

                  {/* Drop Search Input */}
                  <div className="relative flex items-center bg-black/60 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3 shrink-0"></div>
                    <input
                      ref={(el) => {
                        dropInputRef.current = el;
                        if (el) initDropAutocomplete(el);
                      }}
                      type="text"
                      value={searchDrop}
                      onChange={(e) => {
                        setSearchDrop(e.target.value);
                        if (!e.target.value.trim()) setDropCoords(null);
                      }}
                      placeholder="Search Drop / Destination (Optional)"
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-white/40 font-medium"
                    />
                    {searchDrop && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchDrop('');
                          setDropCoords(null);
                          if (dropInputRef.current) dropInputRef.current.value = '';
                        }}
                        className="text-white/40 hover:text-white p-1"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Radius Selector & Active Count */}
                <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <FaCrosshairs className="text-primary" /> Search Radius:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[5, 15, 30, 50, 100, -1].map((r) => {
                        const isSelected = selectedRadiusKm === r;
                        const label = r < 0 ? 'All' : `${r} KM`;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSelectedRadiusKm(r)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-primary text-black shadow-md shadow-primary/20'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-white/50 font-semibold">
                      {hasActiveFilters ? (
                        <span className="text-primary font-bold">{filteredPackages.length} of {packages.length}</span>
                      ) : (
                        <span>{packages.length}</span>
                      )}{' '}
                      packages available
                    </span>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                      >
                        <FaRedo className="text-[10px]" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {packages.length === 0 ? (
                <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5">
                  <FaSuitcase className="text-6xl text-white/20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Packages Available</h3>
                  <p className="text-white/60">Currently there are no fixed route packages available.</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-16 bg-[#111] rounded-3xl border border-white/5 p-8">
                  <FaSuitcase className="text-5xl text-white/20 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">No Matching Packages Found</h3>
                  <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                    {selectedRadiusKm > 0
                      ? `No routes starting within ${selectedRadiusKm} KM of your search. Try increasing the radius or clearing filters.`
                      : 'No routes match your search criteria. Try a different location.'}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-primary hover:bg-primary/90 text-black font-bold py-2.5 px-6 rounded-xl text-sm transition"
                  >
                    Show All Packages
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPackages.map((pkg, index) => {
                    const distFromPickup = (pickupCoords && pkg.pickupLat != null && pkg.pickupLng != null)
                      ? calculateDistanceKm(pickupCoords.lat, pickupCoords.lng, pkg.pickupLat, pkg.pickupLng)
                      : null;

                    return (
                      <motion.div
                        key={pkg._id}
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group relative bg-[#111] rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/50 flex flex-col"
                      >
                        {/* Top badges row */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                            <FaCar />
                            <span>{pkg.carCategory?.name}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                            pkg.tripType === 'Round-Trip'
                              ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                              : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                          }`}>
                            {pkg.tripType === 'Round-Trip' ? '🔄 Round-Trip' : '➡️ One-Way'}
                          </div>
                        </div>

                        {/* Distance from searched location */}
                        {distFromPickup != null && (
                          <div className="mb-3 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-semibold flex items-center gap-1.5">
                            <FaLocationArrow className="text-[10px]" />
                            <span>Pickup is {distFromPickup.toFixed(1)} KM from your location</span>
                          </div>
                        )}
                        
                        <div className="mt-2 space-y-4 flex-grow">
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

                        {/* Time limit info */}
                        {pkg.maxTimeHours > 0 && (
                          <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                              <FaClock />
                              <span>Includes {pkg.maxTimeHours} Hours</span>
                            </div>
                            <span className="text-orange-400/70 text-xs font-semibold">
                              +₹{pkg.extraTimeChargePerHour}/hr after
                            </span>
                          </div>
                        )}

                        {/* Toll Note Banner */}
                        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2.5 text-left">
                          <FaInfoCircle className="text-yellow-400 text-sm mt-0.5 shrink-0" />
                          <p className="text-xs leading-snug text-yellow-200/90 font-medium">
                            <span className="font-bold text-yellow-400">Note:</span> Fare ke alawa toll alag se pay karna hoga. Kisi bhi offer / package ride mein toll include nahi hai.
                          </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/10 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Fixed Fare</p>
                            <p className="text-3xl font-black text-white">₹{pkg.price}</p>
                            {pkg.maxTimeHours > 0 && (
                              <p className="text-white/40 text-[10px] mt-0.5">Extra time billed separately</p>
                            )}
                          </div>
                          <button 
                            onClick={() => openBookingModal(pkg)}
                            className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-primary/20"
                          >
                            Book Now
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
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
                <div className="flex flex-wrap justify-between items-center text-sm text-white/60 mt-2 gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span><FaCar className="inline mr-1" /> {bookingModal.pkg?.carCategory?.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      bookingModal.pkg?.tripType === 'Round-Trip'
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                        : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    }`}>
                      {bookingModal.pkg?.tripType === 'Round-Trip' ? '🔄 Round-Trip' : '➡️ One-Way'}
                    </span>
                  </div>
                  <span className="text-white font-bold text-lg">₹{bookingModal.pkg?.price}</span>
                </div>
                {bookingModal.pkg?.maxTimeHours > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-orange-400 text-xs font-semibold bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
                    <FaClock />
                    <span>Package includes {bookingModal.pkg?.maxTimeHours} hours. Extra time billed at ₹{bookingModal.pkg?.extraTimeChargePerHour}/hr.</span>
                  </div>
                )}
                {/* Toll Note in Modal */}
                <div className="mt-3 flex items-start gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-left">
                  <FaInfoCircle className="text-yellow-400 text-sm mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-200/90 leading-relaxed font-medium">
                    <strong className="text-yellow-400">Important Note:</strong> Fare ke alawa Toll tax alag se pay karna hoga. Kisi bhi offer / package ride mein toll include nahi hai.
                  </p>
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
