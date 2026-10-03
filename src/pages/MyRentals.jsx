import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import PageHeader from '../components/PageHeader';
import { FaClock, FaCar, FaMapMarkerAlt, FaHashtag, FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyRentals = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRentals = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/rentals/my-bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error("Failed to fetch my rentals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRentals();
    }, []);

    const handleCancel = async (bookingId) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Cancel Booking?',
            text: "Are you sure you want to cancel this rental booking?",
            icon: 'warning',
            showCancelButton: true,
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/rentals/bookings/${bookingId}/cancel`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success) {
                    Swal.fire({ title: 'Cancelled', text: 'Booking has been cancelled.', icon: 'success', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
                    fetchMyRentals();
                } else {
                    Swal.fire({ title: 'Error', text: data.message, icon: 'error', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
                }
            } catch (error) {
                Swal.fire({ title: 'Error', text: 'Server error', icon: 'error', background: '#111', color: '#fff', confirmButtonColor: '#FFD60A' });
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Started': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-12">
            <PageHeader title="My Rental Bookings" breadcrumb="My Rentals" />
            
            <div className="container mx-auto px-4 max-w-5xl py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#111] border border-white/5 rounded-3xl">
                        <FaCar size={48} className="mx-auto mb-4 text-primary/30" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Rental Bookings Found</h3>
                        <p className="text-gray-500 mb-6">You haven't booked any rental packages yet.</p>
                        <a href="/rentals" className="bg-primary text-black font-bold py-3 px-8 rounded-xl hover:bg-white transition-colors">Book a Rental</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all shadow-lg">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-white/5 pb-5">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-primary/80 mb-2 bg-primary/10 w-fit px-3 py-1 rounded-md border border-primary/20">
                                            <FaHashtag size={10} /> {booking.bookingId}
                                        </div>
                                        <div className="mt-1">
                                            <h3 className="text-2xl font-bold text-white tracking-wide">
                                                {booking.rentalPackage?.name || 'Unknown Package'}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-400">
                                                <FaCar className="text-primary" /> {booking.carCategory?.name || 'Any Car'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {(booking.status === 'Pending' || booking.status === 'Accepted') && (
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/20 transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <FaTimesCircle /> Cancel
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <FaCalendarAlt /> {new Date(booking.createdAt).toLocaleString()}
                                        </div>
                                        
                                        {/* OTP Display for Accepted Bookings */}
                                        {booking.status === 'Accepted' && booking.otp && (
                                            <div className="mt-2 bg-primary/20 border border-primary/50 px-4 py-2 rounded-lg text-center animate-pulse">
                                                <span className="text-xs text-primary/80 uppercase tracking-widest block mb-1">Your OTP</span>
                                                <span className="text-2xl font-mono font-bold text-white tracking-[0.2em]">{booking.otp}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    <div className="space-y-4 md:col-span-3">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Package Details</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="bg-white/5 p-2 rounded-lg text-primary"><FaClock size={14} /></div>
                                                <span className="font-medium">{booking.rentalPackage?.hours || '-'} Hours</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="bg-white/5 p-2 rounded-lg text-primary"><FaMapMarkerAlt size={14} /></div>
                                                <span className="font-medium">{booking.rentalPackage?.baseDistance || '-'} KMs</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 md:col-span-6">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Pickup Location</div>
                                        <div className="text-gray-300 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 leading-relaxed text-sm h-full min-h-[80px] flex items-center">
                                            {typeof booking.pickupLocation === 'object' && booking.pickupLocation !== null 
                                                ? booking.pickupLocation.address 
                                                : (booking.pickupLocation || 'N/A')}
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:col-span-3 md:text-right border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Fare</div>
                                        <div>
                                            <div className="text-4xl font-bold text-white mb-2">
                                                <span className="text-primary text-2xl mr-1">₹</span>{booking.fareDetails?.totalFare || 0}
                                            </div>
                                            <div className="inline-block px-3 py-1 bg-white/5 rounded-md text-xs text-gray-400 font-medium">
                                                Payment: <span className="text-white">{booking.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRentals;
