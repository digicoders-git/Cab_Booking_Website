import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaUsers, FaTaxi, FaPen, FaTimes } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const Reviews = () => {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Marcus Holloway",
      role: "Business Executive",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      content: "Taxica has completely changed my daily commute. The drivers are professional, the cars are pristine, and they are never late. Highly recommended for business travels!",
      rating: 5
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      role: "Frequency Traveler",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      content: "I love the shared ride feature. It's affordable and I've met some wonderful people during my trips. The matching system is seamless and accurate.",
      rating: 5
    },
    {
      id: 3,
      name: "Sam Wilson",
      role: "Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      content: "Affordable and reliable. As a student, the fare calculation tool helps me manage my budget perfectly. The app is also very easy to use.",
      rating: 4
    },
    {
       id: 4,
       name: "Jessica Pearson",
       role: "Lawyer",
       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
       content: "The premium service is truly premium. If you want a comfortable ride across town, Taxica is the only choice. Their support team is also very helpful.",
       rating: 5
    },
    {
       id: 5,
       name: "David Chen",
       role: "Tech Lead",
       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
       content: "Brilliant tech integration. The auto-matching for shared rides is far superior to any other local service I've tried. Very efficient routes.",
       rating: 5
    }
  ]);

  // ── Review Submit State ──
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [form, setForm] = useState({ name: '', role: '', rating: 0, content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.rating || !form.content) return;

    const newReview = {
      id: Date.now(),
      name: form.name,
      role: form.role || 'Taxica Rider',
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=FFC107&color=111111&bold=true&size=200`,
      content: form.content,
      rating: form.rating,
    };

    setTestimonials(prev => [newReview, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm({ name: '', role: '', rating: 0, content: '' });
    }, 2500);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Customer Reviews" subtitle="What our happy riders say about us" />
      
      <div className="section-padding container mx-auto px-4">
        
        {/* Stats Section */}
        <div className="max-w-5xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-primary p-10 rounded-[40px] text-[#111111] text-center shadow-xl">
              <div className="text-4xl font-extrabold mb-2">4.9/5</div>
              <div className="flex justify-center gap-1 mb-4 text-white">
                 {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Average Rating</p>
           </div>
           <div className="bg-[#111111] p-10 rounded-[40px] text-white text-center shadow-xl">
              <div className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-3">
                 <FaUsers className="text-primary" /> 15k+
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-4">Happy Customers</p>
           </div>
           <div className="bg-white p-10 rounded-[40px] text-[#111111] text-center shadow-xl border border-gray-100">
              <div className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-3 text-green-500">
                 <FaCheckCircle /> 100%
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">Safe Journeys</p>
           </div>
        </div>

        {/* ── WRITE A REVIEW CTA ── */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111111] rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-primary text-[10px] font-extrabold uppercase tracking-widest mb-3">
                <FaTaxi /> Share Your Experience
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tighter leading-tight">
                Ridden With Taxica?<br />
                <span className="text-primary">Tell Us How It Went!</span>
              </h3>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="relative z-10 flex items-center gap-3 bg-primary text-[#111111] px-10 py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20 shrink-0"
            >
              <FaPen /> Write a Review
            </button>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.1, 0.4) }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl relative border border-gray-50 group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                 <FaQuoteLeft className="text-6xl" />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < item.rating ? "text-primary" : "text-gray-200"} />
                  ))}
                </div>

                <p className="text-gray-600 font-medium italic leading-relaxed mb-8">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <h4 className="font-extrabold text-[#111111] uppercase tracking-tighter">{item.name}</h4>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── REVIEW SUBMIT MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-[#111111] p-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-tighter">Write a Review</h3>
                  <p className="text-[10px] text-primary font-extrabold uppercase tracking-[0.2em] mt-1">Share your Taxica experience</p>
                </div>
                <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <FaTimes />
                </button>
              </div>

              {/* Form Body */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-14 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-[#111111] uppercase tracking-tight mb-2">Thank You!</h4>
                    <p className="text-gray-500 font-medium">Your review has been posted successfully.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="p-8 space-y-5"
                  >
                    {/* Star Rating */}
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-3">Your Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(0)}
                            onClick={() => setForm(f => ({ ...f, rating: star }))}
                            className="transition-transform hover:scale-125 active:scale-110"
                          >
                            <FaStar className={`text-3xl transition-colors ${star <= (hoverStar || form.rating) ? 'text-primary' : 'text-gray-200'}`} />
                          </button>
                        ))}
                        {form.rating > 0 && (
                          <span className="text-sm font-extrabold text-gray-400 self-center ml-2 uppercase tracking-widest">
                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name + Role */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Your Role</label>
                        <input
                          type="text"
                          value={form.role}
                          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                          placeholder="e.g. Business Travel"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Your Review *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        placeholder="Tell us about your experience with Taxica..."
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!form.name || !form.rating || !form.content}
                      className={`w-full py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl ${
                        form.name && form.rating && form.content
                          ? 'bg-primary text-[#111111] hover:bg-[#111111] hover:text-primary shadow-primary/20'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Review
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;
