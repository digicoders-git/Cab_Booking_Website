import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaTaxi, FaMapMarkerAlt, FaUser, FaPhoneAlt,
    FaCreditCard, FaChevronLeft, FaSpinner,
    FaStar, FaCar, FaDotCircle, FaShieldAlt,
    FaRoad, FaClock, FaHistory, FaCheckCircle, FaTimesCircle, FaTimes,
    FaCommentDots, FaFingerprint, FaRoute
} from 'react-icons/fa';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [locationUpdateCount, setLocationUpdateCount] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(240); // 4 minutes timer
    const [isDriverArrived, setIsDriverArrived] = useState(false);
    const [waitingTime, setWaitingTime] = useState(0);

    // Map Refs
    const mapRef = useRef(null);
    const googleMap = useRef(null);
    const driverMarker = useRef(null);
    const originMarker = useRef(null);
    const destinationMarker = useRef(null);
    const directionsRenderer = useRef(null);
    const directionsService = useRef(null);

    const backendServer = API_BASE_URL.replace(/\/api$/, '');

    // 1. Initial Fetch
    const fetchBooking = async () => {
        if (!bookingId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setBooking(data.booking);
                if (data.booking.driverLocation?.latitude) {
                    setDriverLocation(data.booking.driverLocation);
                }
            } else {
                setError(data.message || "Ride not found");
            }
        } catch (err) {
            setError("Connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    // Timer Sync Logic
    useEffect(() => {
        if (!booking || (booking.bookingStatus !== 'Pending' && booking.status !== 'pending')) return;

        const updateTimer = () => {
            const createdAt = new Date(booking.createdAt).getTime();
            const now = Date.now();
            const elapsed = Math.floor((now - createdAt) / 1000);
            const remaining = Math.max(0, 240 - elapsed);
            setSecondsRemaining(remaining);

            // If expired, refresh to show expired state and STOP the timer
            if (remaining === 0) {
                fetchBooking();
                if (window.timerInterval) clearInterval(window.timerInterval);
            }
        };

        updateTimer();
        window.timerInterval = setInterval(updateTimer, 1000);
        return () => {
            if (window.timerInterval) clearInterval(window.timerInterval);
        };
    }, [booking]);

    // Waiting Timer Sync (User Side)
    useEffect(() => {
        let interval;
        const arrivedAt = booking?.tripData?.arrivedAt || (isDriverArrived ? new Date() : null);

        if (arrivedAt && booking?.bookingStatus === 'Accepted') {
            setIsDriverArrived(true);
            const start = new Date(arrivedAt).getTime();
            interval = setInterval(() => {
                const now = Date.now();
                setWaitingTime(Math.floor((now - start) / 1000));
            }, 1000);
        } else {
            setWaitingTime(0);
        }
        return () => clearInterval(interval);
    }, [booking?.tripData?.arrivedAt, booking?.bookingStatus, isDriverArrived]);

    const formatWaitingTimer = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };


    // 2. Map Initialization
    useEffect(() => {
        if (loading || !booking || !window.google || googleMap.current) return;

        const pickupCoords = {
            lat: booking.pickup.latitude,
            lng: booking.pickup.longitude
        };

        // Initialize Map with Premium Night Theme
        googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: pickupCoords,
            zoom: 15,
            disableDefaultUI: true,
            gestureHandling: "greedy",
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

        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
            map: googleMap.current,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#FACD16',
                strokeWeight: 6,
                strokeOpacity: 0.9
            }
        });

        // Add Origin Marker (Pickup) - Improved Figurine Style
        originMarker.current = new window.google.maps.Marker({
            position: pickupCoords,
            map: googleMap.current,
            icon: {
                url: '/admins/user_marker-removebg-preview.png', // New 3D Figurines with base
                scaledSize: new window.google.maps.Size(100, 100),
                anchor: new window.google.maps.Point(50, 100) // Anchor at the very bottom-center
            },
            title: 'I am waiting here',
            animation: window.google.maps.Animation.BOUNCE // A slight bounce to grab attention
        });

        // Destination Marker (Drop)
        destinationMarker.current = new window.google.maps.Marker({
            position: { lat: booking.drop.latitude, lng: booking.drop.longitude },
            map: googleMap.current,
            label: { text: 'B', color: 'white', fontWeight: 'bold' },
            icon: {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                fillColor: '#FF3B30',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 1.8,
                anchor: new window.google.maps.Point(12, 22),
                labelOrigin: new window.google.maps.Point(12, 9)
            },
            title: 'Your Destination'
        });

        updateMapRoute();
    }, [loading, booking]);

    // 3. Update Route & Driver Marker (Logic for real-time movement)
    const updateMapRoute = () => {
        if (!googleMap.current || !booking || !window.google) return;

        const pickup = { lat: booking.pickup.latitude, lng: booking.pickup.longitude };
        const drop = { lat: booking.drop.latitude, lng: booking.drop.longitude };

        let start = pickup;
        let end = drop;

        const status = booking.bookingStatus;
        const dLoc = driverLocation;

        // --- Marker Visibility Logic (Hide Human when Trip is Live/End) ---
        if (originMarker.current) {
            if (status === 'Ongoing' || status === 'Completed' || status === 'completed') {
                originMarker.current.setMap(null);
            } else {
                originMarker.current.setMap(googleMap.current);
            }
        }

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(drop);

        // --- Driver Marker Logic ---
        if (dLoc?.latitude && (status === 'Accepted' || status === 'Ongoing')) {
            const driverCoords = { lat: dLoc.latitude, lng: dLoc.longitude };
            bounds.extend(driverCoords);

            if (!driverMarker.current) {
                // Determine Icon URL: Use carCategory image or fallback
                let iconUrl = 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png'; // Default

                if (booking.carCategory?.image) {
                    iconUrl = `${backendServer}/uploads/${booking.carCategory.image}`;
                }

                driverMarker.current = new window.google.maps.Marker({
                    position: driverCoords,
                    map: googleMap.current,
                    icon: {
                        url: iconUrl,
                        scaledSize: new window.google.maps.Size(50, 50),
                        anchor: new window.google.maps.Point(25, 25)
                    },
                    title: 'Your Driver',
                    zIndex: 1000
                });
            } else {
                driverMarker.current.setPosition(driverCoords);
            }

            // --- Route Line Logic ---
            if (status === 'Accepted') {
                // Driver -> Pickup
                start = driverCoords;
                end = pickup;
                bounds.extend(pickup);
            } else if (status === 'Ongoing') {
                // Driver -> Drop
                start = driverCoords;
                end = drop;
                // Destination is already extended
            }
        } else {
            bounds.extend(pickup);
        }

        // Auto-Adjust Viewport (Throttled: map zoom ko bar-bar change mat karo)
        const currentZoom = googleMap.current.getZoom();
        if (currentZoom < 10) {
            googleMap.current.fitBounds(bounds, { top: 70, bottom: 70, left: 70, right: 70 });
        }

        // --- Render Directions ---
        directionsService.current.route({
            origin: start,
            destination: end,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.current.setDirections(result);
            }
        });
    };

    // Re-calculate route when status or coordinates change
    useEffect(() => {
        updateMapRoute();
    }, [driverLocation, booking?.bookingStatus]);

    // 4. Real-time WebSocket Logic
    useEffect(() => {
        if (!bookingId) return;
        const socket = io(backendServer, {
            transports: ['polling', 'websocket'],
            secure: backendServer.startsWith('https'),
            reconnectionAttempts: 5,
            reconnectionDelay: 2000
        });

        // Track Connection Status
        socket.on('connect', () => {
            setIsConnected(true);
            console.log("Socket Connected ✅");

            // Join Room - Only after connection
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = localStorage.getItem('userId') || storedUser?._id;
            const userRole = localStorage.getItem('role') || (storedUser?._id ? 'user' : (storedUser?.role || 'user'));

            if (userId) {
                const room = userRole === 'agent' ? `agent_${userId}` : userId;
                console.log(`Socket joining room: ${room} (Role: ${userRole})`);
                socket.emit('join_room', { userId: userId, role: userRole });
            }
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log("Socket Disconnected ❌");
        });

        socket.on('booking_update', (data) => {
            if (data.bookingId === bookingId) {
                console.log("Booking Status Updated 🔔", data.status);
                fetchBooking();
            }
        });

        // DRIVER ARRIVAL LISTENER
        socket.on('driver_arrived', (data) => {
            if (data.bookingId === bookingId) {
                console.log("🚕 Driver Arrived Socket Event!");
                setIsDriverArrived(true);
                // If backend sent the arrivedAt time, we can sync the timer
                if (data.arrivedAt) {
                    const start = new Date(data.arrivedAt).getTime();
                    const now = Date.now();
                    setWaitingTime(Math.floor((now - start) / 1000));
                }
            }
        });

        // LIVE DRIVER MOVEMENT LISTENER
        socket.on('driver_location_update', (data) => {
            // Logic moved to a ref-based or memoized handler to avoid dependency on booking state
            handleLocationUpdate(data);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('booking_update');
            socket.off('driver_location_update');
            socket.disconnect();
        };
    }, [bookingId]);

    // Robust location update handler
    const handleLocationUpdate = (data) => {
        if (!data.driverId || !booking) return;

        const currentDriverId = (booking?.assignedDriver?._id || booking?.assignedDriver || '').toString().toLowerCase().trim();
        const incomingId = (data.driverId?._id || data.driverId || '').toString().toLowerCase().trim();

        if (currentDriverId && incomingId && currentDriverId === incomingId) {
            setLocationUpdateCount(prev => prev + 1);
            const newCoords = { lat: data.latitude, lng: data.longitude };

            if (driverMarker.current) {
                const startPos = driverMarker.current.getPosition();
                const endPos = new window.google.maps.LatLng(newCoords.lat, newCoords.lng);
                let frames = 30;
                let count = 0;

                const animate = () => {
                    count++;
                    const lat = startPos.lat() + (endPos.lat() - startPos.lat()) * (count / frames);
                    const lng = startPos.lng() + (endPos.lng() - startPos.lng()) * (count / frames);
                    driverMarker.current.setPosition(new window.google.maps.LatLng(lat, lng));
                    if (count < frames) {
                        requestAnimationFrame(animate);
                    } else {
                        setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
                    }
                };
                requestAnimationFrame(animate);
            } else {
                setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
            }
        }
    };

    const handleCancel = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: "User cancelled from App" })
            });
            const data = await response.json();
            if (data.success) {
                // Redirecting to home page after cancellation using React Router
                navigate('/');
            }
        } catch (error) {
            console.error("Cancel Error:", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <FaTaxi className="text-[#FACD16] text-5xl drop-shadow-[0_0_15px_rgba(250,205,22,0.3)]" />
            </motion.div>
        </div>
    );

    if (error || !booking) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <FaTimesCircle size={32} />
            </div>
            <h2 className="text-white text-3xl font-black italic tracking-tighter mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Oops! Ride Lost</h2>
            <Link to="/my-booking" className="px-6 py-3 bg-[#FACD16] text-black font-bold rounded-full text-sm tracking-wide hover:bg-[#e5b800] transition-colors">Back to History</Link>
        </div>
    );

    const isPending = booking.bookingStatus === 'Pending' || booking.status === 'pending';
    const canCancel = ['Pending', 'Accepted', 'Ongoing', 'pending', 'accepted', 'ongoing'].includes(booking.bookingStatus || booking.status);

    return (
        <div className="bg-black min-h-screen pt-[85px] md:pt-[130px] pb-0 md:pb-10">
            <div className="container mx-auto px-0 md:px-4 max-w-7xl h-full md:h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 h-full">

                    {/* LEFT SIDE: THE LIVE MAP */}
                    <div className="lg:col-span-7 h-[50vh] md:h-full sticky md:relative top-0 md:top-auto z-[60] md:z-auto w-full mt-0 mx-0 rounded-none md:rounded-[2rem] overflow-hidden border-b md:border border-white/10 shadow-2xl">
                        <div ref={mapRef} className="w-full h-full" />

                        {/* Floating Navigation Controls */}
                        <div className="absolute top-6 left-6 z-10 hidden md:flex flex-col gap-3">
                            <button onClick={() => window.history.back()} className="w-12 h-12 bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-white border border-white/10 hover:bg-black transition-all">
                                <FaChevronLeft size={16} />
                            </button>
                        </div>

                        <div className="absolute top-6 right-6 z-10 hidden md:flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-full backdrop-blur-md border ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-2 shadow-2xl`}>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{isConnected ? 'Live' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: CONTENT DASHBOARD */}
                    <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto no-scrollbar scroll-smooth p-5 md:p-0 h-full md:pb-1">

                        {/* 1. MAIN SUMMARY CARD */}
                        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div>
                                    <h2 className="text-white font-black text-xl uppercase tracking-wider">Ride Summary</h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="bg-[#FACD16]/10 border border-[#FACD16]/20 px-3 py-1 rounded-lg text-[#FACD16] font-black text-[10px] uppercase tracking-widest">{booking.rideType || "Private"} Ride</span>
                                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">ID: #{booking._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className={`shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isPending ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                    (booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                        (booking.bookingStatus === 'Expired' || booking.status === 'expired' ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
                                            'bg-green-500/10 border-green-500/20 text-green-500'))}`}>
                                    {booking.bookingStatus || booking.status}
                                </div>
                            </div>

                            {/* OTP Row */}
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <FaFingerprint className="text-cyan-400 text-sm" />
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">OTP Secure Pin</span>
                                </div>
                                <span className="text-cyan-400 font-black text-xl tracking-[0.2em]">
                                    {booking.tripData?.startOtp || booking.otp || (isPending ? '----' : '----')}
                                </span>
                            </div>

                            {/* DRIVER WAITING ALERT */}
                            {isDriverArrived && booking.bookingStatus === 'Accepted' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-5 bg-[#FACD16] rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                            <FaClock className="text-[#FACD16] animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-black font-black text-[10px] uppercase tracking-widest">Driver arrived</p>
                                            <p className="text-black/50 text-[8px] font-bold uppercase">Free waiting time applies</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-black font-black text-xl tabular-nums">{formatWaitingTimer(waitingTime)}</p>
                                        <p className="text-black/40 text-[8px] font-bold uppercase tracking-widest">Timer</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* FARE CARD */}
                            <div className="rounded-xl overflow-hidden border border-white/10">
                                <div className="bg-[#111] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#FACD16]/10 rounded-lg flex items-center justify-center">
                                            <FaCreditCard className="text-[#FACD16] text-xs" />
                                        </div>
                                        <span className="text-white font-black text-sm uppercase tracking-wider">Fare Details</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#FACD16]/10 border border-[#FACD16]/20 px-3 py-1.5 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FACD16] animate-pulse" />
                                        <span className="text-[#FACD16] font-black text-[9px] uppercase tracking-widest">{booking.paymentMethod || 'Cash'}</span>
                                    </div>
                                </div>
                                <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <span className="text-white/50 font-bold text-sm">Base Fare</span>
                                    <span className="text-white font-black text-xl">₹{(booking.fareEstimate || 0) - (booking.tripData?.waitingCharges || 0)}</span>
                                </div>
                                {booking.tripData?.waitingCharges > 0 && (
                                    <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                        <span className="text-[#FACD16]/80 font-bold text-sm flex items-center gap-2">
                                            <FaClock size={10} /> Waiting Fee ({booking.tripData.waitingTimeMin}m)
                                        </span>
                                        <span className="text-[#FACD16] font-black text-lg">+ ₹{booking.tripData.waitingCharges}</span>
                                    </div>
                                )}
                                <div className="bg-gradient-to-r from-[#FACD16]/10 to-transparent px-4 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-black text-sm uppercase tracking-wider">To Be Paid</p>
                                        <p className="text-white/25 text-[8px] font-bold uppercase tracking-widest">Excluding tolls/parking</p>
                                    </div>
                                    <span className="text-[#FACD16] font-black text-3xl">₹{booking.fareEstimate || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. ROUTE CARD */}
                        <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10 shadow-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <FaRoute className="text-[#FACD16] text-sm" />
                                <h3 className="text-white font-black text-sm uppercase tracking-wider">Your Route</h3>
                            </div>
                            <div className="space-y-5 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-[#FACD16] rounded-full border-2 border-black" />
                                    <p className="text-white/40 text-[8px] font-black uppercase tracking-wider mb-1">PICKUP</p>
                                    <p className="text-white/80 text-sm font-medium leading-tight">{booking.pickup?.address || booking.pickupAddress}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-white/20 rounded-full border border-white/30" />
                                    <p className="text-white/40 text-[8px] font-black uppercase tracking-wider mb-1">DROPOFF</p>
                                    <p className="text-white/80 text-sm font-medium leading-tight">{booking.drop?.address || booking.dropAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. DRIVER CARD */}
                        <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10 shadow-xl">
                            {booking.assignedDriver ? (
                                <div>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                            {booking.assignedDriver.image ? (
                                                <img src={`${backendServer}/uploads/${booking.assignedDriver.image}`} alt={booking.assignedDriver.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUser className="text-white/20 text-2xl" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-lg uppercase tracking-tight">{booking.assignedDriver.name}</h4>
                                            <p className="text-[#FACD16] text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mt-1">
                                                <FaStar size={8} /> 5.0 Driver Rating
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <FaCar className="text-white/30 text-sm" />
                                            <span className="text-white font-bold text-xs uppercase tracking-tight">{booking.assignedDriver.carDetails.carModel}</span>
                                        </div>
                                        <span className="bg-[#FACD16]/10 px-2 py-1 text-[#FACD16] font-black text-[9px] rounded-lg tracking-wider">
                                            {booking.assignedDriver.carDetails.carNumber}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <a href={`tel:${booking.assignedDriver.phone}`} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-[#FACD16] transition-colors">
                                            <FaPhoneAlt size={12} />
                                        </a>
                                        <a href={`sms:${booking.assignedDriver.phone}`} className="flex-1 h-10 bg-[#FACD16] text-black rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider hover:bg-[#e5b800] transition-colors">
                                            <FaCommentDots size={12} />
                                            <span>Message</span>
                                        </a>
                                        {canCancel && (
                                            <button onClick={handleCancel} className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                <FaTimes size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    {booking.bookingStatus === 'Expired' || booking.status === 'expired' ? (
                                        <>
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <FaTimesCircle className="text-red-500 text-xl" />
                                            </div>
                                            <p className="text-red-500 font-black text-sm uppercase tracking-tight">Ride Expired</p>
                                            <p className="text-white/30 text-[8px] font-bold uppercase tracking-wider mt-1">No driver found in time</p>
                                        </>
                                    ) : booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled' ? (
                                        <>
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <FaTimesCircle className="text-red-500 text-xl" />
                                            </div>
                                            <p className="text-red-500 font-black text-sm uppercase tracking-tight">Ride Cancelled</p>
                                            <p className="text-white/30 text-[8px] font-bold uppercase tracking-wider mt-1">Request was cancelled</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative w-16 h-16 mx-auto mb-4">
                                                <div className="absolute inset-0 rounded-full border-t-2 border-[#FACD16] animate-spin" />
                                                <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center">
                                                    <FaCar className="text-white/60 text-2xl" />
                                                </div>
                                            </div>
                                            <h3 className="text-white font-bold text-base uppercase tracking-wider mb-2">Searching Driver</h3>
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FACD16] animate-pulse" />
                                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                                                    Est. Time: <span className="text-[#FACD16]">{Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}</span>
                                                </p>
                                            </div>
                                            {canCancel && (
                                                <button onClick={handleCancel} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold text-[9px] uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                                    Cancel Request
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;