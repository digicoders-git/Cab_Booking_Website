import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaClock, 
    FaChevronRight, FaTimes, FaCheckCircle, FaExclamationCircle,
    FaArrowRight, FaWallet, FaHistory
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';

const MyBulkBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // active | history

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/bulk-bookings/my-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error("Failed to fetch bulk bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this bulk booking request?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/bulk-bookings/cancel/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchMyBookings();
            } else {
                alert(data.message || "Cancellation failed.");
            }
        } catch (err) {
            console.error("Cancellation error", err);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'active') {
            return b.status === 'Marketplace' || b.status === 'Accepted';
        }
        return b.status === 'Completed' || b.status === 'Cancelled';
    });

    return (
        <div className="bg-black min-h-screen">
            <PageHeader 
                title="My Bulk Bookings" 
                subtitle="Track your wedding, event and corporate bulk fleet requests." 
            />

            <div className="container mx-auto px-4 py-20">
                {/* Tabs */}
                <div className="flex items-center gap-6 mb-12 border-b border-white/5">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                            activeTab === 'active' ? 'text-primary' : 'text-white/30 hover:text-white'
                        }`}
                    >
                        Live Requests
                        {activeTab === 'active' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                            activeTab === 'history' ? 'text-primary' : 'text-white/30 hover:text-white'
                        }`}
                    >
                        Past History
                        {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                </div>

                {loading ? (
                    <div className="h-60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#0A0A0A] border border-dashed border-white/10 rounded-3xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                            {activeTab === 'active' ? <FaTruck size={30} /> : <FaHistory size={30} />}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No {activeTab} bookings found</h3>
                        <p className="text-white/40 max-w-xs mx-auto">You haven't placed any bulk requests that match this status.</p>
                        <button 
                            onClick={() => window.location.href = '/bulk-booking'}
                            className="mt-8 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-all"
                        >
                            Create New Request
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredBookings.map((booking) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={booking._id} 
                                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl ${
                                            booking.status === 'Accepted' ? 'bg-green-500/10 text-green-500' : 
                                            booking.status === 'Marketplace' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-white/5 text-white/30'
                                        }`}>
                                            <FaTruck size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none">Status</span>
                                            <h4 className={`text-sm font-bold ${
                                                booking.status === 'Accepted' ? 'text-green-500' : 
                                                booking.status === 'Marketplace' ? 'text-orange-500' : 'text-white/50'
                                            }`}>{booking.status}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-primary">₹{booking.offeredPrice.toLocaleString()}</p>
                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">#{booking._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-white/20 uppercase mb-1">Pickup</p>
                                            <p className="text-sm font-bold text-white line-clamp-1">{booking.pickup.address}</p>
                                        </div>
                                        <div className="px-4 text-white/10">
                                            <FaArrowRight size={14} />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="text-[10px] font-black text-white/20 uppercase mb-1">Drop</p>
                                            <p className="text-sm font-bold text-white line-clamp-1">{booking.drop.address}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
                                        <div>
                                            <p className="text-[10px] text-white/20 font-black uppercase mb-1">Start Date</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <FaCalendarAlt size={12} className="text-primary" />
                                                <span className="text-xs font-bold">{new Date(booking.pickupDateTime).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/20 font-black uppercase mb-1">Days</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <FaClock size={12} className="text-primary" />
                                                <span className="text-xs font-bold">{booking.numberOfDays} Days</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/20 font-black uppercase mb-1">Fleet</p>
                                            <div className="flex flex-wrap justify-end gap-1">
                                                {booking.carsRequired.map((car, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-white/5 text-[9px] font-bold rounded text-white/40 uppercase">
                                                        {car.quantity}x {car.category?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {booking.status === 'Marketplace' && (
                                        <button 
                                            onClick={() => handleCancel(booking._id)}
                                            className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            <FaTimes /> Cancel Request
                                        </button>
                                    )}

                                    {booking.status === 'Accepted' && (
                                        <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex items-center gap-4">
                                            <FaCheckCircle className="text-green-500 shrink-0" size={20} />
                                            <div>
                                                <h5 className="text-white text-xs font-bold">Offer Accepted!</h5>
                                                <p className="text-[10px] text-white/40">The fleet owner is assigning cars. Track details on WhatsApp/Sms.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBulkBookings;
