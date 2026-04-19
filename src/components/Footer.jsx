import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import {
  FaTaxi, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCaretRight, FaPaperPlane, FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const check = () => setShowScroll(window.pageYOffset > 400);
    window.addEventListener('scroll', check);
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <footer className="bg-[#080808] border-t border-white/8 text-white overflow-hidden relative">
      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-0 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-6">
            <Link to="/" className="flex items-center justify-center sm:justify-start">
              <img src={logo} alt="KwikCabs  Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Fast, safe, and reliable cab service available 24/7. Your comfort is our priority — KwikCabs .
            </p>
            <div className="space-y-3 flex flex-col items-center sm:items-start">
              {[
                { icon: FaPhoneAlt, text: '+91 7310221010', href: 'tel:+917310221010' },
                { icon: FaPhoneAlt, text: '+91 7310231010', href: 'tel:+917310231010' },
                { icon: FaMapMarkerAlt, text: '25/B Milford Road, New York', href: null },
                { icon: FaEnvelope, text: 'kwikcabs9@gmail.com ', href: 'mailto:kwikcabs9@gmail.com ' },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3 text-white/50 text-sm hover:text-white/80 transition-colors">
                  <Icon className="text-primary text-xs shrink-0" />
                  {href ? <a href={href}>{text}</a> : text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Quick Links</h3>
            <ul className="space-y-3 flex flex-col items-center sm:items-start">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/fleet', label: 'Our Fleet' },
                { to: '/services', label: 'Services' },
                { to: '/bulk-booking', label: 'Bulk Booking' },
                { to: '/my-bulk-bookings', label: 'My Bulk Rides' },
                { to: '/my-booking', label: 'My Rides' },
                { to: '/support', label: 'Support' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-sm group">
                    <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Support</h3>
            <ul className="space-y-3 flex flex-col items-center sm:items-start">
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-sm group">
                    <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-4 opacity-70" style={{ fontFamily: 'Syne, sans-serif' }}>Stay Updated</h3>
            <p className="text-white/40 text-[13px] mb-6 leading-relaxed max-w-[260px] mx-auto sm:mx-0">
              Get the latest updates and exclusive offers delivered to your inbox.
            </p>
            <div className="w-full max-w-[320px] sm:max-w-none group">
              <div className="relative flex items-center p-1.5 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary/40 transition-all duration-300">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-transparent text-white py-2.5 px-4 outline-none text-sm placeholder:text-white/20"
                />
                <button className="bg-primary hover:bg-white text-black font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shrink-0 shadow-xl shadow-primary/5">
                  Join <FaPaperPlane size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} <span className="text-primary">KwikCabs </span>. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Crafted with ❤️ by{' '}
            <a href="https://digicoders.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              #TeamDigiCoders
            </a>
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-4 sm:bottom-20 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 z-[999] hover:bg-accent hover:scale-110 transition-all"
          >
            <FaArrowUp size={14} className="sm:size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
