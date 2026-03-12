import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTaxi, FaEnvelope, FaPhoneAlt, FaClock, 
  FaSignInAlt, FaUser, FaFacebookF, FaTwitter, 
  FaInstagram, FaLinkedinIn, FaSearch, FaChevronDown, 
  FaBars, FaTimes, FaBell, FaCalendarCheck, FaTag, FaCheckCircle,
  FaMapMarkerAlt, FaCalendarAlt, FaCar, FaHashtag,
  FaUsers, FaCouch, FaSyncAlt, FaCalculator, FaFileInvoiceDollar,
  FaQuestionCircle, FaStar, FaIdCard, FaLayerGroup,
  FaCreditCard, FaClipboardCheck, FaListAlt, FaInfoCircle, FaUserCircle,
  FaExclamationCircle, FaGift, FaRoute, FaThumbsUp
} from 'react-icons/fa';

const navLinks = [
  { name: 'Home', path: '/', hasDropdown: false },
  { name: 'About', path: '/about', hasDropdown: false },
  { name: 'Taxi', path: '/fleet', hasDropdown: false },
  { 
    name: 'Service', 
    path: '/services', 
    hasDropdown: true,
    subItems: [
      { name: 'Select Ride Type (Private / Shared)', path: '/services/ride-type', icon: <FaUsers className="text-primary" /> },
      { name: 'Seat Selection For Shared Cab', path: '/services/seat-selection', icon: <FaCouch className="text-primary" /> },
      { name: 'Shared Ride Auto Matching System', path: '/services/auto-matching', icon: <FaSyncAlt className="text-primary" /> },
      { name: 'Fare Calculation (Per Seat / Full)', path: '/services/fare-calculation', icon: <FaCalculator className="text-primary" /> },
      { name: 'Booking Summary', path: '/services/booking-summary', icon: <FaFileInvoiceDollar className="text-primary" /> },
    ]
  },
  { 
    name: 'Pages', 
    path: '#', 
    hasDropdown: true,
    subItems: [
      // { name: 'Pricing Plans', path: '/pricing', icon: <FaLayerGroup className="text-primary" /> },
      { name: 'Advanced Payment', path: '/advanced-payment', icon: <FaCreditCard className="text-primary" /> },
      { name: 'Booking Confirmation', path: '/booking-confirmation', icon: <FaClipboardCheck className="text-primary" /> },
      { name: 'My Booking', path: '/my-booking', icon: <FaListAlt className="text-primary" /> },
      { name: 'Booking Details', path: '/booking-details', icon: <FaInfoCircle className="text-primary" /> },
      { name: 'User Profile', path: '/profile', icon: <FaUserCircle className="text-primary" /> },
      { name: 'Driver Tracking', path: '/driver-tracking', icon: <FaMapMarkerAlt className="text-primary" /> },
      // { name: 'Expert Drivers', path: '/team', icon: <FaIdCard className="text-primary" /> },
      // { name: 'Customer Reviews', path: '/testimonials', icon: <FaStar className="text-primary" /> },
      // { name: 'FAQ Support', path: '/faq', icon: <FaQuestionCircle className="text-primary" /> },
    ]
  },
  { name: 'Contact', path: '/contact', hasDropdown: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAllNotifyOpen, setIsAllNotifyOpen] = useState(false);
  const location = useLocation();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Booking Confirmed',
      time: '2m ago',
      icon: <FaCheckCircle className="text-green-500" />,
      text: 'Your ride TX-992188 for today at 4:30 PM has been confirmed successfully.',
      read: false,
      type: 'success',
    },
    {
      id: 2,
      title: 'Driver Assigned',
      time: '5m ago',
      icon: <FaTaxi className="text-primary" />,
      text: 'Ravi Kumar (Toyota Camry • DL 01 AB 1234) is your driver. ETA: 8 mins.',
      read: false,
      type: 'info',
    },
    {
      id: 3,
      title: '🎁 Promo Code Unlocked',
      time: '1h ago',
      icon: <FaGift className="text-purple-500" />,
      text: 'Use TAXICA20 to get 20% off on your next airport ride. Valid till 31 March.',
      read: false,
      type: 'promo',
    },
    {
      id: 4,
      title: 'Ride Completed',
      time: '3h ago',
      icon: <FaRoute className="text-blue-500" />,
      text: 'Your ride TX-992105 was completed. Total fare: ₹248. Rate your experience!',
      read: false,
      type: 'completed',
    },
    {
      id: 5,
      title: 'Safety Alert',
      time: '1d ago',
      icon: <FaExclamationCircle className="text-orange-400" />,
      text: 'Share your live location with a trusted contact for your upcoming ride.',
      read: true,
      type: 'warning',
    },
    {
      id: 6,
      title: 'Review Request',
      time: '2d ago',
      icon: <FaThumbsUp className="text-yellow-500" />,
      text: 'How was your ride with Ankit Sharma? Tap to rate and help us improve.',
      read: true,
      type: 'review',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '#') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed w-full top-0 z-50 flex flex-col font-sans transition-all duration-300 shadow-md">
      
      {/* Top Bar Wrapper */}
      <div className={`w-full bg-primary relative transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-auto'}`}>
         {/* The dark inner bar */}
         <div className="bg-[#111111] text-white">
            <div className="container mx-auto 2xl:max-w-[1400px]">
               <div className="flex justify-between items-center text-[13.5px] font-medium py-[10px] px-4 sm:px-8 relative">
                  
                  {/* Yellow corner overlays (simulating the curves) */}
                  <div className="absolute top-0 left-0 w-8 md:w-16 h-full bg-primary rounded-br-[40px] z-10 hidden sm:block"></div>
                  <div className="absolute top-0 right-0 w-8 md:w-16 h-full bg-primary rounded-bl-[40px] z-10 hidden sm:block"></div>

                  {/* Left Side Info */}
                  <div className="flex items-center space-x-5 lg:space-x-8 relative z-20 pl-0 sm:pl-12">
                    <div className="flex items-center gap-2">
                       <FaEnvelope className="text-primary text-[15px]" />
                       <a href="mailto:info@example.com" className="hover:text-primary transition-colors">info@example.com</a>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                       <FaPhoneAlt className="text-primary text-[15px]" />
                       <a href="tel:+21236547898" className="hover:text-primary transition-colors">+2 123 654 7898</a>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                       <FaClock className="text-primary text-[15px]" />
                       <span>Sun - Fri (08AM - 10PM)</span>
                    </div>
                  </div>

                  {/* Right Side Info */}
                  <div className="flex items-center space-x-4 sm:space-x-6 relative z-20 pr-0 sm:pr-12">
                    <div className="flex items-center gap-3 sm:gap-5 border-r border-[#333] pr-3 sm:pr-5">
                       <Link to="/login" className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors text-[12px] sm:text-[13.5px]">
                          <FaSignInAlt className="text-[12px] sm:text-[14px]" /> <span className="hidden xs:inline">Login</span>
                       </Link>
                       <Link to="/register" className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors text-[12px] sm:text-[13.5px]">
                          <FaUser className="text-[12px] sm:text-[14px]" /> <span className="hidden xs:inline">Register</span>
                       </Link>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="hidden lg:block text-[#aaaaaa]">Follow Us:</span>
                       <div className="flex items-center gap-3.5">
                          <a href="#" className="hover:text-primary transition-colors text-white"><FaFacebookF /></a>
                          <a href="#" className="hover:text-primary transition-colors text-white"><FaTwitter /></a>
                       </div>
                    </div>
                  </div>

               </div>
            </div>
         </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white w-full">
        <div className="container mx-auto 2xl:max-w-[1400px] px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 lg:py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 z-50 shrink-0">
            <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-primary rounded-full flex items-center justify-center relative">
               <FaTaxi className="text-[#111111] text-[20px] sm:text-[26px]" />
               <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                 <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#111111] rounded-full"></span>
                 <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#111111] rounded-full"></span>
                 <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#111111] rounded-full"></span>
               </div>
            </div>
            <span className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] lowercase tracking-tighter ml-1">
              taxica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center justify-center flex-1 mx-4 space-x-7 2xl:space-x-10 h-full">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group flex items-center h-full">
                <Link
                  to={link.path}
                  className={`flex items-center gap-1.5 font-bold text-[16px] transition-colors py-4 ${
                    isLinkActive(link.path)
                      ? 'text-primary'
                      : 'text-[#111111] hover:text-primary'
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <FaChevronDown className={`text-[11px] font-bold transition-transform group-hover:rotate-180 ${isLinkActive(link.path) ? 'text-primary' : 'text-[#111111]'}`} />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[320px] z-[1000]">
                    <div className="bg-white rounded-2xl shadow-2xl border-t-4 border-primary overflow-hidden">
                      <div className="py-4">
                        {link.subItems.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={sub.path}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group/item"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg group-hover/item:scale-110 transition-transform">
                              {sub.icon}
                            </div>
                            <span className="text-[#111111] font-bold text-[15px] group-hover/item:text-primary transition-colors">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-4 text-center">
                         <Link to="/services" className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111] hover:text-primary transition-colors flex items-center justify-center gap-2">
                           View All Services <FaSyncAlt className="text-[10px]" />
                         </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
            
            {/* Search Icon */}
            <button 
              className="flex items-center justify-center w-10 h-10 text-[#111111] hover:text-primary transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="text-[20px]" />
            </button>
            
            {/* Notification Icon */}
            <div className="relative">
              <button className="relative text-[#111111] hover:text-primary transition-colors text-xl" onClick={() => setIsNotifyOpen(!isNotifyOpen)}>
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

              {/* Notification Dropdown */}
              {isNotifyOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-[100] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-primary p-4 flex justify-between items-center">
                    <h4 className="font-bold text-[#111111]">Notifications</h4>
                    <span className="text-[11px] bg-[#111111] text-white px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer ${notif.read ? 'opacity-50' : ''}`} onClick={() => markAsRead(notif.id)}>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                            {notif.icon}
                          </div>
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="text-sm font-bold text-[#111111]">{notif.title}</h5>
                              <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-tight">
                              {notif.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="w-full py-3 text-center text-xs font-bold text-primary hover:text-[#111111] transition-colors border-t border-gray-50 bg-white"
                    onClick={() => { setIsNotifyOpen(false); setIsAllNotifyOpen(true); }}
                  >
                    VIEW ALL NOTIFICATIONS
                  </button>
                </div>
              )}
            </div>
            
            {/* Premium Hamburger / Menu Icon */}
            <button 
               className="group flex flex-col justify-center items-end gap-1.5 w-10 h-10 focus:outline-none transition-all duration-300 relative z-50" 
               onClick={() => setIsOffcanvasOpen(true)}
            >
               <span className="w-8 h-[3px] bg-[#111111] rounded-full group-hover:bg-primary transition-all duration-300 shadow-sm"></span>
               <span className="w-6 h-[3px] bg-[#111111] rounded-full group-hover:w-8 group-hover:bg-primary transition-all duration-300 shadow-sm"></span>
               <span className="w-8 h-[3px] bg-[#111111] rounded-full group-hover:bg-primary transition-all duration-300 shadow-sm"></span>
            </button>

          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-[#111111]/98 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300 backdrop-blur-sm">
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-primary transition-all hover:rotate-90 duration-300 text-3xl md:text-5xl"
            onClick={() => setIsSearchOpen(false)}
          >
            <FaTimes />
          </button>
          
          <div className="w-full max-w-5xl bg-white/5 p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-md">
            <h3 className="text-white text-3xl md:text-4xl font-extrabold mb-2 text-center">Search Your <span className="text-primary italic">Cab</span></h3>
            <p className="text-gray-400 text-center mb-10 text-base">Find the perfect ride for your journey</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Pickup */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaMapMarkerAlt /> Select Pickup
                </label>
                <input type="text" placeholder="Enter Pickup Location" className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg placeholder:text-white/20" />
              </div>

              {/* Drop */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaMapMarkerAlt /> Drop Location
                </label>
                <input type="text" placeholder="Enter Drop Location" className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg placeholder:text-white/20" />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaCalendarAlt /> Date
                </label>
                <input type="date" className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg" />
              </div>

              {/* Time */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaClock /> Time
                </label>
                <input type="time" className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg" />
              </div>

              {/* Car Type */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaCar /> Car Type
                </label>
                <select className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg appearance-none cursor-pointer">
                  <option className="bg-[#111]" value="">Choose Car Type</option>
                  <option className="bg-[#111]" value="economy">Economy Class</option>
                  <option className="bg-[#111]" value="business">Business Class</option>
                  <option className="bg-[#111]" value="luxury">Luxury Class</option>
                </select>
              </div>

              {/* Number of Cars */}
              <div className="flex flex-col gap-2">
                <label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaHashtag /> Number of Cars
                </label>
                <input type="number" min="1" placeholder="1" className="bg-transparent border-b border-white/20 py-3 text-white outline-none focus:border-primary transition-all text-lg placeholder:text-white/20" />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 lg:col-span-3 mt-4">
                <button type="submit" className="w-full bg-primary text-[#111111] font-extrabold py-5 rounded-2xl text-lg hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/20">
                  FIND AVAILABLE CAB NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Notifications Modal */}
      <AnimatePresence>
        {isAllNotifyOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#111111]/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white w-full max-w-4xl h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
               {/* Modal Header */}
               <div className="bg-primary p-8 md:p-10 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#111111] uppercase tracking-tighter">Notification Center</h2>
                    <p className="text-[#111111]/70 font-bold text-[10px] uppercase tracking-widest mt-1">You have {unreadCount} unread messages</p>
                  </div>
                   <div className="flex items-center gap-6">
                    <button 
                      onClick={markAllAsRead}
                      className="hidden md:block text-[10px] font-extrabold uppercase tracking-widest text-[#111111] hover:underline"
                    >
                      Mark all as read
                    </button>
                    <button 
                      onClick={() => setIsAllNotifyOpen(false)}
                      className="w-12 h-12 bg-[#111111] rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#111111] transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>
               </div>

               {/* Notifications List */}
               <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-20">
                      <FaBell className="text-5xl text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-extrabold text-sm uppercase tracking-widest">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const iconBg = {
                        success: 'bg-green-50',
                        info: 'bg-primary/10',
                        promo: 'bg-purple-50',
                        completed: 'bg-blue-50',
                        warning: 'bg-orange-50',
                        review: 'bg-yellow-50',
                      }[notif.type] || 'bg-gray-100';

                      return (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-5 md:p-7 rounded-3xl flex items-start justify-between gap-5 transition-all duration-300 border-2 active:scale-95 cursor-pointer group/notif ${
                            notif.read ? 'bg-gray-50 border-transparent opacity-60' : 'bg-white border-primary shadow-xl shadow-primary/10'
                          }`}
                        >
                          <div className="flex items-start gap-5 flex-1 min-w-0">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
                               {notif.icon}
                            </div>
                            <div className="min-w-0">
                               <h4 className={`text-sm font-extrabold uppercase tracking-tight ${notif.read ? 'text-gray-400' : 'text-[#111111]'}`}>
                                  {notif.title}
                               </h4>
                               <p className={`font-medium text-sm mt-1 leading-relaxed ${notif.read ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {notif.text}
                               </p>
                               <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mt-2 block">{notif.time}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {!notif.read && <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/20" />}
                            <button
                              onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                              className="w-8 h-8 rounded-xl opacity-0 group-hover/notif:opacity-100 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all text-xs"
                              title="Remove"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
               </div>

               {/* Modal Footer */}
               <div className="p-8 border-t border-gray-100 flex justify-center md:hidden">
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111] underline"
                  >
                    Mark all as read
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Off-canvas Sidebar (Info Section) */}
      <AnimatePresence>
        {isOffcanvasOpen && (
          <div className="fixed inset-0 z-[1100]">
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOffcanvasOpen(false)}
               className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm cursor-pointer"
             />
             
             {/* Content Sidebar */}
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col p-8 md:p-12 overflow-y-auto"
             >
                {/* Header Area */}
                <div className="flex justify-between items-center mb-16">
                   <Link to="/" className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                         <FaTaxi className="text-[#111111] text-xl" />
                      </div>
                      <span className="text-2xl font-extrabold text-[#111111] tracking-tighter">taxica</span>
                   </Link>
                   <button 
                     onClick={() => setIsOffcanvasOpen(false)}
                     className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center hover:bg-primary hover:text-[#111111] transition-all transform active:scale-90"
                   >
                     <FaTimes />
                   </button>
                </div>

                 {/* Navigation Section (For Mobile) */}
                 <div className="mb-14 xl:hidden">
                    <h3 className="text-lg font-extrabold text-[#111111] uppercase tracking-tighter mb-6 relative inline-block">
                       Navigation
                       <span className="absolute bottom-[-8px] left-0 w-10 h-1 bg-primary rounded-full"></span>
                    </h3>
                    
                    {/* Auth Quick Links for Mobile */}
                    <div className="flex gap-3 mb-6">
                       <Link to="/login" onClick={() => setIsOffcanvasOpen(false)} className="flex-1 bg-gray-100 text-[#111111] py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold text-[10px] uppercase transition-all hover:bg-primary">
                          <FaSignInAlt /> Login
                       </Link>
                       <Link to="/register" onClick={() => setIsOffcanvasOpen(false)} className="flex-1 bg-gray-100 text-[#111111] py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold text-[10px] uppercase transition-all hover:bg-primary">
                          <FaUser /> Register
                       </Link>
                    </div>

                    <div className="space-y-2">
                       {navLinks.map((link, idx) => (
                          <div key={idx} className="flex flex-col border-b border-gray-50 last:border-0 py-1">
                             <Link 
                                to={link.path} 
                                onClick={() => setIsOffcanvasOpen(false)}
                                className={`flex items-center justify-between py-3 text-[15px] font-extrabold uppercase tracking-tight transition-all hover:text-primary ${isLinkActive(link.path) ? 'text-primary' : 'text-[#111111]'}`}
                             >
                                {link.name}
                                {link.hasDropdown && <FaChevronDown size={10}/>}
                             </Link>
                             {link.hasDropdown && (
                                <div className="pl-4 pb-2 space-y-1">
                                   {link.subItems.map((sub, sIdx) => (
                                      <Link 
                                         key={sIdx} 
                                         to={sub.path}
                                         onClick={() => setIsOffcanvasOpen(false)}
                                         className="flex items-center gap-3 py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                                      >
                                         <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                         {sub.name}
                                      </Link>
                                   ))}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>

                {/* About Section */}
                <div className="mb-14">
                   <h3 className="text-lg font-extrabold text-[#111111] uppercase tracking-tighter mb-6 relative inline-block">
                      About Us
                      <span className="absolute bottom-[-8px] left-0 w-10 h-1 bg-primary rounded-full"></span>
                   </h3>
                   <p className="text-gray-500 font-medium leading-[1.8] text-sm">
                      Taxica is the leading provider of luxury transportation services. We pride ourselves on delivering punctual, safe, and professional rides for our clients globally. Experience the difference with our premium fleet and expert captains.
                   </p>
                </div>

                {/* Contact Info */}
                <div className="mb-14">
                   <h3 className="text-lg font-extrabold text-[#111111] uppercase tracking-tighter mb-8 relative inline-block">
                      Contact Info
                      <span className="absolute bottom-[-8px] left-0 w-10 h-1 bg-primary rounded-full"></span>
                   </h3>
                   <div className="space-y-8">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary shadow-inner">
                            <FaEnvelope />
                         </div>
                         <div>
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Email</span>
                            <span className="font-bold text-[#111111]">info@example.com</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary shadow-inner">
                            <FaPhoneAlt />
                         </div>
                         <div>
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Phone</span>
                            <span className="font-bold text-[#111111]">+1 234 567 8910</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary shadow-inner">
                            <FaMapMarkerAlt />
                         </div>
                         <div>
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Address</span>
                            <span className="font-bold text-[#111111]">25/B Milford Road, New York</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Social Links */}
                <div>
                   <h3 className="text-lg font-extrabold text-[#111111] uppercase tracking-tighter mb-8 relative inline-block">
                      Follow Us
                      <span className="absolute bottom-[-8px] left-0 w-10 h-1 bg-primary rounded-full"></span>
                   </h3>
                   <div className="flex gap-4">
                      <a href="#" className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300"><FaFacebookF /></a>
                      <a href="#" className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300"><FaTwitter /></a>
                      <a href="#" className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300"><FaInstagram /></a>
                      <a href="#" className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#111111] hover:bg-primary transition-all duration-300"><FaLinkedinIn /></a>
                   </div>
                </div>

                {/* Footer Logo Background Decal */}
                <div className="absolute bottom-[-50px] left-[-30px] opacity-[0.03] rotate-12 pointer-events-none">
                   <FaTaxi size={300} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;
