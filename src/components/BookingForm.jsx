import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../config/api';
import { FaMapMarkerAlt, FaCheckCircle, FaTimes, FaUsers, FaUser, FaArrowRight, FaMobileAlt, FaDotCircle, FaSpinner, FaSearch, FaLocationArrow, FaTaxi, FaClock } from 'react-icons/fa';

const cars = [
  { id: 1, name: 'Economy Bike', emoji: '🛵', price: 15, eta: '3 min', capacity: 1, desc: 'Quick bike ride' },
  { id: 2, name: 'Auto', emoji: '🛺', price: 25, eta: '5 min', capacity: 3, desc: 'Budget friendly' },
  { id: 3, name: 'Mini Cab', emoji: '🚗', price: 45, eta: '6 min', capacity: 4, desc: 'AC sedan' },
  { id: 4, name: 'Prime SUV', emoji: '🚙', price: 75, eta: '8 min', capacity: 4, desc: 'Premium SUV' },
];

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    pickupCoords: null,
    dropoffCoords: null
  });
  const [showMapModal, setShowMapModal] = useState(false);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [showCarSelection, setShowCarSelection] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone');
  const [isNewUserDetected, setIsNewUserDetected] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [distance, setDistance] = useState(null);
  const [distanceValue, setDistanceValue] = useState(0); // in meters or km
  const [rideType, setRideType] = useState('private');
  const [categories, setCategories] = useState([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [showFinalSummaryModal, setShowFinalSummaryModal] = useState(false);
  const [showSeatSelectionModal, setShowSeatSelectionModal] = useState(false);
  const [selectedSeatNames, setSelectedSeatNames] = useState([]);
  const [confirmedCar, setConfirmedCar] = useState(null);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const previewMapRef = useRef(null);
  const summaryMapRef = useRef(null);

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
      if (place.geometry && place.geometry.location) {
        setFormData(prev => ({
          ...prev,
          pickup: place.formatted_address,
          pickupCoords: place.geometry.location
        }));
      }
    });

    dropoffAutocomplete.addListener('place_changed', () => {
      const place = dropoffAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setFormData(prev => ({
          ...prev,
          dropoff: place.formatted_address,
          dropoffCoords: place.geometry.location
        }));
      }
    });
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: 'error',
        title: 'Not Supported',
        text: 'Geolocation is not supported by your browser',
        confirmButtonColor: '#FFD60A',
        iconColor: '#FFD60A',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = { lat: latitude, lng: longitude };

        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              setFormData((prev) => ({
                ...prev,
                pickup: results[0].formatted_address,
                pickupCoords: latlng,
              }));
            } else {
              console.error("Geocoder failed due to: " + status);
            }
            setIsLocating(false);
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        Swal.fire({
          icon: 'warning',
          title: 'Permission Denied',
          text: 'Please enable location permissions to use this feature.',
          confirmButtonColor: '#FFD60A',
        });
      },
      { enableHighAccuracy: true }
    );
  };

  // Map initialization and route calculation
  useEffect(() => {
    if (showMapModal && mapRef.current && window.google) {
      // Small timeout to ensure Framer Motion has rendered the element
      const timeoutId = setTimeout(() => {
        if (!mapRef.current) return;

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Center of India
          zoom: 5,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
          ],
          disableDefaultUI: true,
        });

        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: newMap,
          polylineOptions: {
            strokeColor: '#FFD60A',
            strokeWeight: 5,
          },
          markerOptions: {
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            }
          }
        });

        setMap(newMap);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (!showMapModal) {
      setMap(null); // Reset map when modal closes
    }
  }, [showMapModal]);

  useEffect(() => {
    if (map && formData.pickupCoords && formData.dropoffCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: formData.pickupCoords,
          destination: formData.dropoffCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setDirections(result);
            const route = result.routes[0];
            if (route && route.legs[0]) {
              setDistance(route.legs[0].distance.text);
              setDistanceValue(route.legs[0].distance.value / 1000); // converting meters to km
            }
          }
        }
      );
    }
  }, [map, formData.pickupCoords, formData.dropoffCoords]);

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/car-categories/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Error fetching categories, using fallback:", error);
      // Fallback data if API fails so UI is not empty
      setCategories([
        { _id: '1', name: 'Economy Bike', seatCapacity: 1, privateRatePerKm: 10, sharedRatePerSeatPerKm: 5, baseFare: 15, avgSpeedKmH: 30, image: null },
        { _id: '2', name: 'Prime SUV', seatCapacity: 4, privateRatePerKm: 45, sharedRatePerSeatPerKm: 25, baseFare: 150, avgSpeedKmH: 45, image: null }
      ]);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Preview Map effect
  useEffect(() => {
    if (showCategoriesModal && previewMapRef.current && window.google && formData.pickupCoords && formData.dropoffCoords) {
      const timer = setTimeout(() => {
        const previewMap = new window.google.maps.Map(previewMapRef.current, {
          center: formData.pickupCoords,
          zoom: 12,
          disableDefaultUI: true,
          styles: [{ featureType: 'all', elementType: 'all', stylers: [{ saturation: -100 }] }]
        });

        new window.google.maps.DirectionsRenderer({
          map: previewMap,
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 4 }
        }).setDirections(directionsRendererRef.current.getDirections());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showCategoriesModal, formData.pickupCoords, formData.dropoffCoords]);

  // Summary Map effect
  useEffect(() => {
    if (showFinalSummaryModal && summaryMapRef.current && window.google && formData.pickupCoords) {
      const timer = setTimeout(() => {
        const summaryMap = new window.google.maps.Map(summaryMapRef.current, {
          center: formData.pickupCoords,
          zoom: 16,
          disableDefaultUI: true,
        });
        new window.google.maps.Marker({
          position: formData.pickupCoords,
          map: summaryMap,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFinalSummaryModal, formData.pickupCoords]);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    setShowMapModal(true);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    const token = localStorage.getItem('token');
    if (token) {
      setShowFinalConfirm(true);
    } else {
      setShowPhoneModal(true);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const mock = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mock);
    setOtp(['', '', '', '', '', '']);
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
    if (val && idx < 5) otpRefs[idx + 1].current.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs[idx - 1].current.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    setIsSearching(true);

    try {
      // Using the base URL defined in config
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          otp: otpValue,
          name: userName,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // CASE: New User - Show Name and Email fields
        if (data.isNewUser && (!userName || !userEmail)) {
          setIsNewUserDetected(true);
          setOtpError(false);
          Swal.fire({
            title: 'Welcome!',
            text: "Since you're new, please provide your name and email to finish registration.",
            icon: 'info',
            confirmButtonColor: '#FFD60A',
          });
          return;
        }

        // CASE: Existing User or Registration Complete
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setShowPhoneModal(false);
        setStep('phone');
        setOtp(['', '', '', '', '', '']);
        setIsNewUserDetected(false);
        setShowFinalConfirm(true);
      } else {
        setOtpError(true);
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: data.message || "Invalid OTP entered.",
          confirmButtonColor: '#FFD60A',
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Backend Error',
        text: 'Something went wrong. Please ensure your backend is running at http://localhost:5000',
        confirmButtonColor: '#FFD60A',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFinalBooking = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setShowFinalConfirm(false);
      setShowPhoneModal(true);
      return;
    }

    setShowFinalConfirm(false);
    fetchCategories();
    setShowCategoriesModal(true);
  };

  const handleCarTypeSelect = (car) => {
    setConfirmedCar(car);
    setShowCategoriesModal(false);
    if (rideType === 'shared') {
      setSelectedSeatNames([]); // Reset selection when car changes
      setShowSeatSelectionModal(true);
    } else {
      setShowFinalSummaryModal(true);
    }
  };

  const handleSeatConfirm = () => {
    setShowSeatSelectionModal(false);
    setShowFinalSummaryModal(true);
  };

  const handleBookNow = async () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    const { pickupCoords, dropoffCoords } = formData;

    // Function to safely extract Lat/Lng whether it's a function or a number
    const getCoord = (coordObj, key) => {
      if (!coordObj) return 0;
      if (typeof coordObj[key] === 'function') return coordObj[key]();
      return coordObj[key] || 0;
    };

    const pLat = getCoord(pickupCoords, 'lat');
    const pLng = getCoord(pickupCoords, 'lng');
    const dLat = getCoord(dropoffCoords, 'lat');
    const dLng = getCoord(dropoffCoords, 'lng');

    // Strict Validation
    if (!pLat || !dLat) {
      Swal.fire({
        icon: 'warning',
        title: 'Location Lost',
        text: 'Please clear and re-select your pickup/drop locations to confirm coordinates.',
      });
      return;
    }

    const bookingData = {
      userId: userData?._id,
      passengerName: userData?.name || "Vivek Kumar",
      passengerPhone: userData?.phone || "9876543210",
      rideType: rideType === 'private' ? 'Private' : 'Shared',
      carCategoryId: confirmedCar?._id,
      pickupAddress: formData.pickup,
      pickupLat: Number(pLat),
      pickupLng: Number(pLng),
      dropAddress: formData.dropoff,
      dropLat: Number(dLat),
      dropLng: Number(dLng),
      distanceKm: Number(distanceValue) || 0,
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    if (rideType === 'shared') {
      bookingData.seatsBooked = selectedSeatNames.length;
      bookingData.selectedSeats = selectedSeatNames;
    }

    console.log("Full Booking Payload:", bookingData);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.success) {
        setShowFinalSummaryModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Booking Successful!',
          text: `Your ${bookingData.rideType} ride is confirmed!`,
          confirmButtonColor: '#10b981',
        }).then(() => {
          setIsSearching(true);
          setTimeout(() => {
            setIsSearching(false);
            navigate('/driver-tracking');
          }, 3000);
        });
      } else {
        // If server returns success:false, show why
        throw new Error(data.message || data.error || "Server validation failed");
      }
    } catch (error) {
      console.error("DEBUG: Booking Creation Failed ->", error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.message || 'Server returned an error. Check console!',
        confirmButtonColor: '#ef4444',
      });
    }
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
            <div className="relative flex items-center group">
              <FaDotCircle className="absolute left-4 text-primary text-xs z-10" />
              <input
                ref={pickupRef}
                type="text"
                required
                placeholder="Pickup location"
                value={formData.pickup}
                onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 py-4 text-white text-sm outline-none focus:border-primary transition-all placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className={`absolute right-4 p-2 rounded-xl transition-all ${isLocating ? 'text-primary animate-pulse' : 'text-white/20 hover:text-primary hover:bg-primary/10'
                  }`}
                title="Use current location"
              >
                <FaLocationArrow className="text-xs" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4">
              <div className="w-px h-4 bg-white/20 ml-[3px]" />
            </div>

            <div className="relative flex items-center">
              <FaMapMarkerAlt className="absolute left-4 text-white/40 text-xs" />
              <input
                ref={dropoffRef}
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

      {/* UNIFIED MAP + CAR SELECTION MODAL */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => { setShowMapModal(false); setMap(null); }} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-7xl h-[100vh] md:h-[90vh] bg-[#0a0a0a] md:rounded-3xl border-0 md:border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Map Container */}
              <div className="flex-1 relative order-2 md:order-1 h-[45vh] md:h-full border-t md:border-t-0 md:border-r border-white/10">
                <div ref={mapRef} className="w-full h-full" />

                {/* Float Close Button for Mobile */}
                <button
                  onClick={() => { setShowMapModal(false); setMap(null); }}
                  className="absolute top-4 left-4 md:hidden w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white z-[20]"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Right Side: Details & Car Selection */}
              <div className="w-full md:w-[450px] flex flex-col order-1 md:order-2 bg-[#111] overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-black text-2xl" style={{ fontFamily: 'Syne, sans-serif' }}>Select Ride</h3>
                    <button onClick={() => { setShowMapModal(false); setMap(null); }} className="hidden md:flex w-9 h-9 bg-white/5 rounded-full items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative pl-7 border-l-2 border-dashed border-white/10 ml-1.5 space-y-4">
                      <div className="relative">
                        <FaDotCircle className="absolute -left-[31px] top-1 text-primary text-[10px] bg-[#111] p-0.5" />
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter mb-0.5">Pickup Location</p>
                        <p className="text-white text-sm font-bold truncate leading-tight">{formData.pickup}</p>
                      </div>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute -left-[31px] top-1 text-red-500 text-[10px] bg-[#111] p-0.5" />
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter mb-0.5">Drop-off Location</p>
                        <p className="text-white text-sm font-bold truncate leading-tight">{formData.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">Available Options</p>
                  {cars.map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCarSelect(car)}
                      className="flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-primary/40 rounded-2xl cursor-pointer transition-all group"
                    >
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                        {car.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-white font-bold text-sm tracking-tight">{car.name}</h4>
                          <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">{car.eta}</span>
                        </div>
                        <p className="text-white/30 text-[10px] font-medium leading-tight line-clamp-1">{car.desc}</p>
                        <div className="flex items-center gap-2 mt-1 text-white/20 text-[10px]">
                          <span className="flex items-center gap-1"><FaUsers size={9} /> {car.capacity}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span>AC Available</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 px-2">
                        <div className="text-primary font-black text-xl italic tracking-tighter">₹{car.price}</div>
                        <div className="text-white/20 text-[9px] uppercase font-bold">Base Fare</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-primary/5 border-t border-white/5">
                  <p className="text-primary/60 text-[10px] text-center font-medium">Prices may vary based on traffic and demand</p>
                </div>
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
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-black/80" onClick={() => { setShowPhoneModal(false); setStep('phone'); }} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[400px] bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Background glow decorate */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

              <button onClick={() => { setShowPhoneModal(false); setStep('phone'); }} className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10">
                <FaTimes size={14} />
              </button>

              <AnimatePresence mode="wait">
                {step === 'phone' ? (
                  <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
                      <FaMobileAlt className="text-primary text-2xl" />
                    </div>
                    <h3 className="text-white font-black text-3xl mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Verify Mobile</h3>
                    <p className="text-white/40 text-sm mb-8 leading-relaxed">We'll send a 4-digit code to verify your booking.</p>

                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] ml-2">Phone Number</label>
                        <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/[0.05] transition-all group">
                          <span className="px-5 text-white/40 text-base font-black border-r border-white/5 py-4 bg-white/[0.02] group-focus-within:text-primary transition-colors">+91</span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="7000xxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="flex-1 bg-transparent px-5 py-4 text-white text-lg font-bold outline-none placeholder:text-white/10 tracking-widest"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={phone.length !== 10}
                        className="w-full bg-primary text-black font-black py-5 rounded-[1.25rem] text-sm tracking-widest hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                      >
                        GET VERIFICATION CODE
                      </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2">
                      <FaCheckCircle className="text-green-500/50 text-[10px]" />
                      <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Secured by KwibCabs</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                    <button onClick={() => { setStep('phone'); setIsNewUserDetected(false); }} className="text-primary text-xs font-bold mb-6 hover:underline flex items-center gap-2 transition-all">
                      <span className="text-base">←</span> Edit Number (+91 {phone})
                    </button>
                    <h3 className="text-white font-black text-3xl mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Enter Code</h3>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed">Enter the 4-digit code we've sent to your device.</p>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      {/* Name and Email fields - show only if isNewUserDetected is true */}
                      {isNewUserDetected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pb-4 border-b border-white/5 mb-4"
                        >
                          <div className="space-y-2">
                            <label className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] ml-2">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] ml-2">Email Address</label>
                            <input
                              type="email"
                              required
                              placeholder="email@example.com"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="flex gap-2 justify-between mb-8">
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
                            className={`w-12 h-16 text-center text-white text-2xl font-black bg-white/[0.03] border-2 rounded-xl outline-none transition-all ${otpError ? 'border-red-500/50 bg-red-500/5' : digit ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,214,10,0.1)]' : 'border-white/10 focus:border-primary/50'
                              }`}
                          />
                        ))}
                      </div>

                      <div className="space-y-4">
                        {otpError && <p className="text-red-400 text-xs text-center font-bold animate-shake">Incorrect code. Please check and try again.</p>}

                        <button
                          type="submit"
                          disabled={otp.join('').length !== 6 || (isNewUserDetected && (!userName || !userEmail))}
                          className="w-full bg-primary text-black font-black py-5 rounded-[1.25rem] text-sm tracking-widest hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                        >
                          {isNewUserDetected ? 'FINISH REGISTRATION' : 'VERIFY & BOOK NOW'}
                        </button>

                        <button type="button" onClick={handleSendOtp} className="w-full text-white/40 text-xs font-bold hover:text-primary transition-all py-2">
                          Didn't receive code? <span className="underline ml-1">Resend</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL BOOKING CONFIRMATION - OVERHAULED */}
      <AnimatePresence>
        {showFinalConfirm && selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowFinalConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Header: Distance Calculated */}
              <div className="bg-green-500/10 border-b border-green-500/20 p-6 text-center">
                <p className="text-green-500 text-[10px] uppercase font-black tracking-widest mb-1">Distance Calculated</p>
                <div className="flex flex-col items-center">
                  <p className="text-white/40 text-[10px] mb-2">From: {formData.pickup.split(',')[0]} To: {formData.dropoff.split(',')[0]}</p>
                  <h4 className="text-4xl font-black text-green-500 italic tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>{distance || 'Calculating...'}</h4>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <FaTaxi />
                  </div>
                  <h3 className="text-white font-black text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>Choose Ride Type</h3>
                </div>

                {/* Ride Type Selection Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setRideType('private')}
                    className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all ${rideType === 'private' ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(255,214,10,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${rideType === 'private' ? 'bg-primary text-black' : 'bg-white/10 text-white/40'}`}>
                      <FaLocationArrow className="rotate-45" />
                    </div>
                    <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-tighter">Private Ride</h5>
                    <p className="text-white/30 text-[9px] font-medium">Direct & Fast</p>
                    {rideType === 'private' && <FaCheckCircle className="absolute top-4 right-4 text-primary text-xs" />}
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setRideType('shared')}
                    className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all ${rideType === 'shared' ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${rideType === 'shared' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'}`}>
                      <FaUsers />
                    </div>
                    <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-tighter">Shared Ride</h5>
                    <p className="text-white/30 text-[9px] font-medium">Wait & Save</p>
                    {rideType === 'shared' && <FaCheckCircle className="absolute top-4 right-4 text-blue-500 text-xs" />}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleFinalBooking}
                    className="w-full bg-primary text-black font-black py-5 rounded-2xl text-sm tracking-widest hover:bg-yellow-400 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    CONFIRM {rideType.toUpperCase()} BOOKING <FaArrowRight />
                  </button>
                  <button
                    onClick={() => setShowFinalConfirm(false)}
                    className="w-full text-white/30 hover:text-white text-xs font-bold py-2 transition-all"
                  >
                    Back to Location
                  </button>
                </div>
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
      {/* NEW WHITE THEMED CAR SELECTION SCREEN */}
      <AnimatePresence>
        {showCategoriesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10005] flex items-center justify-center bg-gray-100/80 backdrop-blur-md p-4 sm:p-8 overflow-y-auto"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              {/* Top Map Section (Small Preview) */}
              <div className="relative h-48 sm:h-56 border-b border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#f8f9fa]">
                  <div ref={previewMapRef} className="w-full h-full" />
                </div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <div className="bg-white/90 backdrop-blur shadow-sm px-4 py-1.5 rounded-full flex items-center gap-2 border border-blue-100">
                    <FaLocationArrow className="text-blue-500 text-[10px]" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Route Map Preview</span>
                  </div>
                  <button onClick={() => setShowCategoriesModal(false)} className="w-8 h-8 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-gray-100">
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>

              {/* Car List Section */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaTaxi className="text-blue-600 text-lg" />
                    <h3 className="text-gray-800 font-bold text-lg">Select a Cab</h3>
                  </div>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{categories.length} Available</span>
                </div>

                <AnimatePresence mode="wait">
                  {isCategoriesLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                      <FaSpinner className="text-blue-500 animate-spin text-4xl" />
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic animate-pulse">Fetching Best Rides...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {categories.map((car) => {
                        const pricePerKm = rideType === 'private' ? car.privateRatePerKm : car.sharedRatePerSeatPerKm;
                        const calculatedPrice = Math.round(car.baseFare + (distanceValue * pricePerKm));

                        return (
                          <motion.div
                            key={car._id}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleCarTypeSelect(car)}
                            className="group relative flex items-center gap-4 p-5 bg-white hover:bg-blue-50/20 border border-gray-200 hover:border-blue-200 rounded-[2rem] cursor-pointer transition-all shadow-sm"
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                              <img
                                src={car.image ? `http://localhost:5000/uploads/${car.image}` : `https://cdn-icons-png.flaticon.com/512/3202/3202926.png`}
                                alt={car.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-gray-900 font-bold text-base">{car.name}</h4>
                                {car.avgSpeedKmH > 35 && (
                                  <span className="bg-yellow-400 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest text-black">Fastest</span>
                                )}
                              </div>
                              <p className="text-gray-400 text-[10px] font-medium mb-3">Comfortable {car.seatCapacity} seater rides</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                  <FaClock className="text-blue-500/50" />
                                  <span>{Math.round(distanceValue * 2)} min</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                  <FaLocationArrow className="text-blue-500/50 rotate-45" />
                                  <span>{new Date(Date.now() + distanceValue * 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <h2 className="text-2xl font-black text-green-600 tracking-tighter italic">₹{calculatedPrice}</h2>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8">
                  <button
                    onClick={() => { setShowCategoriesModal(false); setShowFinalConfirm(true); }}
                    className="w-full border border-gray-200 text-gray-500 font-bold py-4 rounded-2xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    Back to Ride Type
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FINAL SUMMARY MODAL - WHITE THEME */}
      <AnimatePresence>
        {showFinalSummaryModal && confirmedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10008] flex items-center justify-center bg-gray-100/90 backdrop-blur-md p-4 sm:p-8 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden p-6 sm:p-10"
            >
              <div className="space-y-8">
                {/* Pickup Section */}
                <div className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <FaDotCircle className="text-green-500 text-sm" />
                    <h4 className="text-gray-800 font-bold text-base">Pickup Location</h4>
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-200 mb-4">
                    <div ref={summaryMapRef} className="w-full h-full" />
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{formData.pickup}</p>
                  </div>
                </div>

                {/* Selected Car Section */}
                <div className="space-y-4">
                  <h4 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] ml-2">Selected Cab</h4>
                  <div className="bg-blue-50/20 border border-blue-100/50 rounded-[2rem] p-6 flex flex-wrap sm:flex-nowrap items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110">
                      <FaTaxi size={100} className="text-blue-500" />
                    </div>
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm p-3 z-10">
                      <img
                        src={confirmedCar.image ? `http://localhost:5000/uploads/${confirmedCar.image}` : `https://cdn-icons-png.flaticon.com/512/3202/3202926.png`}
                        alt={confirmedCar.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 z-10">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-gray-900 font-black text-2xl">{confirmedCar.name}</h3>
                        <p className="text-green-600 font-black text-2xl">₹{Math.round((confirmedCar.baseFare + (distanceValue * (rideType === 'private' ? confirmedCar.privateRatePerKm : confirmedCar.sharedRatePerSeatPerKm))) * (rideType === 'shared' ? selectedSeatNames.length : 1))}</p>
                      </div>
                      <p className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">{rideType} • {rideType === 'shared' ? `Seats: ${selectedSeatNames.join(', ')}` : `${confirmedCar.seatCapacity} seat(s)`}</p>
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest">
                          <FaClock className="animate-pulse" />
                          <span>{Math.round(distanceValue * 2)} mins away</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                          <FaLocationArrow className="rotate-45" />
                          <span>Drop {new Date(Date.now() + distanceValue * 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowFinalSummaryModal(false)}
                    className="px-8 py-5 bg-white border border-gray-200 text-gray-500 font-black rounded-2xl text-sm hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="flex-1 bg-green-600 text-white py-5 rounded-2xl text-sm font-black tracking-widest hover:bg-green-700 shadow-xl shadow-green-600/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <FaCheckCircle /> CONFIRM BOOKING
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSeatSelectionModal && confirmedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10007] flex items-center justify-center bg-gray-100/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 overflow-y-auto"
              style={{ maxHeight: '90vh' }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <FaUsers size={24} />
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-2">Pick Your Seats</h3>
                <p className="text-gray-400 text-xs font-medium">Select specific seats for your shared ride in {confirmedCar.name}</p>
              </div>

              {/* SEAT LAYOUT DISPLAY */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {confirmedCar.seatLayout && confirmedCar.seatLayout.length > 0 ? (
                  confirmedCar.seatLayout.map((seatName, idx) => {
                    const isSelected = selectedSeatNames.includes(seatName);
                    return (
                      <motion.div
                        key={`${seatName}-${idx}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSeatNames(prev => prev.filter(s => s !== seatName));
                          } else {
                            if (selectedSeatNames.length < confirmedCar.seatCapacity) {
                              setSelectedSeatNames(prev => [...prev, seatName]);
                            } else {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Limit Reached',
                                text: `This vehicle only has ${confirmedCar.seatCapacity} seats.`,
                                timer: 1500,
                                showConfirmButton: false
                              });
                            }
                          }
                        }}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20 text-white' 
                            : 'bg-white border-gray-100 hover:border-blue-200 text-gray-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-blue-50 text-blue-500'}`}>
                          <FaUser size={12} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[11px] font-black uppercase tracking-tight truncate block">{seatName}</span>
                        </div>
                        {isSelected && <FaCheckCircle size={12} className="text-white" />}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-10 text-center text-gray-400 text-xs italic">
                    No individual seat names defined for this vehicle.
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-100/50 rounded-2xl p-5 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">Fare Calculation</p>
                  <h4 className="text-xl font-black text-blue-600 tracking-tighter italic">
                    ₹{Math.round((confirmedCar.baseFare + (distanceValue * confirmedCar.sharedRatePerSeatPerKm)) * (selectedSeatNames.length || 1))}
                  </h4>
                  <p className="text-gray-400 text-[8px] font-bold mt-1">
                    {selectedSeatNames.length || 0} Seat(s) selected
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[9px] font-bold uppercase mb-1">Ride Mode</p>
                  <p className="text-blue-600 font-black text-[10px] tracking-widest uppercase">Shared Economy</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowSeatSelectionModal(false)} className="px-6 py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 transition-all font-syne">Back</button>
                <button 
                  disabled={selectedSeatNames.length === 0}
                  onClick={handleSeatConfirm} 
                  className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  Confirm Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingForm;
