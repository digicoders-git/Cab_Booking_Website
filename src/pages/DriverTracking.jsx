import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaTaxi, FaMapMarkerAlt, FaPhoneAlt, FaTimes, FaCheckCircle,
  FaClock, FaStar, FaUser, FaRoute, FaShieldAlt, FaChevronRight,
  FaCommentAlt, FaExclamationTriangle, FaFingerprint
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { io } from 'socket.io-client';
import { API_BASE_URL, BASE_URL } from '../config/api';

const DriverTracking = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [eta, setEta] = useState('--');

    // Refs for Map
    const mapRef = useRef(null);
    const googleMap = useRef(null);
    const driverMarker = useRef(null);
    const pickupMarker = useRef(null);
    const dropMarker = useRef(null);
    const directionsRenderer = useRef(null);
    const directionsService = useRef(null);
    const socketRef = useRef(null);

    const backendServer = API_BASE_URL.replace(/\/api$/, '');

    // 1. Fetch Latest Booking Data
    const fetchBookingDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBooking(data.booking);
                if (data.booking.driverLocation) {
                    setDriverLocation(data.booking.driverLocation);
                }
            } else {
                setError(data.message || "Booking Not Found");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) fetchBookingDetails();
    }, [bookingId]);

    // 2. Initialize Google Map
    useEffect(() => {
        if (loading || !booking || !window.google || googleMap.current) return;

        const pickupCoords = { lat: booking.pickup.latitude, lng: booking.pickup.longitude };

        googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: pickupCoords,
            zoom: 15,
            disableDefaultUI: true,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            ]
        });

        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
            map: googleMap.current,
            suppressMarkers: true,
            polylineOptions: { strokeColor: '#FACD16', strokeWeight: 5 }
        });

        pickupMarker.current = new window.google.maps.Marker({
            position: pickupCoords,
            map: googleMap.current,
            icon: {
                url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                scaledSize: new window.google.maps.Size(40, 40)
            }
        });

        dropMarker.current = new window.google.maps.Marker({
            position: { lat: booking.drop.latitude, lng: booking.drop.longitude },
            map: googleMap.current,
            icon: {
                url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                scaledSize: new window.google.maps.Size(40, 40)
            }
        });

        updateRoute();
    }, [loading, booking]);

    // 3. Socket.io Connection
    useEffect(() => {
        if (!bookingId) return;

        socketRef.current = io(backendServer, { transports: ['websocket', 'polling'] });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            const userId = localStorage.getItem('userId');
            if (userId) socketRef.current.emit('join_room', { userId, role: 'user' });
        });

        socketRef.current.on('driver_location_update', (data) => {
            if (data.bookingId === bookingId || data.driverId === booking?.assignedDriver?._id) {
                setDriverLocation({ latitude: data.latitude, longitude: data.longitude, heading: data.heading });
                
                // Real-time Marker Update
                if (driverMarker.current) {
                    const newPos = new window.google.maps.LatLng(data.latitude, data.longitude);
                    driverMarker.current.setPosition(newPos);
                    
                    // Simple ETA Calc: assume 20km/h
                    const pickup = { lat: booking.pickup.latitude, lng: booking.pickup.longitude };
                    const dist = window.google.maps.geometry.spherical.computeDistanceBetween(newPos, new window.google.maps.LatLng(pickup.lat, pickup.lng));
                    const mins = Math.max(1, Math.round((dist / 1000) / 20 * 60));
                    setEta(mins);
                }
            }
        });

        socketRef.current.on('booking_update', (data) => {
            if (data.bookingId === bookingId) fetchBookingDetails();
        });

        return () => socketRef.current.disconnect();
    }, [bookingId, booking]);

    const updateRoute = () => {
        if (!directionsService.current || !booking) return;

        const origin = driverLocation ? { lat: driverLocation.latitude, lng: driverLocation.longitude } : { lat: booking.pickup.latitude, lng: booking.pickup.longitude };
        const dest = booking.bookingStatus === 'Ongoing' ? { lat: booking.drop.latitude, lng: booking.drop.longitude } : { lat: booking.pickup.latitude, lng: booking.pickup.longitude };

        directionsService.current.route({
            origin,
            destination: dest,
            travelMode: 'DRIVING'
        }, (res, status) => {
            if (status === 'OK') directionsRenderer.current.setDirections(res);
        });

        // Initialize Driver Marker if not exists
        if (driverLocation && !driverMarker.current) {
            driverMarker.current = new window.google.maps.Marker({
                position: { lat: driverLocation.latitude, lng: driverLocation.longitude },
                map: googleMap.current,
                icon: {
                    url: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 20)
                }
            });
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Live Tracker...</div>;
    if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;

    const driverData = booking?.assignedDriver || {};

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <PageHeader title="Live Driver Tracking" subtitle={`Booking ID: #${bookingId.slice(-6)}`} />

            <div className="section-padding container mx-auto px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* LEFT: REAL MAP */}
                    <div className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100" style={{ minHeight: '450px' }}>
                        <div ref={mapRef} className="w-full h-full absolute inset-0" />
                        
                        {/* Status Overlay */}
                        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                             <div className="bg-[#111] text-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
                                <FaClock className="text-primary" />
                                <div>
                                    <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">ETA</div>
                                    <div className="text-xl font-extrabold leading-none">{eta} min</div>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit shadow-lg ${isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {isConnected ? '● Live' : '○ Offline'}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DRIVER INFO */}
                    <div className="flex flex-col gap-6">
                        {driverData.name ? (
                             <div className="bg-white rounded-[32px] shadow-xl p-8 flex items-center gap-6 border border-gray-50">
                                <div className="relative shrink-0">
                                    <img src={driverData.image ? `${BASE_URL}/uploads/${driverData.image}` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={driverData.name} className="w-20 h-20 rounded-[20px] object-cover border-4 border-primary shadow-lg" />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-extrabold text-[#111111] uppercase tracking-tight">{driverData.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <FaStar className="text-primary text-sm" />
                                        <span className="text-xs font-extrabold text-gray-500 ml-1">4.9 · {driverData.carDetails?.carModel}</span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <span className="text-[10px] font-extrabold bg-primary/10 text-[#111111] px-3 py-1 rounded-full uppercase tracking-widest">{driverData.carDetails?.carNumber}</span>
                                        <span className="text-[10px] font-extrabold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">OTP: {booking.tripData?.startOtp}</span>
                                    </div>
                                </div>
                                <a href={`tel:${driverData.phone}`} className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-[#111111] shadow-lg hover:bg-[#111111] hover:text-primary transition-all shrink-0">
                                    <FaPhoneAlt />
                                </a>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[32px] shadow-xl p-10 text-center animate-pulse">
                                <FaTaxi className="mx-auto text-4xl text-gray-200 mb-4" />
                                <h3 className="text-gray-400 font-bold">Waiting for Driver confirmation...</h3>
                            </div>
                        )}

                        <div className="bg-white rounded-[32px] shadow-xl p-8 border border-gray-50">
                            <h4 className="text-sm font-extrabold text-[#111111] uppercase tracking-widest mb-6">Ride Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-green-500 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Pickup</p>
                                        <p className="text-sm font-bold text-gray-800">{booking.pickup?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Dropoff</p>
                                        <p className="text-sm font-bold text-gray-800">{booking.drop?.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safety & Action */}
                        <div className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <FaShieldAlt />
                            </div>
                            <p className="text-xs font-medium text-gray-500">Your ride is protected by <span className="font-extrabold text-[#111111]">CapBokkin Safety Shield</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverTracking;
