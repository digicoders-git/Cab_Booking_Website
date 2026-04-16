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
    days: 1,
    notes: '',
    distance: 0,
    priceModifier: 0 // Percentage
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  const pickupRef = useRef();
  const dropRef = useRef();

  useEffect(() => {
    fetchCategories();
    initAutocomplete();
    fetchMyRequests();
  }, []);

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
  const baseTotal = selectedCars.reduce((acc, car) => acc + (car.price * car.quantity * formData.days * (formData.distance || 0)), 0);
  const modified = baseTotal + (baseTotal * (formData.priceModifier / 100));
  return Math.round(modified);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
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
      setSuccess(true);
      fetchMyRequests(); // Refresh table
    } else {
      setError(data.message || "Booking failed.");
    }
  } catch (err) {
    setError("Booking failed. Please check your connection.");
  } finally {
    setLoading(false);
  }
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
              <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-bold text-white">Journey Details</h3>
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
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              <div>
                <label className="text-white/40 text-xs uppercase font-bold mb-2 block">Number of Days</label>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl">
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
                className="w-full group relative py-4 bg-primary text-black font-extrabold rounded-xl overflow-hidden transition-all disabled:opacity-30 disabled:grayscale"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : 'Place Request on Marketplace'}
                  {!loading && <FaChevronRight className="group-hover:translate-x-1 transition-transform" />}
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
