import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import PageHeader from '../components/PageHeader';
import { FaClock, FaCar, FaMapMarkerAlt, FaCheck, FaExclamationCircle, FaLocationArrow, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const Rentals = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [mapCoords, setMapCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
    const [isLocating, setIsLocating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [typingTimer, setTypingTimer] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/rentals/packages`);
                const data = await res.json();
                if (data.success) {
                    setPackages(data.packages);
                }
            } catch (error) {
                console.error("Failed to fetch rentals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleBookClick = (pkg) => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to book a rental package',
                icon: 'warning',
                background: '#111',
                color: '#fff',
                confirmButtonColor: '#FFD60A'
            });
            return;
        }
        setSelectedPkg(pkg);
        setIsModalOpen(true);
    };

    const detectLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setMapCoords({ lat: latitude, lng: longitude });
                
                try {
                    // Reverse geocode using OpenStreetMap
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        setPickupLocation(data.display_name);
                        setShowSuggestions(false);
                    }
                } catch (error) {
                    console.log("Failed to fetch address", error);
                }
                setIsLocating(false);
            }, (error) => {
                setIsLocating(false);
                toast.error("Location permission denied");
            });
        }
    };

    const handleLocationChange = (e) => {
        const val = e.target.value;
        setPickupLocation(val);
        
        if (typingTimer) clearTimeout(typingTimer);
        
        if (val.length > 2) {
            setTypingTimer(setTimeout(async () => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&countrycodes=in`);
                    const data = await res.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (err) {
                    console.log(err);
                }
            }, 600));
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setPickupLocation(suggestion.display_name);
        setMapCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const confirmBooking = async () => {
        if (!pickupLocation.trim()) {
            Swal.fire({ title: 'Wait!', text: 'Please enter or detect your pickup location.', icon: 'warning', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/rentals/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    packageId: selectedPkg._id, 
                    pickupLocation: {
                        address: pickupLocation,
                        lat: mapCoords.lat,
                        lng: mapCoords.lng
                    }, 
                    paymentMethod: 'Cash' 
                })
            });
            const data = await res.json();
            setIsModalOpen(false);
            if (data.success) {
                Swal.fire({ title: 'Success!', text: 'Your rental booking has been confirmed.', icon: 'success', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
            } else {
                Swal.fire({ title: 'Booking Failed', text: data.message || 'Something went wrong', icon: 'error', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
            }
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Failed to connect to the server.', icon: 'error', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-12">
            <PageHeader title="Rental Packages" breadcrumb="Rentals" />
            
            <div className="container mx-auto px-4 max-w-7xl py-16 lg:py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Book a Cab for <span className="text-primary">Multiple Stops</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Need a car for a few hours? Choose our hourly rental packages. Keep the cab with you for multiple stops and long durations without any hassle of booking again.
                    </p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                        {packages.map((pkg, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={pkg._id} 
                                className="bg-[#111] border border-white/5 hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col h-full relative hover:shadow-[0_0_30px_rgba(255,214,10,0.15)]"
                            >
                                {/* Top Gradient */}
                                <div className="h-2 w-full bg-gradient-to-r from-primary/50 to-primary group-hover:h-3 transition-all"></div>
                                
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white tracking-wide">{pkg.name}</h3>
                                            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase tracking-wider border border-primary/20">
                                                <FaCar size={12} />
                                                {pkg.carCategory?.name || 'Standard'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Base Package Fare</span>
                                        <div className="text-4xl font-bold text-white flex items-baseline">
                                            <span className="text-2xl mr-1 text-primary">₹</span>{pkg.basePrice}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-8 flex-grow">
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Package Inclusions</div>
                                        
                                        <div className="flex items-center gap-3 text-gray-300 bg-black/40 p-3.5 rounded-xl border border-white/5">
                                            <div className="text-primary shrink-0">
                                                <FaClock size={16} />
                                            </div>
                                            <span className="font-medium">{pkg.hours} Hours <span className="text-gray-500 font-normal text-sm ml-1">(Time Limit)</span></span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 text-gray-300 bg-black/40 p-3.5 rounded-xl border border-white/5">
                                            <div className="text-primary shrink-0">
                                                <FaMapMarkerAlt size={16} />
                                            </div>
                                            <span className="font-medium">{pkg.baseDistance} KMs <span className="text-gray-500 font-normal text-sm ml-1">(Distance Limit)</span></span>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Expected Extra Charges</div>
                                            <div className="flex items-start gap-3 text-gray-300 bg-primary/5 p-4 rounded-xl border border-primary/20">
                                                <div className="text-primary shrink-0 mt-0.5">
                                                    <FaExclamationCircle size={16} />
                                                </div>
                                                <div className="text-sm w-full">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-gray-400">After {pkg.hours} Hours:</span>
                                                        <span className="text-white font-bold">₹{pkg.extraMinutePrice}/Min</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">After {pkg.baseDistance} KMs:</span>
                                                        <span className="text-white font-bold">₹{pkg.extraKmPrice}/KM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleBookClick(pkg)}
                                        className="w-full flex justify-center items-center gap-2 bg-primary text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_14px_rgba(255,214,10,0.4)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:-translate-y-1"
                                    >
                                        <FaCheck size={16} /> Book This Package
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        
                        {packages.length === 0 && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-3xl text-center px-4">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary/40 border border-white/10">
                                    <FaCar size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No Packages Available</h3>
                                <p className="text-gray-500 max-w-md">We are currently updating our rental fleets in your area. Please check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Location Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center rounded-t-2xl">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" /> Select Pickup Location
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Map Preview */}
                                <div className="w-full h-[320px] bg-gray-800 rounded-xl overflow-hidden border border-white/5 relative">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                    {isLocating && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Location Input & Button */}
                                <div className="relative">
                                    <label className="text-sm text-gray-400 font-semibold mb-2 block">Pickup Address</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={pickupLocation}
                                            onChange={handleLocationChange}
                                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                                            placeholder="Enter location or detect automatically..." 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                        <button 
                                            onClick={detectLocation}
                                            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black px-4 rounded-xl flex justify-center items-center transition-all shrink-0"
                                            title="Detect My Location"
                                        >
                                            <FaLocationArrow size={18} />
                                        </button>
                                    </div>
                                    
                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-10 w-[calc(100%-56px)] mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden">
                                            {suggestions.map((s, idx) => (
                                                <div 
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(s)}
                                                    className="px-4 py-3 hover:bg-primary/20 cursor-pointer border-b border-white/5 last:border-0 flex items-start gap-3"
                                                >
                                                    <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                                                    <span className="text-sm text-gray-300 line-clamp-2">{s.display_name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 rounded-b-2xl">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button onClick={confirmBooking} className="bg-primary text-black px-8 py-2.5 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2">
                                    <FaCheck /> Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rentals;
