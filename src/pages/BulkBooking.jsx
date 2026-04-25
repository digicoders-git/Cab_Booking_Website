import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCar, FaCalendarAlt, FaClock, FaMapMarkerAlt,
  FaPlus, FaMinus, FaChevronRight, FaTimes, FaCheckCircle,
  FaPercentage, FaWallet, FaTruck, FaCarSide
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL, BASE_URL } from '../config/api';

// --- Helper: Load Razorpay Script ---
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BulkBooking = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCars, setSelectedCars] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    pickupCoords: { lat: 0, lng: 0 },
    dropCoords: { lat: 0, lng: 0 },
    date: '',
    time: '',
    tripType: 'OneWay',
    returnDate: '',
    days: 1,
    notes: '',
    distance: 0,
    priceModifier: 0 // Percentage
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null); // NEW: Track payment specific failure
  const [pendingPaymentData, setPendingPaymentData] = useState(null); // NEW: Store ID & Amount for retry
  const [myRequests, setMyRequests] = useState([]);

  const pickupRef = useRef();
  const dropRef = useRef();

  useEffect(() => {
    fetchCategories();
    initAutocomplete();
    fetchMyRequests();
  }, []);

  // ⏱️ Auto-calculate Days based on Dates for Round Trip
  useEffect(() => {
    if (formData.tripType === 'RoundTrip' && formData.date && formData.returnDate) {
      const start = new Date(formData.date);
      const end = new Date(formData.returnDate);

      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
        setFormData(prev => ({ ...prev, days: diffDays }));
      } else {
        setFormData(prev => ({ ...prev, days: 1 }));
      }
    } else if (formData.tripType === 'OneWay') {
      // Optional: Reset to 1 day for One Way if you want, but often 1 day is default
      // setFormData(prev => ({ ...prev, days: 1 }));
    }
  }, [formData.date, formData.returnDate, formData.tripType]);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/bulk-bookings/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMyRequests(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch my requests", err);
    }
  };

  const initAutocomplete = () => {
    if (!window.google) return;

    const options = {
      componentRestrictions: { country: "in" },
      fields: ["address_components", "geometry", "formatted_address"],
    };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    const dropAutocomplete = new window.google.maps.places.Autocomplete(dropRef.current, options);

    pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          pickup: place.formatted_address,
          pickupCoords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
        }));
      }
      calculateDistance();
    });

    dropAutocomplete.addListener("place_changed", () => {
      const place = dropAutocomplete.getPlace();
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          drop: place.formatted_address,
          dropCoords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
        }));
      }
      calculateDistance();
    });
  };

  const calculateDistance = () => {
    if (!window.google || !pickupRef.current.value || !dropRef.current.value) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickupRef.current.value],
        destinations: [dropRef.current.value],
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK" && response.rows[0].elements[0].status === "OK") {
          const distKm = response.rows[0].elements[0].distance.value / 1000;
          setFormData(prev => ({ ...prev, distance: Math.round(distKm) }));
        }
      }
    );
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/car-categories/active`);
      const data = await response.json();
      if (data.success) {
        // Filter categories that have bulk price set
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Fetch categories failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = (cat) => {
    setSelectedCars(prev => {
      const existing = prev.find(item => item.id === cat._id);
      if (existing) {
        return prev.map(item => item.id === cat._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: cat._id, name: cat.name, image: cat.image, price: cat.bulkBookingBasePrice || 1000, quantity: 1 }];
    });
  };

  const handleRemoveCar = (catId) => {
    setSelectedCars(prev => {
      const existing = prev.find(item => item.id === catId);
      if (existing.quantity > 1) {
        return prev.map(item => item.id === catId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== catId);
    });
  };

  const calculateTotal = () => {
    // Formula: Rate (KM) * Quantity * Days * Distance (KM)
    // Multiplier for Round Trip
    const distanceMultiplier = formData.tripType === 'RoundTrip' ? 2 : 1;

    const baseTotal = selectedCars.reduce((acc, car) => acc + (car.price * car.quantity * formData.days * ((formData.distance || 0) * distanceMultiplier)), 0);
    const modified = baseTotal + (baseTotal * (formData.priceModifier / 100));
    return Math.round(modified);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 🛡️ FRONTEND VALIDATION
    if (!formData.pickup || !formData.drop) {
      setError("Please select both Pickup and Drop locations.");
      return;
    }
    if (!formData.date || !formData.time) {
      setError("Please select Pickup Date and Time.");
      return;
    }
    if (formData.tripType === 'RoundTrip' && !formData.returnDate) {
      setError("Please select a Return Date for Round Trip.");
      return;
    }
    if (selectedCars.length === 0) {
      setError("Please select at least one vehicle category.");
      return;
    }
    if (formData.distance <= 0) {
      setError("Waiting for Google Maps to calculate distance. Please wait a moment...");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        pickup: {
          address: formData.pickup,
          latitude: formData.pickupCoords.lat,
          longitude: formData.pickupCoords.lng
        },
        drop: {
          address: formData.drop,
          latitude: formData.dropCoords.lat,
          longitude: formData.dropCoords.lng
        },
        pickupDateTime: `${formData.date}T${formData.time}`,
        tripType: formData.tripType,
        returnDateTime: formData.tripType === 'RoundTrip' ? `${formData.returnDate}T${formData.time}` : null,
        numberOfDays: formData.days,
        totalDistance: formData.distance,
        carsRequired: selectedCars.map(c => ({ category: c.id, quantity: c.quantity })),
        offeredPrice: calculateTotal(),
        notes: formData.notes
      };

      const response = await fetch(`${API_BASE_URL}/bulk-bookings/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        const { bookingId, advanceAmount } = data;
        setPendingPaymentData({ bookingId, advanceAmount }); // Save for retry
        initiateRazorpay(bookingId, advanceAmount);
      } else {
        setError(data.message || "Booking failed.");
      }
    } catch (err) {
      setError("Booking failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpay = async (bookingId, advanceAmount) => {
    const token = localStorage.getItem('token');
    setPaymentError(null);
    setLoading(true);

    const resScript = await loadRazorpay();
    if (!resScript) {
      setPaymentError("Razorpay SDK failed to load. Check your connection.");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: advanceAmount * 100, // in paise
      currency: "INR",
      name: "Cab Booking Bulk",
      description: "25% Advance for Bulk Booking",
      handler: async (response) => {
        console.log("✅ Razorpay Payment Success:", response);
        try {
          setLoading(true);
          const verifyRes = await fetch(`${API_BASE_URL}/bulk-bookings/verify-payment`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              bookingId,
              paymentId: response.razorpay_payment_id,
              type: 'advance'
            })
          });
          const verifyData = await verifyRes.json();
          console.log("📡 Backend Verification Result:", verifyData);
          if (verifyData.success) {
            setSuccess(true);
            setPendingPaymentData(null);
            fetchMyRequests();
          } else {
            setPaymentError("Payment verification failed. Contact support.");
          }
        } catch (err) {
          console.error("❌ Verification Error:", err);
          setPaymentError("Verification error occurred.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: localStorage.getItem('userName') || '',
        contact: localStorage.getItem('userPhone') || ''
      },
      theme: { color: "#FFB600" },
      modal: {
        onDismiss: function () {
          console.log("⚠️ Razorpay Payment Modal Dismissed by User");
          setPaymentError("Payment was cancelled. Please pay the advance to publish your request.");
          setLoading(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      console.log("❌ RAZORPAY STATUS: FAILED");
      console.error("Reason:", response.error.description);
      console.error("Error Code:", response.error.code);
      setPaymentError(`Payment Failed: ${response.error.description}`);
      setLoading(false);
    });

    console.log("🚀 RAZORPAY STATUS: MODAL OPENING...");
    paymentObject.open();
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bulk-bookings/cancel/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchMyRequests();
      } else {
        alert(data.message || "Cancellation failed.");
      }
    } catch (err) {
      console.error("Cancellation error", err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-[#111] border border-white/10 rounded-3xl p-10 text-center"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-primary text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request Live on Marketplace!</h2>
          <p className="text-white/60 mb-8">
            Your bulk booking request has been shared with all eligible Fleet owners.
            You will receive a notification as soon as a Fleet owner accepts your deal.
          </p>
          <button
            onClick={() => navigate('/my-bulk-bookings')}
            className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,182,0,0.4)] transition-all"
          >
            Track My Requests
          </button>
        </motion.div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-[#111] border border-red-500/20 rounded-3xl p-10 text-center"
        >
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Payment Unsuccessful</h2>
          <p className="text-white/60 mb-8">
            {paymentError}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => initiateRazorpay(pendingPaymentData.bookingId, pendingPaymentData.advanceAmount)}
              className="flex-1 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,182,0,0.4)] transition-all"
            >
              Retry Payment
            </button>
            <button
              onClick={() => { setPaymentError(null); setSuccess(false); }}
              className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <PageHeader title="Bulk Booking Marketplace" subtitle="Rent multiple cars for events, tours or weddings at your own price." />

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Form & Selection */}
          <div className="lg:col-span-8 space-y-8">

            {/* Step 1: Car Selection */}
            <div className={`bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 sm:p-8 transition-all ${step === 1 ? 'border-primary/50' : ''}`}>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Select Your Fleet</h3>
              </div>

              {loading ? (
                <div className="h-40 flex items-center justify-center text-white/30">Loading approved cars...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {(categories || []).map((cat) => (
                    <motion.div
                      key={cat._id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      {/* Left: Image + Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`${BASE_URL}/uploads/${cat.image}`}
                          alt={cat.name}
                          className="w-14 h-10 sm:w-16 sm:h-12 object-contain rounded-lg bg-black/50 p-1.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-white font-bold text-sm truncate">{cat.name}</h4>
                          <p className="text-primary text-[11px] font-semibold">₹{cat.bulkBookingBasePrice || 1000}/km</p>
                        </div>
                      </div>

                      {/* Right: Counter */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRemoveCar(cat._id)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                        >
                          <FaMinus size={11} />
                        </button>
                        <span className="text-white font-bold w-5 text-center text-sm">
                          {selectedCars.find(c => c.id === cat._id)?.quantity || 0}
                        </span>
                        <button
                          onClick={() => handleAddCar(cat)}
                          className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Trip Details */}
            <div className={`bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 transition-all ${step === 2 ? 'border-primary/50' : ''}`}>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-bold text-white">Journey Details</h3>
              </div>

              {/* Trip Type Selector */}
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 max-w-sm">
                <button
                  onClick={() => setFormData({ ...formData, tripType: 'OneWay' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.tripType === 'OneWay' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                >
                  One Way
                </button>
                <button
                  onClick={() => setFormData({ ...formData, tripType: 'RoundTrip' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.tripType === 'RoundTrip' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Round Trip
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Pickup Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      ref={pickupRef}
                      type="text"
                      placeholder="Street, City, Area"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Drop Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input
                      ref={dropRef}
                      type="text"
                      placeholder="Destination Address"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Pickup Date</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="date"
                      value={formData.date}
                      min={getTodayDate()}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          date: newDate,
                          returnDate: prev.returnDate < newDate ? newDate : prev.returnDate
                        }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Pickup Time</label>
                  <div className="relative">
                    <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {formData.tripType === 'RoundTrip' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Return Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="date"
                        value={formData.returnDate}
                        min={formData.date || getTodayDate()}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Number of Days</label>
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl">
                    {formData.tripType === 'OneWay' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, days: Math.max(1, formData.days - 1) })}
                          className="w-14 h-14 flex items-center justify-center text-white/40 hover:text-white"
                        >
                          <FaMinus size={12} />
                        </button>
                        <input
                          type="number"
                          value={formData.days}
                          readOnly
                          className="flex-1 bg-transparent text-center text-white font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, days: formData.days + 1 })}
                          className="w-14 h-14 flex items-center justify-center text-white/40 hover:text-white"
                        >
                          <FaPlus size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 py-4 text-center text-white font-bold bg-white/10 rounded-xl">
                        {formData.days} Day(s) <span className="text-[10px] text-primary block mt-0.5">Calculated from dates</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Total Distance (KM)</label>
                  <div className="relative">
                    <FaCarSide className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="number"
                      readOnly
                      placeholder="Automatic calculation"
                      value={formData.distance}
                      className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-primary/70 mt-1 font-bold">Auto-calculated using Google Maps</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaWallet className="text-primary" /> Booking Summary
                </h3>

                <div className="space-y-4 mb-8">
                  {selectedCars.length === 0 && (
                    <p className="text-white/20 text-center py-4 italic">No cars selected yet.</p>
                  )}
                  {selectedCars.map(car => (
                    <div key={car.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-white/70">
                        <span className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-[10px] font-bold">{car.quantity}x</span>
                        {car.name}
                      </div>
                      <span className="text-white font-semibold">₹{(car.price * car.quantity * formData.days * (formData.distance || 0)).toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Duration</span>
                      <span>{formData.days} Day(s)</span>
                    </div>
                  </div>
                </div>

                {/* Added: Smaller Marketplace Offer inside Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Market Boost</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${formData.priceModifier >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {formData.priceModifier > 0 ? '+' : ''}{formData.priceModifier}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20" max="100" step="5"
                    value={formData.priceModifier}
                    onChange={(e) => setFormData({ ...formData, priceModifier: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary mb-3"
                  />
                  <p className="text-[9px] text-white/30 italic">Tip: +10% boost ensures faster fleet acceptance.</p>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8">
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">Total Offer</span>
                    <span className="text-primary text-2xl">₹{calculateTotal()}</span>
                  </div>
                  <p className="text-[9px] text-white/30 text-right uppercase tracking-tighter">*Final marketplace bid</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-500 text-sm">
                    <FaTimes /> {error}
                  </div>
                )}

                <button
                  disabled={selectedCars.length === 0 || loading || !formData.pickup}
                  onClick={handleSubmit}
                  className="w-full group relative py-3.5 sm:py-4 bg-primary text-black text-sm sm:text-base font-extrabold rounded-xl overflow-hidden transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Processing...' : 'Place Request on Marketplace'}
                    {!loading && <FaChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />}
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </div>

              {/* Safety/Trust Badge */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex items-center gap-4 text-white/40">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                  <FaTruck size={20} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Approved Fleets Only</h4>
                  <p className="text-xs">Only verified owners can accept.</p>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
};

export default BulkBooking;
