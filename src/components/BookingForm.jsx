import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE_URL, BASE_URL } from '../config/api';
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

  // New Map Instances Refs
  const googlePreviewMap = useRef(null);
  const driverMarkers = useRef([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    const fetchPincode = (location, callback) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results) {
          const pin = results.find(r => r.types.includes("postal_code"))?.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
          if (!pin) {
             // Fallback: check all components of the first result
             const altPin = results[0]?.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
             callback(altPin);
          } else {
             callback(pin);
          }
        } else {
          callback(null);
        }
      });
    };

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
        const latlng = place.geometry.location;
        const directPin = place.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
        
        if (!directPin) {
          fetchPincode(latlng, (pin) => {
            setFormData(prev => ({
              ...prev,
              pickup: place.formatted_address,
              pickupCoords: latlng,
              pickupPin: pin
            }));
            if (pin) console.log("🕵️ Smart PIN Hunter: Found missing PIN", pin);
          });
        } else {
          setFormData(prev => ({
            ...prev,
            pickup: place.formatted_address,
            pickupCoords: latlng,
            pickupPin: directPin
          }));
        }
      }
    });

    dropoffAutocomplete.addListener('place_changed', () => {
      const place = dropoffAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const latlng = place.geometry.location;
        const directPin = place.address_components?.find(c => c.types.includes("postal_code"))?.long_name;

        if (!directPin) {
          fetchPincode(latlng, (pin) => {
            setFormData(prev => ({
              ...prev,
              dropoff: place.formatted_address,
              dropoffCoords: latlng,
              dropoffPin: pin
            }));
          });
        } else {
          setFormData(prev => ({
            ...prev,
            dropoff: place.formatted_address,
            dropoffCoords: latlng,
            dropoffPin: directPin
          }));
        }
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
          zoom: window.innerWidth < 768 ? 16 : 5,
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
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#FFD60A',
            strokeWeight: 6,
            strokeOpacity: 0.9,
          }
        });

        setMap(newMap);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (!showMapModal) {
      setMap(null); // Reset map when modal closes
    }
  }, [showMapModal]);

  // Global Marker Refs to prevent duplication
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);

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

            // Handle Custom Markers (Suppressed default ones)
            if (pickupMarker.current) pickupMarker.current.setMap(null);
            if (dropoffMarker.current) dropoffMarker.current.setMap(null);

            pickupMarker.current = new window.google.maps.Marker({
              position: formData.pickupCoords,
              map: map,
              icon: {
                url: '/admins/user_marker-removebg-preview.png',
                scaledSize: new window.google.maps.Size(80, 80),
                anchor: new window.google.maps.Point(40, 75)
              },
              title: "Pickup",
              zIndex: 1000
            });

            dropoffMarker.current = new window.google.maps.Marker({
              position: formData.dropoffCoords,
              map: map,
              icon: {
                url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Standard Red Drop
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 40)
              },
              title: "Dropoff"
            });
          }
        }
      );
    }
  }, [map, formData.pickupCoords, formData.dropoffCoords]);

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    const token = localStorage.getItem('token');

    // Safely extract coordinates
    const getCoord = (coordObj, key) => {
      if (!coordObj) return 0;
      if (typeof coordObj[key] === 'function') return coordObj[key]();
      return coordObj[key] || 0;
    };

    const pLat = getCoord(formData.pickupCoords, 'lat');
    const pLng = getCoord(formData.pickupCoords, 'lng');
    const dLat = getCoord(formData.dropoffCoords, 'lat');
    const dLng = getCoord(formData.dropoffCoords, 'lng');

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/search-cabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          distanceKm: distanceValue || 0,
          rideType: rideType,
          pickupAddress: formData.pickup,
          dropAddress: formData.dropoff,
          pickupLat: pLat,
          pickupLng: pLng,
          dropLat: dLat,
          dropLng: dLng,
          pickupPin: formData.pickupPin, // 🚀 SMART PIN
          dropoffPin: formData.dropoffPin // 🚀 SMART PIN
        })
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.options);
        if (data.options?.length > 0) {
          setActiveCategoryId(data.options[0].carCategoryId);
        }
      } else {
        throw new Error(data.message || "Search API failed");
      }
    } catch (error) {
      console.error("Error searching cabs:", error);
      setIsSearching(false);
      setShowCategoriesModal(false);
      
      Swal.fire({
        icon: 'info',
        title: 'No Rides Available',
        text: error.message,
        confirmButtonColor: '#FFD60A',
        background: '#0a0a0a',
        color: '#fff',
        customClass: {
          popup: 'rounded-3xl border border-white/5 shadow-2xl',
          title: 'text-lg font-bold uppercase tracking-tight',
          htmlContainer: 'text-sm text-white/60'
        }
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Preview Map effect (Uber/Rapido Style Live View)
  useEffect(() => {
    if (showCategoriesModal && previewMapRef.current && window.google && formData.pickupCoords && formData.dropoffCoords) {
      const timer = setTimeout(() => {
        // Correcting center coordinates (handle both function calls and values)
        const center = {
          lat: typeof formData.pickupCoords.lat === 'function' ? formData.pickupCoords.lat() : formData.pickupCoords.lat,
          lng: typeof formData.pickupCoords.lng === 'function' ? formData.pickupCoords.lng() : formData.pickupCoords.lng
        };

        const previewMap = new window.google.maps.Map(previewMapRef.current, {
          center: center,
          zoom: window.innerWidth < 768 ? 16 : 14,
          disableDefaultUI: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#060606" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#060606" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#111" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#222" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          ]
        });

        googlePreviewMap.current = previewMap;

        // Render Directions
        const renderer = new window.google.maps.DirectionsRenderer({
          map: previewMap,
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#FFD60A', strokeWeight: 5, strokeOpacity: 0.8 }
        });

        if (directionsRendererRef.current) {
          const directions = directionsRendererRef.current.getDirections();
          if (directions) {
            renderer.setDirections(directions);

            // Manual Custom Markers for Preview
            new window.google.maps.Marker({
              position: formData.pickupCoords,
              map: previewMap,
              icon: {
                url: '/admins/user_marker-removebg-preview.png',
                scaledSize: new window.google.maps.Size(70, 70),
                anchor: new window.google.maps.Point(35, 65)
              },
              title: "Pickup",
              zIndex: 1000
            });

            new window.google.maps.Marker({
              position: formData.dropoffCoords,
              map: previewMap,
              icon: {
                url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 30)
              },
              title: "Dropoff"
            });
          }
        }

      }, 500);
      return () => clearTimeout(timer);
    } else {
      googlePreviewMap.current = null;
    }
  }, [showCategoriesModal, formData.pickupCoords, formData.dropoffCoords]);

  // LIVE DRIVER MARKERS EFFECT
  useEffect(() => {
    if (!googlePreviewMap.current || !categories || !window.google) return;

    // 1. Clear existing driver markers
    driverMarkers.current.forEach(marker => marker.setMap(null));
    driverMarkers.current = [];

    // 2. Locate current active category in our list
    const activeCat = categories.find(c => c.carCategoryId === activeCategoryId);

    if (activeCat && activeCat.nearbyDrivers) {
      const backendUrl = BASE_URL;

      activeCat.nearbyDrivers.forEach(driver => {
        const marker = new window.google.maps.Marker({
          position: { lat: driver.latitude, lng: driver.longitude },
          map: googlePreviewMap.current,
          icon: {
            url: activeCat.image
              ? `${backendUrl}/uploads/${activeCat.image}`
              : 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          },
          title: 'Nearby Driver',
          zIndex: 999
        });
        driverMarkers.current.push(marker);
      });
    }
  }, [categories, activeCategoryId, googlePreviewMap.current]);

  // Summary Map effect
  useEffect(() => {
    if (showFinalSummaryModal && summaryMapRef.current && window.google && formData.pickupCoords) {
      const timer = setTimeout(() => {
        const summaryMap = new window.google.maps.Map(summaryMapRef.current, {
          center: formData.pickupCoords,
          zoom: 16,
          disableDefaultUI: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#060606" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#060606" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#111" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#222" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          ]
        });
        new window.google.maps.Marker({
          position: formData.pickupCoords,
          map: summaryMap,
          icon: {
            url: '/admins/user_marker-removebg-preview.png',
            scaledSize: new window.google.maps.Size(80, 80),
            anchor: new window.google.maps.Point(40, 75)
          },
          title: "Pickup Point",
          zIndex: 1000
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
      pickupTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      pickupPin: formData.pickupPin, // 🚀 SMART PIN
      dropoffPin: formData.dropoffPin // 🚀 SMART PIN
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
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
          title: 'Booking Successful!',
          background: '#0a0a0a',
          color: '#fff',
          iconColor: '#FFD60A',
          width: 'auto',
          customClass: {
            popup: 'rounded-2xl border border-primary/20 shadow-2xl !p-4 !px-6 flex items-center overflow-hidden',
            icon: '!m-0 scale-90',
            title: '!m-0 !ml-3 !p-0 text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap',
            timerProgressBar: 'bg-primary h-0.5'
          }
        });
        
        setIsSearching(true);
        setTimeout(() => {
          setIsSearching(false);
          navigate(`/booking-details/${data.booking?._id || data.bookingId}`);
        }, 3000);
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

        <div className="relative z-10 w-full max-w-xl mx-auto px-1 sm:px-4 py-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] mb-4 drop-shadow-[0_0_8px_rgba(255,214,10,0.4)]"
          >
            Fast & Reliable — KwikCabs
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-4xl font-black text-white mb-4 uppercase tracking-[0.1em] drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
          >
            Where to?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 mb-10 text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] max-w-xs mx-auto leading-relaxed border-t border-white/10 pt-5"
          >
            Book a KwikCabs  ride in seconds.
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
              className="relative w-full max-w-7xl h-full md:h-[90vh] bg-[#0a0a0a] md:rounded-3xl border-0 md:border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Map Container */}
              <div className="flex-1 relative order-1 md:order-1 h-[115vh] md:h-full border-b md:border-b-0 md:border-r border-white/10">
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
              <div className="w-full md:w-[450px] flex flex-col order-2 md:order-2 bg-[#111] overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-black text-2xl uppercase tracking-wider">Select Ride</h2>
                    <button onClick={() => { setShowMapModal(false); setMap(null); }} className="hidden md:flex w-9 h-9 bg-white/5 rounded-full items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative pl-7 border-l-2 border-dashed border-white/10 ml-1.5 space-y-4">
                      <div className="relative">
                        <FaDotCircle className="absolute -left-[31px] top-1 text-primary text-[10px] bg-[#111] p-0.5" />
                        <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1.5 italic">Pickup Point</p>
                        <p className="text-white/90 text-sm font-bold truncate leading-tight">{formData.pickup}</p>
                      </div>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute -left-[31px] top-1 text-red-500 text-[10px] bg-[#111] p-0.5" />
                        <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1.5 italic">Destination</p>
                        <p className="text-white/90 text-sm font-bold truncate leading-tight">{formData.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-1 flex-col justify-center p-8 space-y-8">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20"
                    >
                      <FaTaxi size={32} className="text-primary" />
                    </motion.div>
                    <h4 className="text-white font-bold text-xl">Ready for your Ride?</h4>
                    <p className="text-white/40 text-sm leading-relaxed">Your route is calculated! Click next to choose your preferred cab category and confirm booking.</p>
                  </div>
                </div>

                <div className="p-6 bg-transparent border-t border-white/5 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCarSelect(cars[2])} // Default to Mini Cab for next step
                    className="w-full bg-primary text-black font-black py-5 rounded-2xl text-sm flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,214,10,0.2)] hover:bg-yellow-400 transition-all uppercase tracking-widest"
                  >
                    Next Step <FaArrowRight />
                  </motion.button>
                  <p className="text-primary/40 text-[10px] text-center font-bold uppercase tracking-widest">Safe & Secure Booking</p>
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
                      <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Secured by KwikCabs </span>
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
                            <label className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] ml-2">Email Address (Optional)</label>
                            <input
                              type="email"
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
                            placeholder={idx + 1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className={`w-12 h-16 text-center text-white text-2xl font-black bg-white/[0.03] border-2 rounded-xl outline-none transition-all placeholder:text-white/10 ${otpError ? 'border-red-500/50 bg-red-500/5' : digit ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,214,10,0.1)]' : 'border-white/10 focus:border-primary/50'
                              }`}
                          />
                        ))}
                      </div>

                      <div className="space-y-4">
                        {otpError && <p className="text-red-400 text-xs text-center font-bold animate-shake">Incorrect code. Please check and try again.</p>}

                        <button
                          type="submit"
                          disabled={otp.join('').length !== 6 || (isNewUserDetected && !userName)}
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
            className="fixed inset-0 z-[10001] flex items-center justify-center p-0 md:p-4"
          >
            <div className="absolute inset-0 bg-black" onClick={() => setShowFinalConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg h-full md:h-auto bg-[#0a0a0a] border-0 md:border border-white/10 rounded-none md:rounded-[2.5rem] overflow-y-auto md:overflow-hidden shadow-2xl"
            >
              {/* Header: Distance Calculated - Yellow Brand Theme */}
              <div className="bg-primary border-b border-black/5 p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                  <FaTaxi size={120} className="text-black" />
                </div>
                <p className="text-black/60 text-[10px] uppercase font-black tracking-[0.3em] mb-2 relative z-10">Distance Calculated</p>
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <h4 className="text-3xl font-black text-black uppercase tracking-wider">{distance || 'Calculating...'}</h4>
                  <p className="text-black/40 text-[10px] uppercase font-bold tracking-wider">Fastest route via highway</p>
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <div className="flex items-center gap-4 mb-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(255,214,10,0.1)]"
                  >
                    <FaTaxi size={22} />
                  </motion.div>
                  <h3 className="text-white font-black text-xl uppercase tracking-wider">Choose Ride Type</h3>
                </div>

                {/* Ride Type Selection Cards - Refined */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => setRideType('private')}
                    className={`relative p-6 rounded-[2rem] border transition-all ${rideType === 'private'
                      ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${rideType === 'private' ? 'bg-primary text-black' : 'bg-white/5 text-white/20'}`}>
                      <FaLocationArrow className="rotate-45" size={16} />
                    </div>
                    <h5 className="text-white font-black text-lg mb-1">Private Ride</h5>
                    <p className="text-white/20 text-[10px] font-medium tracking-wide">Direct & Faster</p>
                    {rideType === 'private' && (
                      <div className="absolute top-6 right-6 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <FaCheckCircle size={10} className="text-black" />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => setRideType('shared')}
                    className={`relative p-6 rounded-[2rem] border transition-all ${rideType === 'shared'
                      ? 'bg-blue-500/5 border-blue-500 shadow-xl shadow-blue-500/5'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${rideType === 'shared' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/20'}`}>
                      <FaUsers size={18} />
                    </div>
                    <h5 className="text-white font-black text-lg mb-1">Shared Ride</h5>
                    <p className="text-white/20 text-[10px] font-medium tracking-wide">Economic & Social</p>
                    {rideType === 'shared' && (
                      <div className="absolute top-6 right-6 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaCheckCircle size={10} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons - Premium & Simple */}
                <div className="space-y-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinalBooking}
                    className="w-full bg-primary text-black font-bold py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-yellow-400 transition-all flex items-center justify-center gap-3"
                  >
                    Confirm {rideType} booking <FaArrowRight size={10} />
                  </motion.button>
                  <button
                    onClick={() => setShowFinalConfirm(false)}
                    className="w-full text-white hover:text-primary text-[10px] uppercase font-black tracking-widest py-2 transition-all"
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
            className="fixed inset-0 z-[10005] flex items-center justify-center p-0 md:p-4"
          >
            <div className="absolute inset-0 bg-black/95" onClick={() => setShowCategoriesModal(false)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-7xl h-full md:h-[90vh] bg-[#0a0a0a] border-0 md:border border-white/10 rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Map Section (2/3 Width) */}
              <div className="w-full md:w-[66%] h-[115vh] md:h-full relative border-r border-white/5 bg-gray-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                  <div ref={previewMapRef} className="w-full h-full" />
                </div>
                <div className="hidden md:flex absolute top-6 left-6 z-10">
                  <div className="bg-black/80 backdrop-blur-md shadow-xl px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10">
                    <FaLocationArrow className="text-primary text-xs" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Route Overview</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Car List Section (1/3 Width - BLACK & YELLOW THEME) */}
              <div className="w-full md:w-[34%] flex flex-col bg-[#0a0a0a] h-full overflow-hidden relative">
                <div className="hidden md:flex p-6 sm:p-8 border-b border-white/5 justify-between items-center bg-[#0a0a0a] z-10">
                  <div>
                    <h3 className="text-white font-bold text-xl tracking-tight mb-1">Select a Cab</h3>
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">{categories.length} Options Near You</p>
                  </div>
                  <button onClick={() => setShowCategoriesModal(false)} className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10">
                    <FaTimes size={12} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                  {/* Visual Handle for Mobile Sheet look */}
                  <div className="md:hidden w-12 h-1 bg-white/10 rounded-full mx-auto mb-4" />
                  <AnimatePresence mode="wait">
                    {isCategoriesLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <FaSpinner className="text-primary animate-spin text-3xl" />
                        <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest animate-pulse">Syncing fleet...</p>
                      </div>
                    ) : (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {categories.map((car) => {
                          const isSelected = activeCategoryId === car.carCategoryId;
                          return (
                            <motion.div
                              key={car.carCategoryId}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveCategoryId(car.carCategoryId)}
                              onDoubleClick={() => handleCarTypeSelect(car)}
                              className={`relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 border-2 transition-all rounded-2xl sm:rounded-3xl cursor-pointer ${isSelected
                                ? 'bg-primary border-primary text-black shadow-lg shadow-primary/10'
                                : 'bg-white/5 border-white/5 hover:border-primary/30 text-white shadow-sm'
                                }`}
                            >
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center p-2 ${isSelected ? 'bg-black/10' : 'bg-white/5'}`}>
                                <img
                                  src={car.image ? `${BASE_URL}/uploads/${car.image}` : `https://cdn-icons-png.flaticon.com/512/3202/3202926.png`}
                                  alt={car.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-black text-base sm:text-lg mb-0.5 sm:mb-1 leading-none uppercase tracking-tight ${isSelected ? 'text-black' : 'text-white'}`}>{car.name}</h4>
                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'bg-black/10 text-black/60' : 'bg-white/5 text-primary/80'}`}>
                                  <FaClock size={8} /> {car.arrivalMins}
                                </div>
                              </div>
                              <div className="text-right">
                                <h2 className={`text-lg sm:text-2xl font-black tracking-tighter ${isSelected ? 'text-black' : 'text-primary'}`}>₹{car.fare}</h2>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Action Bar - Optimized YELLOW */}
                <div className="p-6 bg-[#0a0a0a] border-t border-white/5 flex flex-col gap-2">
                  <button
                    disabled={!activeCategoryId || isCategoriesLoading}
                    onClick={() => {
                      const selected = categories.find(c => c.carCategoryId === activeCategoryId);
                      if (selected) handleCarTypeSelect(selected);
                    }}
                    className="w-full bg-primary text-black font-black py-4 rounded-2xl text-[10px] tracking-[0.2em] hover:bg-yellow-400 transition-all uppercase flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-primary/10"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => { setShowCategoriesModal(false); setShowFinalConfirm(true); }}
                    className="w-full text-white/20 hover:text-white text-[9px] uppercase font-bold tracking-widest py-1"
                  >
                    Back to options
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
            className="fixed inset-0 z-[10010] flex items-center justify-center p-0 md:p-8"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowFinalSummaryModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl h-full md:h-[80vh] bg-[#0a0a0a] border-0 md:border border-white/10 rounded-none md:rounded-[4rem] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              {/* Left Side: Map Preview (1/2 or 3/5 Width) */}
              <div className="w-full md:w-[60%] h-[115vh] md:h-full relative border-r border-white/5 bg-gray-900 overflow-hidden">
                <div ref={summaryMapRef} className="w-full h-full" />
                <div className="hidden md:flex absolute top-6 left-6 z-10">
                  <div className="bg-black/80 backdrop-blur-md px-4 py-2 mt-2 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Route Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Details Section (BLACK & YELLOW THEME) */}
              <div className="w-full md:w-[40%] flex flex-col bg-[#0a0a0a] h-full overflow-y-auto p-4 sm:p-10 custom-scrollbar">
                <div className="hidden md:block mb-8">
                  <h3 className="text-white font-black text-3xl mb-1 tracking-tighter">Final Step</h3>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">Review your ride details</p>
                </div>
                
                {/* Mobile-only Header - Simple and Straight Style */}
                <div className="md:hidden mb-8 text-center pt-2">
                  <h3 className="text-white font-black text-2xl mb-1 tracking-tight uppercase">Confirm Pickup</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] italic">Your Location is Verified</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  {/* Location Details - Hidden on mobile to save space */}
                  <div className="hidden md:block space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                        <FaDotCircle className="text-primary text-xs" />
                      </div>
                      <div>
                        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Pickup</p>
                        <p className="text-white text-sm font-bold leading-tight">{formData.pickup}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                        <FaMapMarkerAlt className="text-red-500 text-xs" />
                      </div>
                      <div>
                        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Destination</p>
                        <p className="text-white text-sm font-bold leading-tight">{formData.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Car Card - COMPACT - Hidden on mobile */}
                  <div className="hidden md:flex bg-white/5 p-4 rounded-[2rem] border border-white/5 items-center gap-4 relative overflow-hidden mt-4 md:mt-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black/40 rounded-xl p-2 z-10 flex items-center justify-center">
                      <img
                        src={confirmedCar.image ? `${BASE_URL}/uploads/${confirmedCar.image}` : `https://cdn-icons-png.flaticon.com/512/3202/3202926.png`}
                        alt={confirmedCar.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="hidden md:block flex-1 z-10">
                      <h4 className="text-white font-black text-lg mb-0.5">{confirmedCar.name}</h4>
                      <p className="text-primary text-[8px] font-black uppercase tracking-[0.2em] opacity-80">{rideType} Ride</p>
                      <div className="flex items-center gap-2 mt-2 text-white/40 text-[8px] font-bold">
                        <span className="flex items-center gap-1"><FaUsers size={9} /> {rideType === 'shared' ? selectedSeatNames.length : confirmedCar.seatCapacity} Seats</span>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                        <span className="italic">{distance} distance</span>
                      </div>
                    </div>
                  </div>

                  {/* Fare Summary - MORE COMPACT - Hidden on mobile */}
                  <div className="hidden md:flex p-5 bg-primary rounded-[2rem] shadow-2xl shadow-primary/20 justify-between items-center mt-4">
                    <div>
                      <p className="text-black/60 text-[9px] font-black uppercase tracking-widest mb-0.5">Total Payable</p>
                      <h2 className="text-3xl font-black text-black tracking-tighter italic">
                        ₹{Math.round((confirmedCar.fare || 0) * (rideType === 'shared' ? (selectedSeatNames.length || 1) : 1))}
                      </h2>
                    </div>
                    <FaCheckCircle className="text-black/20 text-4xl" />
                  </div>
                </div>

                {/* Footer Buttons - CLEAN & PROFESSIONAL (Static instead of Sticky) */}
                <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-4 bg-[#0a0a0a] pt-8 border-t border-white/5 pb-2">
                  <button
                    onClick={() => setShowFinalSummaryModal(false)}
                    className="order-2 sm:order-1 px-8 py-3.5 border-2 border-white/10 rounded-2xl text-white/70 font-black text-[10px] uppercase tracking-wide hover:text-white hover:border-white/20 transition-all text-center flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="order-1 sm:order-2 flex-[2.5] bg-primary text-black font-black py-4 rounded-2xl text-[11px] sm:text-xs tracking-wide hover:bg-yellow-400 shadow-2xl shadow-primary/30 transition-all uppercase flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    Confirm Booking <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
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
            className="fixed inset-0 z-[10007] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-[95%] md:w-full md:max-w-xl bg-[#0a0a0a] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl px-6 sm:px-10 border border-white/10 overflow-y-auto relative"
              style={{ maxHeight: '90vh' }}
            >
              <div className="flex items-center gap-6 mb-10 sticky top-0 bg-[#0a0a0a] z-40 pb-6 pt-6 sm:pt-10 border-b border-white/5 -mx-6 sm:-mx-10 px-6 sm:px-10">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl relative overflow-hidden flex-shrink-0"
                >
                  <img
                    src={confirmedCar.image ? `${BASE_URL}/uploads/${confirmedCar.image}` : `https://cdn-icons-png.flaticon.com/512/3202/3202926.png`}
                    alt={confirmedCar.name}
                    className="w-full h-full object-contain z-10"
                  />
                </motion.div>
                <div className="text-left">
                  <h3 className="text-white font-black text-xl sm:text-2xl mb-0.5 tracking-tighter">Pick Your Seats</h3>
                  <p className="text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Ready for {confirmedCar.name}</p>
                </div>
              </div>

              {/* SEAT LAYOUT DISPLAY - COMPACT GRID */}
              <div className="grid grid-cols-2 gap-3 mb-8 sm:mb-10 overflow-hidden scrollbar-none">
                {confirmedCar.seatLayout && confirmedCar.seatLayout.length > 0 ? (
                  confirmedCar.seatLayout.map((seatName, idx) => {
                    const isSelected = selectedSeatNames.includes(seatName);
                    return (
                      <motion.div
                        key={`${seatName}-${idx}`}
                        whileTap={{ scale: 0.96 }}
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
                                text: `Limit is ${confirmedCar.seatCapacity} seats.`,
                                background: '#111',
                                color: '#fff',
                                confirmButtonColor: '#FACD16',
                                customClass: { popup: 'rounded-3xl border border-white/10' }
                              });
                            }
                          }
                        }}
                        className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer ${isSelected
                          ? 'bg-primary border-primary text-black shadow-lg shadow-primary/10'
                          : 'bg-white/5 border-white/5 hover:border-primary/20 text-white'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-black/10' : 'bg-white/5 text-primary'}`}>
                          <FaUser size={12} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest truncate block ${isSelected ? 'text-black' : 'text-white'}`}>{seatName}</span>
                        </div>
                        {isSelected && <FaCheckCircle size={10} className="text-black ml-auto" />}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-10 text-center text-white/10 text-[9px] uppercase font-black tracking-widest italic border border-dashed border-white/5 rounded-3xl">
                    Standard Layout
                  </div>
                )}
              </div>

              {/* FARE BOX - RESPONSIVE */}
              <div className="bg-white/5 border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-8 sm:mb-10 flex flex-col items-center sm:flex-row justify-between gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-1">Estimated Fare</p>
                  <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tighter italic">
                    ₹{Math.round((confirmedCar.fare || 0) * (selectedSeatNames.length || 1))}
                  </h4>
                  <p className="text-white/20 text-[8px] font-bold mt-1 uppercase tracking-widest">
                    {selectedSeatNames.length || 0} Seat(s) selected
                  </p>
                </div>
                <div className="w-full sm:w-auto px-5 py-3 bg-primary/10 rounded-xl sm:rounded-2xl border border-primary/20 text-center">
                  <p className="text-white/20 text-[7px] font-black uppercase tracking-widest mb-1">Ride Tier</p>
                  <p className="text-primary font-black text-[9px] tracking-widest uppercase italic">Economy Share</p>
                </div>
              </div>

              {/* ACTIONS - FIXED FOOTER (Restored Sticky & Gap Fixed) */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-0 bg-[#0a0a0a] z-30 pt-4 pb-8 sm:pb-10 -mx-6 sm:-mx-10 px-6 sm:px-10 border-t border-white/5">
                <button
                  onClick={() => { setShowSeatSelectionModal(false); setShowCategoriesModal(true); }}
                  className="order-2 sm:order-1 px-8 py-4 sm:py-5 rounded-2xl border border-white/10 text-white/40 font-black text-[9px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all text-center flex-1 sm:flex-none"
                >
                  Back to cabs
                </button>
                <button
                  disabled={selectedSeatNames.length === 0}
                  onClick={handleSeatConfirm}
                  className="order-1 sm:order-2 flex-1 bg-primary text-black font-black py-4 sm:py-5 rounded-2xl text-[10px] sm:text-xs shadow-2xl shadow-primary/20 hover:bg-yellow-400 transition-all disabled:opacity-20 uppercase tracking-[0.2em] active:scale-[0.98]"
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
