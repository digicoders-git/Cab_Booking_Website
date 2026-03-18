import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import {
  FaTaxi, FaEnvelope, FaPhoneAlt, FaClock,
  FaSignInAlt, FaUser, FaFacebookF, FaTwitter,
  FaInstagram, FaLinkedinIn, FaSearch, FaChevronDown,
  FaBars, FaTimes, FaBell, FaCheckCircle,
  FaMapMarkerAlt, FaCalendarAlt, FaCar, FaHashtag,
  FaUsers, FaCouch, FaSyncAlt, FaCalculator, FaFileInvoiceDollar,
  FaCreditCard, FaClipboardCheck, FaListAlt, FaInfoCircle, FaUserCircle,
  FaExclamationCircle, FaGift, FaRoute, FaThumbsUp
} from 'react-icons/fa';

const navLinks = [
  { name: 'Home', path: '/', hasDropdown: false },
  { name: 'About', path: '/about', hasDropdown: false },
  { name: 'Fleet', path: '/fleet', hasDropdown: false },
  {
    name: 'Services',
    path: '/services',
    hasDropdown: true,
    subItems: [
      { name: 'Select Ride Type', path: '/services/ride-type', icon: <FaUsers className="text-primary" /> },
      { name: 'Seat Selection', path: '/services/seat-selection', icon: <FaCouch className="text-primary" /> },
      { name: 'Auto Matching', path: '/services/auto-matching', icon: <FaSyncAlt className="text-primary" /> },
      { name: 'Fare Calculation', path: '/services/fare-calculation', icon: <FaCalculator className="text-primary" /> },
      { name: 'Booking Summary', path: '/services/booking-summary', icon: <FaFileInvoiceDollar className="text-primary" /> },
    ]
  },
  {
    name: 'Pages',
    path: '#',
    hasDropdown: true,
    subItems: [
      { name: 'Advanced Payment', path: '/advanced-payment', icon: <FaCreditCard className="text-primary" /> },
      { name: 'Booking Confirmation', path: '/booking-confirmation', icon: <FaClipboardCheck className="text-primary" /> },
      { name: 'My Booking', path: '/my-booking', icon: <FaListAlt className="text-primary" /> },
      { name: 'Booking Details', path: '/booking-details', icon: <FaInfoCircle className="text-primary" /> },
      { name: 'User Profile', path: '/profile', icon: <FaUserCircle className="text-primary" /> },
      { name: 'Driver Tracking', path: '/driver-tracking', icon: <FaMapMarkerAlt className="text-primary" /> },
    ]
  },
  { name: 'Contact', path: '/contact', hasDropdown: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Booking Confirmed', time: '2m ago', icon: <FaCheckCircle className="text-green-400" />, text: 'Your ride TX-992188 for today at 4:30 PM has been confirmed.', read: false },
    { id: 2, title: 'Driver Assigned', time: '5m ago', icon: <FaTaxi className="text-primary" />, text: 'Ravi Kumar (Toyota Camry • DL 01 AB 1234) is your driver. ETA: 8 mins.', read: false },
    { id: 3, title: '🎁 Promo Unlocked', time: '1h ago', icon: <FaGift className="text-purple-400" />, text: 'Use KWIBCABS20 for 20% off on your next airport ride.', read: false },
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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '#') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
      <div className="container mx-auto 2xl:max-w-[1400px] px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 lg:py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 z-50 shrink-0">
          <img src={logo} alt="KwibCabs Logo" className="h-20 w-auto object-contain" />
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
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <FaSearch size={16} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifyOpen(!isNotifyOpen)}
              className="relative w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <FaBell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]"
                >
                  <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h4 className="text-white font-bold text-sm">Notifications</h4>
                    <button onClick={markAllAsRead} className="text-primary text-xs font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex gap-3 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors ${n.read ? 'opacity-50' : ''}`}
                      >
                        <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-sm">{n.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-white text-xs font-bold">{n.title}</span>
                            <span className="text-white/30 text-[10px] ml-2 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-white/50 text-xs mt-0.5 leading-relaxed line-clamp-2">{n.text}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }} className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/booking" className="hidden sm:flex btn-primary text-xs py-2.5 px-5 rounded-full shadow-lg shadow-primary/20">
            Book Now
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[200] flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <FaTimes />
            </button>
            <div className="w-full max-w-2xl">
              <h3 className="text-white text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
                Where to?
              </h3>
              <p className="text-white/40 text-center mb-8 text-sm">Search for your next ride</p>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  <input type="text" placeholder="Pickup location" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-5 text-white text-lg outline-none focus:border-primary transition-all placeholder:text-white/20" />
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
                  <input type="text" placeholder="Drop-off location" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-5 text-white text-lg outline-none focus:border-white/40 transition-all placeholder:text-white/20" />
                </div>
                <button className="w-full bg-primary text-black font-bold py-5 rounded-2xl text-base hover:bg-accent transition-all">
                  Find Available Rides
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Offcanvas */}
      <AnimatePresence>
        {isOffcanvasOpen && (
          <div className="fixed inset-0 z-[1100]">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOffcanvasOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-white/10 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <Link to="/" className="flex items-center gap-2.5">
                  <img src={logo} alt="KwibCabs Logo" className="h-16 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setIsOffcanvasOpen(false)}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>



              <nav className="space-y-1">
                {navLinks.map((link, idx) => (
                  <div key={idx}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                    >
                      {link.name}
                      {link.hasDropdown && <FaChevronDown size={10} className="text-white/30" />}
                    </Link>
                    {link.hasDropdown && (
                      <div className="pl-4 space-y-1 mb-2">
                        {link.subItems.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            onClick={() => setIsOffcanvasOpen(false)}
                            className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-white/40 hover:text-white/70 text-xs transition-colors"
                          >
                            <span className="text-primary">{sub.icon}</span>
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="space-y-3 text-sm text-white/40">
                  <div className="flex items-center gap-3"><FaEnvelope className="text-primary" /> info@example.com</div>
                  <div className="flex items-center gap-3"><FaPhoneAlt className="text-primary" /> +2 123 654 7898</div>
                </div>
                <div className="flex gap-3 mt-6">
                  {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                    <a key={i} href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all">
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
