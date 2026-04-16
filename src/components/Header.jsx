import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import {
  FaTaxi, FaEnvelope, FaPhoneAlt, FaClock,
  FaSignInAlt, FaUser, FaFacebookF, FaTwitter,
  FaInstagram, FaLinkedinIn, FaSearch, FaChevronDown,
  FaBars, FaTimes, FaBell, FaCheckCircle,
  FaMapMarkerAlt, FaCalendarAlt, FaCar, FaHashtag,
  FaExclamationCircle, FaGift, FaRoute, FaThumbsUp, FaUserCircle
} from 'react-icons/fa';

const navLinks = [
  { name: 'Home', path: '/', hasDropdown: false },
  { name: 'About', path: '/about', hasDropdown: false },
  { name: 'Our Fleet', path: '/fleet', hasDropdown: false },
  { name: 'Services', path: '/services', hasDropdown: false },
  { name: 'Bulk Booking', path: '/bulk-booking', hasDropdown: false },
  { name: 'My Rides', path: '/my-booking', hasDropdown: false },
  { name: 'My Bulk Rides', path: '/my-bulk-bookings', hasDropdown: false },
  { name: 'Support', path: '/support', hasDropdown: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Booking Confirmed', time: '2m ago', icon: <FaCheckCircle className="text-green-400" />, text: 'Your ride TX-992188 for today at 4:30 PM has been confirmed.', read: false },
    { id: 2, title: 'Driver Assigned', time: '5m ago', icon: <FaTaxi className="text-primary" />, text: 'Ravi Kumar (Toyota Camry • DL 01 AB 1234) is your driver. ETA: 8 mins.', read: false },
    { id: 3, title: '🎁 Promo Unlocked', time: '1h ago', icon: <FaGift className="text-purple-400" />, text: 'Use KwikCabs 20 for 20% off on your next airport ride.', read: false },
    { id: 4, title: 'Ride Completed', time: '3h ago', icon: <FaRoute className="text-blue-400" />, text: 'Your ride TX-992105 was completed. Total fare: ₹248.', read: true },
    { id: 5, title: 'Safety Alert', time: '1d ago', icon: <FaExclamationCircle className="text-orange-400" />, text: 'Share your live location with a trusted contact.', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOffcanvasOpen]);

  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '#') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
      <div className="container mx-auto 2xl:max-w-[1400px] px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 lg:py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 z-50 shrink-0">
          <img src={logo} alt="KwikCabs  Logo" className="h-20 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${isActive(link.path) ? 'text-primary' : 'text-white/70 hover:text-white'}`}
              >
                {link.name}
                {link.hasDropdown && <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />}
              </Link>

              {link.hasDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-[1000]">
                  <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {link.subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        to={sub.path}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors text-white/70 hover:text-white text-sm"
                      >
                        <span className="text-primary">{sub.icon}</span>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications - Direct Link instead of Dropdown */}
          <Link
            to="/notifications"
            className="hidden xl:flex relative w-9 h-9 items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <FaBell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="relative w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <FaUserCircle size={18} />
          </Link>

          {/* Mobile menu */}
          <button
            onClick={() => setIsOffcanvasOpen(true)}
            className="xl:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <FaBars size={18} />
          </button>
        </div>
      </div>



    </header>

      {/* Mobile Offcanvas — header ke BAHAR, body level pe */}
      <AnimatePresence>
        {isOffcanvasOpen && (
          <div className="fixed inset-0 z-[500000]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOffcanvasOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(4px)' }}
            />
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '360px', background: '#0D0D0D', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            >
              {/* Logo + Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <Link to="/" onClick={() => setIsOffcanvasOpen(false)}>
                  <img src={logo} alt="KwikCabs Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
                </Link>
                <button
                  onClick={() => setIsOffcanvasOpen(false)}
                  style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Nav Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => setIsOffcanvasOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: '12px',
                      color: isActive(link.path) ? '#FFD60A' : 'rgba(255,255,255,0.7)',
                      fontSize: '15px', fontWeight: '500', textDecoration: 'none',
                      background: isActive(link.path) ? 'rgba(255,214,10,0.08)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  to="/notifications"
                  onClick={() => setIsOffcanvasOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '12px',
                    color: 'rgba(255,255,255,0.7)', fontSize: '15px',
                    fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s'
                  }}
                >
                  <FaBell size={14} style={{ color: '#FFD60A' }} /> Notifications
                </Link>
              </nav>

              {/* Footer Info */}
              <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                    <FaEnvelope style={{ color: '#FFD60A', flexShrink: 0 }} /> basantktv@gmail.com
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                    <FaPhoneAlt style={{ color: '#FFD60A', flexShrink: 0 }} /> +91 7310221010
                  </div>

                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                    <a key={i} href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
