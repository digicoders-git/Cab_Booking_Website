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
  { name: 'My Rides', path: '/my-booking', hasDropdown: false },
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

  const location = useLocation();

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
            className="relative w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
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
                  <img src={logo} alt="KwikCabs  Logo" className="h-16 w-auto object-contain" />
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
                    <Link
                      to="/notifications"
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="flex items-center gap-4 py-3.5 px-4 rounded-xl text-primary bg-primary/5 border border-primary/10 text-sm font-black italic tracking-widest uppercase transition-all"
                    >
                      <FaBell size={14} /> Notifications
                    </Link>
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
