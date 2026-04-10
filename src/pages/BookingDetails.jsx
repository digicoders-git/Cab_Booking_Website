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

    // Map Refs
    const mapRef = useRef(null);
    const googleMap = useRef(null);
    const driverMarker = useRef(null);
    const originMarker = useRef(null);
    const destinationMarker = useRef(null);
    const directionsRenderer = useRef(null);
    const directionsService = useRef(null);

    const backendServer = API_BASE_URL.replace('/api', '');

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
        const socket = io(backendServer);

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
        <div className="min-h-screen bg-[#060606] flex items-center justify-center">
            <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <FaTaxi className="text-primary text-5xl drop-shadow-[0_0_15px_rgba(255,214,10,0.3)]" />
            </motion.div>
        </div>
    );

    if (error || !booking) return (
        <div className="min-h-screen bg-[#060606] flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <FaTimesCircle size={32} />
            </div>
            <h2 className="text-white text-3xl font-black italic tracking-tighter mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Oops! Ride Lost</h2>
            <Link to="/my-booking" className="btn-primary">Back to History</Link>
        </div>
    );

    const isPending = booking.bookingStatus === 'Pending' || booking.status === 'pending';
    const canCancel = ['Pending', 'Accepted', 'Ongoing', 'pending', 'accepted', 'ongoing'].includes(booking.bookingStatus || booking.status);

    return (
        <div className="bg-[#060606] min-h-screen pt-[130px] pb-10">
            <div className="container mx-auto px-4 max-w-7xl h-auto md:h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* LEFT SIDE: THE LIVE MAP (DYNAMIC & INTERACTIVE) */}
                    <div className="lg:col-span-7 h-[50vh] md:h-full relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <div ref={mapRef} className="w-full h-full" />

                        {/* Floating Navigation Controls */}
                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                            <button onClick={() => window.history.back()} className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all">
                                <FaChevronLeft size={16} />
                            </button>


                        </div>

                        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
                            <div className={`px-4 py-2.5 rounded-full backdrop-blur-md border ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-2 shadow-2xl`}>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{isConnected ? 'Live' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: THE CONTENT DASHBOARD (BLACK & YELLOW) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth pr-1 h-full">

                        {/* 1. MAIN SUMMARY HEADER - COMPACT & SIMPLE */}
                        <div className="bg-[#111] p-15 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
                            <div>
                                <h2 className="text-white font-black text-xl mb-1 uppercase tracking-wider">Ride Summary</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-primary font-black text-[9px] uppercase tracking-widest leading-none">{booking.rideType || "Private"} Ride</span>
                                    <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest">ID: #{booking._id?.slice(-8).toUpperCase()}</span>
                                    <span className="bg-cyan-500/15 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 flex items-center gap-2 shadow-lg shadow-cyan-500/5">
                                        <FaFingerprint className="text-cyan-500 text-[12px]" />
                                        OTP: {booking.tripData?.startOtp || booking.otp || (isPending ? "SEARCHING..." : "---")}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${isPending ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 animate-pulse' :
                                (booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                    (booking.bookingStatus === 'Expired' || booking.status === 'expired' ? 'bg-gray-500/10 border-gray-500/20 text-gray-500' :
                                        'bg-green-500/10 border-green-500/20 text-green-500'))}`}>
                                {booking.bookingStatus || booking.status}
                            </div>
                        </div>

                        {/* 2. ROUTE TRACKER DETAILS */}
                        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                            <div className="space-y-10 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                                {/* Pickup */}
                                <div className="relative">
                                    <div className="absolute -left-[28px] top-1.5 w-6 h-6 bg-black border-2 border-white rounded-full z-10 flex items-center justify-center shadow-lg">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                    <p className="text-white text-[9px] font-black uppercase tracking-[0.25em] mb-2 italic">Pickup Point</p>
                                    <h4 className="text-white font-bold text-sm leading-snug">{booking.pickup?.address || booking.pickupAddress}</h4>
                                </div>
                                {/* Dropoff */}
                                <div className="relative">
                                    <div className="absolute -left-[28px] top-1.5 w-6 h-6 bg-black border-2 border-primary rounded-lg z-10 flex items-center justify-center shadow-lg shadow-primary/10">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
                                    </div>
                                    <p className="text-white text-[9px] font-black uppercase tracking-[0.25em] mb-2 italic">Destination</p>
                                    <h4 className="text-white font-bold text-sm leading-snug">{booking.drop?.address || booking.dropAddress}</h4>
                                </div>
                            </div>
                        </div>

                        {/* 3. DRIVER INFORMATION - DYNAMIC & HIGH FIDELITY */}
                        <div className="bg-[#111] p-6 sm:p-8 pb-8 sm:pb-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-xl min-h-fit">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                            {booking.assignedDriver ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1 relative overflow-hidden">
                                            {booking.assignedDriver.image ? (
                                                <img
                                                    src={`${backendServer}/uploads/${booking.assignedDriver.image}`}
                                                    alt={booking.assignedDriver.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                                                />
                                            ) : (
                                                <FaUser className="text-white/10 text-3xl" />
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-[#111] text-[8px] font-bold">
                                                <FaStar />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-xl tracking-tighter uppercase italic">{booking.assignedDriver.name}</h4>
                                            <p className="text-primary text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                                <FaStar size={8} /> 5.0 Driver Rating
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/30 border border-white/5">
                                                <FaCar size={16} />
                                            </div>
                                            <div>
                                                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest block mb-0.5">Vehicle</span>
                                                <span className="text-white font-bold text-[10px] uppercase tracking-tighter leading-none">{booking.assignedDriver.carDetails.carModel}</span>
                                            </div>
                                        </div>
                                        <span className="bg-primary px-3 py-1.5 text-black font-black text-[10px] rounded-lg tracking-widest shadow-lg shadow-primary/10 whitespace-nowrap">{booking.assignedDriver.carDetails.carNumber}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <a
                                            href={`tel:${booking.assignedDriver.phone}`}
                                            className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-primary transition-all flex-shrink-0"
                                            title="Call Driver"
                                        >
                                            <FaPhoneAlt size={14} />
                                        </a>
                                        <a
                                            href={`sms:${booking.assignedDriver.phone}`}
                                            className="flex-1 h-12 bg-primary text-black rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95"
                                        >
                                            <FaCommentDots size={16} /> Send Message
                                        </a>
                                        {canCancel && (
                                            <button
                                                onClick={handleCancel}
                                                className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all flex-shrink-0 shadow-lg shadow-red-500/5"
                                                title="Cancel Ride"
                                            >
                                                <FaTimes size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    {booking.bookingStatus === 'Expired' || booking.status === 'expired' ? (
                                        <>
                                            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                                <FaTimesCircle className="text-red-500 text-2xl" />
                                            </div>
                                            <p className="text-red-500 font-black text-sm uppercase tracking-tighter italic mb-2">Ride Expired</p>
                                            <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">We couldn't find a driver in time. Please try booking again.</p>
                                        </>
                                    ) : booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled' ? (
                                        <>
                                            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                                <FaTimesCircle className="text-red-500 text-2xl" />
                                            </div>
                                            <p className="text-red-500 font-black text-sm uppercase tracking-tighter italic mb-2">Ride Cancelled</p>
                                            <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">This request has been cancelled by you or the system.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                {/* Pulsing High-Fidelity Radar Effect */}
                                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                                <div className="absolute inset-[-10px] rounded-full bg-primary/10 animate-[ping_2s_infinite_offset]" />
                                                <FaCar className="text-primary text-3xl relative z-10" />
                                            </div>

                                            <div className="mb-6">
                                                <div className="flex justify-between items-end mb-2">
                                                    <p className="text-white font-black text-lg uppercase tracking-tighter italic">Searching Driver</p>
                                                    <p className="text-primary font-black text-xl italic tabular-nums">
                                                        {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                                                    </p>
                                                </div>

                                                {/* Rapido-Style Linear Loader */}
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                                                    <motion.div
                                                        className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                                                        animate={{
                                                            left: ["-33%", "100%"]
                                                        }}
                                                        transition={{
                                                            duration: 2.5,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed mb-6">
                                                Matching your request with top active partners nearby...
                                            </p>

                                            {canCancel && (
                                                <button onClick={handleCancel} className="w-full py-4 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-[0.98]">
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
