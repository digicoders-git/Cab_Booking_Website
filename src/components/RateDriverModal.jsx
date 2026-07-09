import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../config/api';

const RateDriverModal = ({ isOpen, onClose, bookingId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Rating Required',
                text: 'Please select at least 1 star.',
                background: '#111',
                color: '#fff',
                confirmButtonColor: '#FACD16'
            });
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/rate-driver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, review })
            });

            const data = await response.json();
            
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thank You!',
                    text: 'Your feedback has been submitted successfully.',
                    background: '#111',
                    color: '#fff',
                    confirmButtonColor: '#FACD16'
                });
                onSuccess();
                onClose();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message || 'Something went wrong!',
                    background: '#111',
                    color: '#fff'
                });
            }
        } catch (error) {
            console.error('Rating submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not connect to the server.',
                background: '#111',
                color: '#fff'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 w-full max-w-md relative overflow-hidden"
                >
                    {/* Glowing effect in background */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />

                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
                    >
                        <FaTimes />
                    </button>

                    <div className="text-center mb-8 mt-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Rate Your Ride</h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">How was your experience with the driver?</p>
                    </div>

                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <FaStar 
                                    size={40} 
                                    className={`transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-primary drop-shadow-[0_0_10px_rgba(250,205,22,0.5)]' : 'text-white/10'}`} 
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mb-8 relative z-10">
                        <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3 ml-1">
                            Write a Review (Optional)
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Tell us what you liked or how we can improve..."
                            className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-28 text-sm relative z-20"
                        />
                    </div>

                    <div className="flex gap-3 relative z-20">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/5 border border-white/10 text-white/70 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white/10 hover:text-white transition-all text-xs"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-[2] bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,205,22,0.2)]"
                        >
                            {isSubmitting ? (
                                <><FaSpinner className="animate-spin" /> Submitting...</>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RateDriverModal;

