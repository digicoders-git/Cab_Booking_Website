import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBell, FaRegBell, FaTag,
  FaInfoCircle, FaCalendarAlt,
  FaCheckCircle, FaSpinner, FaTaxi, FaGift, FaShieldAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import PageHeader from '../components/PageHeader';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setError(data.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const getIconConfig = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('off') || t.includes('discount') || t.includes('promo') || t.includes('gift'))
      return { icon: FaGift, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', strip: 'bg-purple-500' };
    if (t.includes('ride') || t.includes('booking') || t.includes('confirm') || t.includes('complete'))
      return { icon: FaCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', strip: 'bg-emerald-500' };
    if (t.includes('driver') || t.includes('taxi') || t.includes('cab'))
      return { icon: FaTaxi, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', strip: 'bg-primary' };
    if (t.includes('safe') || t.includes('alert') || t.includes('security'))
      return { icon: FaShieldAlt, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', strip: 'bg-amber-500' };
    if (t.includes('tag') || t.includes('offer'))
      return { icon: FaTag, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', strip: 'bg-primary' };
    return { icon: FaInfoCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', strip: 'bg-blue-500' };
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center">
      <div className="text-center space-y-4">
        <FaSpinner className="text-primary text-4xl mx-auto animate-spin" />
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#060606] min-h-screen pb-24">
      <PageHeader title="Notifications" breadcrumb="Notifications" />

      <div className="container mx-auto px-4 max-w-7xl mt-14">

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d0d] border border-white/5 rounded-[1.75rem] overflow-hidden mb-10"
        >
          {/* Yellow top strip */}
          <div className="h-[3px] w-full bg-primary" />
          <div className="flex items-center justify-between px-7 py-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <FaBell className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-white font-black text-base uppercase tracking-widest">Your Feed</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                    {notifications.length} Notification{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-primary text-black font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20">
              {notifications.length} Active
            </div>
          </div>
        </motion.div>

        {/* List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((note, index) => {
                const cfg = getIconConfig(note.title);
                const IconComp = cfg.icon;
                return (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#0d0d0d] border border-white/5 hover:border-primary/20 rounded-[1.75rem] overflow-hidden transition-all group"
                  >
                    {/* Top color strip */}
                    <div className={`h-[3px] w-full ${cfg.strip}`} />

                    <div className="p-6 md:p-7 flex gap-5 items-start">

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <IconComp className={`text-lg ${cfg.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shrink-0">
                            <FaCalendarAlt size={9} className="text-primary" />
                            <span className="text-primary text-[9px] font-black uppercase tracking-widest">{formatDate(note.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">{note.message}</p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-20 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
              <FaRegBell className="text-white/10 text-4xl" />
            </div>
            <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">Inbox is Empty</h3>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-10 max-w-xs mx-auto leading-relaxed">
              Check back later for exciting offers and updates.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-black font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all"
            >
              <FaTaxi /> Explore Rides
            </Link>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">Powered by KwikCabs  Real-Time Engine</p>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
