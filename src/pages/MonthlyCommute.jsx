import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const MonthlyCommute = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [pickupTime, setPickupTime] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/users/subscription-plans`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const data = await res.json();
                if (data.success) {
                    setPlans(data.plans);
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleBuy = async () => {
        if (!pickupTime || !returnTime) {
            return Swal.fire('Error', 'Please select your daily pickup and return times.', 'error');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                title: 'Please Login',
                text: 'You need to login first to buy a pass.',
                icon: 'warning',
                confirmButtonColor: '#FFD60A'
            });
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/users/buy-subscription`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    planId: selectedPlan._id,
                    pickupTime,
                    returnTime
                })
            });
            const data = await res.json();

            if (data.success && data.paymentUrl) {
                Swal.fire({
                    title: 'Redirecting...',
                    text: 'Redirecting to secure payment gateway...',
                    icon: 'info',
                    showConfirmButton: false,
                    timer: 2000
                });
                window.location.href = data.paymentUrl;
            } else if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Subscription Pass Booked Successfully!',
                    icon: 'success',
                    confirmButtonColor: '#FFD60A'
                });
                setSelectedPlan(null);
                setPickupTime('');
                setReturnTime('');
            } else {
                console.error("Backend returned error:", data);
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            Swal.fire('Error', 'Something went wrong.', 'error');
        }
    };

    return (
        <div className="bg-[#0A0A0A] min-h-screen font-sans">
            <PageHeader title="Subscriptions" breadcrumb="Monthly Commute Passes" />

            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map(plan => (
                            <div key={plan._id} className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,214,10,0.15)] transition-all duration-300 relative group flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                
                                <div className="p-6 border-b border-white/5 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-wide">{plan.name}</h3>
                                        <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {plan.validityDays} Days
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black text-primary">₹{plan.price}</span>
                                        <span className="text-sm font-medium text-white/50 mb-1">/mo</span>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col relative z-10">
                                    <div className="space-y-5 mb-8 flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Pickup Point</p>
                                                <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">{plan.pickup?.address}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                                                <FaMapMarkerAlt size={14} className="text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Drop Point</p>
                                                <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">{plan.drop?.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 text-sm text-white/70 mb-8 p-5 bg-black/40 rounded-xl border border-white/5">
                                        <li className="flex items-center gap-3">
                                            <FaCheckCircle className="text-primary text-lg shrink-0"/> 
                                            <span><strong className="text-white">{plan.carCategory?.name || 'Any Car'}</strong> Category</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaCheckCircle className="text-primary text-lg shrink-0"/> 
                                            <span><strong className="text-white">{plan.ridesPerDay}</strong> Rides Per Day</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaCheckCircle className="text-primary text-lg shrink-0"/> 
                                            <span><strong className="text-white">{plan.distanceKm} KM</strong> Route Distance</span>
                                        </li>
                                    </ul>

                                    <button 
                                        onClick={() => setSelectedPlan(plan)}
                                        className="w-full py-4 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,214,10,0.4)] transition-all active:scale-[0.98]"
                                    >
                                        Buy Subscription
                                    </button>
                                </div>
                            </div>
                        ))}
                        {plans.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/50 bg-[#141414] rounded-3xl border border-white/5">
                                <FaExclamationCircle className="h-16 w-16 text-white/20 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No Subscriptions Available</h3>
                                <p className="text-sm">We currently don't have any active fixed route plans.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Buy Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-[#141414] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-white/10">
                        <div className="bg-white/5 p-6 text-center border-b border-white/10 relative">
                            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                                &times;
                            </button>
                            <h3 className="text-xl font-bold text-white mb-1">Set Your Schedule</h3>
                            <p className="text-sm text-primary">{selectedPlan.name}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                                    <FaClock className="text-primary" /> Pickup Time (Go)
                                </label>
                                <input 
                                    type="time" 
                                    value={pickupTime} 
                                    onChange={(e) => setPickupTime(e.target.value)} 
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white outline-none" 
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                                    <FaClock className="text-primary" /> Return Time (Back)
                                </label>
                                <input 
                                    type="time" 
                                    value={returnTime} 
                                    onChange={(e) => setReturnTime(e.target.value)} 
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white outline-none" 
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            
                            <div className="bg-primary/10 p-5 rounded-xl border border-primary/20 mt-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/80 font-medium">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">₹{selectedPlan.price}</span>
                                </div>
                                <p className="text-[11px] text-white/50">Payable securely via Razorpay. Plan is valid for {selectedPlan.validityDays} days from today.</p>
                            </div>

                            <button 
                                onClick={handleBuy}
                                className="w-full py-4 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-sm mt-4 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,214,10,0.4)] transition-all active:scale-[0.98]"
                            >
                                Confirm Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyCommute;
