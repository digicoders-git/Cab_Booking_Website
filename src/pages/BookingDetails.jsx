import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaTaxi, FaMapMarkerAlt, FaUser, FaPhoneAlt,
    FaCreditCard, FaChevronLeft, FaSpinner,
    FaStar, FaCar, FaDotCircle, FaShieldAlt,
    FaRoad, FaClock, FaHistory, FaCheckCircle, FaTimesCircle,
    FaCommentDots, FaFingerprint, FaRoute
} from 'react-icons/fa';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [locationUpdateCount, setLocationUpdateCount] = useState(0);

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

    // 2. Map Initialization
    useEffect(() => {
        if (loading || !booking || !window.google || googleMap.current) return;

        const pickupCoords = {
            lat: booking.pickup.latitude,
            lng: booking.pickup.longitude
        };

        // Initialize Map with Standard Normal Theme
        googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: pickupCoords,
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
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

        // Add Origin Marker (Pickup)
        originMarker.current = new window.google.maps.Marker({
            position: pickupCoords,
            map: googleMap.current,
            label: { text: 'A', color: 'black', fontWeight: 'bold' },
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#FFFFFF',
                fillOpacity: 1,
                strokeColor: '#000000',
                strokeWeight: 2,
                scale: 12
            }
        });

        // Add Destination Marker (Drop) - CUSTOM RED PIN
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

        // Auto-Adjust Viewport
        googleMap.current.fitBounds(bounds, { top: 70, bottom: 70, left: 70, right: 70 });

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
        if (!bookingId || !booking) return;
        const socket = io(backendServer);

        // Track Connection Status
        socket.on('connect', () => {
            setIsConnected(true);
            console.log("Socket Connected ✅");
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log("Socket Disconnected ❌");
        });

        // Join Room - DYNAMIC ROLE DETECTION
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role') || 'user'; // user or agent
        
        console.log(`Socket joining room as ${userRole}: ${userId}`);
        socket.emit('join_room', { userId, role: userRole });

        socket.on('booking_update', (data) => {
            if (data.bookingId === bookingId) {
                console.log("Booking Status Updated 🔔", data.status);
                fetchBooking();
            }
        });

        // LIVE DRIVER MOVEMENT LISTENER
        socket.on('driver_location_update', (data) => {
            console.log("Incoming Location Packet 📍", data);
            
            // Flexibly find IDs (backend might send object or ID string)
            const activeDriverId = booking?.assignedDriver?._id || booking?.assignedDriver;
            const incomingDriverId = data.driverId?._id || data.driverId;

            // Check if this update is from our assigned driver
            if (activeDriverId && incomingDriverId && activeDriverId.toString() === incomingDriverId.toString()) {
                console.log("Valid Signal for current ride! Increasing count...");
                
                // Increment Signal Counter
                setLocationUpdateCount(prev => prev + 1);

                const newCoords = { lat: data.latitude, lng: data.longitude };
                
                // --- SMOOTH ANIMATION LOGIC ---
                if (driverMarker.current) {
                    const startPos = driverMarker.current.getPosition();
                    const endPos = new window.google.maps.LatLng(newCoords.lat, newCoords.lng);
                    
                    let frames = 20; // 20 frames for 1 second movement
                    let count = 0;
                    
                    const animate = () => {
                        count++;
                        const lat = startPos.lat() + (endPos.lat() - startPos.lat()) * (count / frames);
                        const lng = startPos.lng() + (endPos.lng() - startPos.lng()) * (count / frames);
                        
                        const nextPos = new window.google.maps.LatLng(lat, lng);
                        driverMarker.current.setPosition(nextPos);

                        if (count < frames) {
                            requestAnimationFrame(animate);
                        } else {
                            // Final sync
                            setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
                        }
                    };
                    requestAnimationFrame(animate);
                } else {
                    // First time location
                    console.log("Initializing Driver Marker on Map");
                    setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
                }
            } else {
                console.warn("Location update received but IDs mismatch:", { activeDriverId, incomingDriverId });
            }
        });

        return () => socket.disconnect();
    }, [bookingId, booking]);

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
                window.location.reload();
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
        <div className="bg-[#060606] min-h-screen pt-[105px] pb-20">

            {/* FULL WIDTH DYNAMIC MAP (JS API) */}
            <div className="relative w-full h-[60vh] min-h-[500px] border-b border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div ref={mapRef} className="w-full h-full" />

                {/* Floating Navigation Controls */}
                <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
                    <button onClick={() => window.history.back()} className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all">
                        <FaChevronLeft size={18} />
                    </button>

                    {/* Signal Counter Badge */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-primary/95 backdrop-blur-xl px-5 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-black/10 min-w-[120px]"
                    >
                        <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center text-black">
                            <FaRoute size={16} />
                        </div>
                        <div>
                            <p className="text-black/50 text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">Signal Rx</p>
                            <span className="text-black font-black text-2xl leading-none">{locationUpdateCount}</span>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-8 right-8 z-10 flex items-center gap-3">
                    {/* Live Connection Indicator */}
                    <div className={`px-4 py-3 rounded-full backdrop-blur-md border ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-2 shadow-2xl`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isConnected ? 'Live' : 'Offline'}</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-black/80 backdrop-blur-xl px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10"
                    >
                        <div className={`w-3 h-3 rounded-full ${isPending ? 'bg-yellow-500 animate-pulse' : (booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]')}`} />
                        <span className="text-white font-black text-xs uppercase tracking-[0.2em]">{booking.bookingStatus || booking.status}</span>
                    </motion.div>
                </div>
            </div>

            {/* MODERN VERTICAL CONTENT DASHBOARD */}
            <div className="container mx-auto px-4 mt-16 relative z-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT CONTENT: Journey Details */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Journey Tracking Card */}
                        <div className="bg-[#111] p-10 lg:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12">
                                <FaRoute size={200} />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start mb-14 gap-6">
                                <div>
                                    <h1 className="text-white font-black text-5xl mb-2 italic tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>Ride Summary</h1>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                                            <span className="text-primary font-black text-[10px] uppercase tracking-widest italic">{booking.rideType || "Private"} Ride</span>
                                        </div>
                                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">ID: #{booking._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                        <FaShieldAlt size={16} />
                                    </div>
                                    <span className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none">Safe Journey<br />Verified</span>
                                </div>
                            </div>

                            {/* Stylized Route Information */}
                            <div className="space-y-16 relative z-10 pl-12 before:absolute before:left-4 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-white/20 before:to-primary/50">
                                {/* Pickup */}
                                <div className="relative">
                                    <div className="absolute -left-[44px] top-1.5 w-8 h-8 bg-black border-4 border-white rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Pickup Address</p>
                                    <h4 className="text-white font-bold text-xl leading-relaxed max-w-xl">{booking.pickup?.address || booking.pickupAddress}</h4>
                                </div>

                                {/* Dropoff */}
                                <div className="relative">
                                    <div className="absolute -left-[44px] top-1.5 w-8 h-8 bg-black border-4 border-primary rounded-2xl z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,214,10,0.2)]">
                                        <div className="w-2 h-2 bg-primary rounded-sm" />
                                    </div>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Destination</p>
                                    <h4 className="text-white font-bold text-xl leading-relaxed max-w-xl">{booking.drop?.address || booking.dropAddress}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Quick Insight Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Distance', val: `${booking.estimatedDistanceKm || booking.distanceKm} KM`, icon: <FaRoad className="text-primary" /> },
                                { label: 'Est. Time', val: '25 Mins', icon: <FaClock className="text-blue-500" /> },
                                { label: 'Driver Rating', val: '5.0', icon: <FaStar className="text-yellow-500" /> },
                                { label: 'Base Info', val: 'Verified', icon: <FaHistory className="text-green-500" /> }
                            ].map((stat, i) => (
                                <motion.div key={i} whileHover={{ y: -5 }} className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 text-center shadow-lg">
                                    <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        {stat.icon}
                                    </div>
                                    <span className="text-white/30 text-[9px] font-black uppercase block mb-1 tracking-widest">{stat.label}</span>
                                    <p className="text-white font-black text-xl italic font-syne">{stat.val}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR: Driver & Payment */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Premium Driver Card */}
                        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                            {booking.assignedDriver ? (
                                <>
                                    <div className="flex flex-col items-center text-center mb-10">
                                        <div className="relative mb-6">
                                            <div className="w-32 h-32 rounded-[3rem] overflow-hidden border-4 border-primary/20 p-1.5">
                                                <div className="w-full h-full bg-white/5 rounded-[2.5rem] flex items-center justify-center">
                                                    <FaUser className="text-white/10 text-5xl" />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-primary text-black w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-[#111] shadow-xl">
                                                <FaStar size={14} />
                                            </div>
                                        </div>
                                        <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{booking.assignedDriver.name}</h4>
                                        <div className="flex items-center gap-1.5 text-primary text-xs">
                                            <FaStar size={10} /><FaStar size={10} /><FaStar size={10} /><FaStar size={10} /><FaStar size={10} />
                                            <span className="text-white/30 ml-2 font-bold">(5.0) Super Driver</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] p-5 rounded-[2.5rem] border border-white/5 mb-8 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30">
                                                <FaCar size={20} />
                                            </div>
                                            <div>
                                                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] block mb-0.5">Vehicle</span>
                                                <span className="text-white font-bold text-xs uppercase tracking-tighter">{booking.assignedDriver.carDetails.carModel}</span>
                                            </div>
                                        </div>
                                        <span className="bg-primary px-4 py-2 text-black font-black text-[9px] rounded-xl tracking-widest shadow-lg shadow-primary/20">{booking.assignedDriver.carDetails.carNumber}</span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            <button className="flex-1 h-14 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white/60 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                                                <FaPhoneAlt size={14} /> Call
                                            </button>
                                            <button className="flex-[2] h-14 bg-primary text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-400 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95">
                                                <FaCommentDots size={16} /> Chat
                                            </button>
                                        </div>
                                        {canCancel && (
                                            <button
                                                onClick={handleCancel}
                                                className="w-full py-4 border border-red-500/30 text-red-500/60 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                                            >
                                                Cancel This Ride
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="py-10 text-center space-y-8">
                                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-primary/20 rounded-full"
                                        />
                                        <FaSpinner className="text-primary text-4xl animate-spin" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase text-lg italic tracking-tighter mb-3 leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>Matching your Perfect Driver</h4>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">Broadcasted your {booking.rideType} ride to top nearby partners.</p>
                                    </div>
                                    {canCancel && (
                                        <button
                                            onClick={handleCancel}
                                            className="w-full py-4 border border-red-500/30 text-red-500/60 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                                        >
                                            Cancel This Ride
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment & Security Card */}
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-10 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary/20 transition-all">
                                        <FaCreditCard />
                                    </div>
                                    <div>
                                        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest block mb-1 leading-none">Payment Detail</p>
                                        <p className="text-white font-bold text-sm">{booking.paymentMethod || "Cash"} • {booking.paymentStatus}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-primary font-black text-4xl italic font-syne tracking-tighter drop-shadow-[0_0_15px_rgba(255,214,10,0.2)]">₹{booking.fareEstimate || booking.totalFare}</h2>
                                </div>
                            </div>

                            {/* Trip Security OTP Card */}
                            {booking.tripData?.startOtp && (
                                <div className="relative p-8 bg-gradient-to-r from-primary to-yellow-500 rounded-[2.5rem] shadow-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer">
                                    <div className="absolute right-0 top-0 p-4 opacity-10">
                                        <FaFingerprint size={100} className="text-black" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="text-black/50 text-[10px] font-black uppercase tracking-[0.3em] block mb-3 leading-none">Trip Start OTP</span>
                                        <div className="flex items-center justify-between">
                                            <span className="text-black font-black text-5xl tracking-[0.5em] font-syne">{booking.tripData.startOtp}</span>
                                            <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center text-black">
                                                <FaCheckCircle size={20} />
                                            </div>
                                        </div>
                                    </div>
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
