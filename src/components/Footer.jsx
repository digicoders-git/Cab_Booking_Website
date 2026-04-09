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
          <div className="space-y-6">
            <Link to="/" className="flex items-center ">
              <img src={logo} alt="KwikCabs  Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Fast, safe, and reliable cab service available 24/7. Your comfort is our priority — KwikCabs .
            </p>
            <div className="space-y-3">
              {[
                { icon: FaPhoneAlt, text: '+91 7310221010', href: 'tel:+917310221010' },
                { icon: FaPhoneAlt, text: '+91 7310231010', href: 'tel:+917310231010' },
                { icon: FaMapMarkerAlt, text: '25/B Milford Road, New York', href: null },
                { icon: FaEnvelope, text: 'basantktv@gmail.com', href: 'mailto:basantktv@gmail.com' },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3 text-white/50 text-sm hover:text-white/80 transition-colors">
                  <Icon className="text-primary text-xs shrink-0" />
                  {href ? <a href={href}>{text}</a> : text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/fleet', label: 'Our Fleet' },
                { to: '/services', label: 'Services' },
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
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Support</h3>
            <ul className="space-y-3">
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
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Newsletter</h3>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              Get the latest updates, offers and news delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 text-white py-3.5 px-5 rounded-2xl outline-none focus:border-primary transition-all text-sm placeholder:text-white/30"
              />
              <button className="w-full bg-primary text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-accent transition-all text-sm">
                Subscribe <FaPaperPlane size={12} />
              </button>
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
            className="fixed bottom-20 right-8 w-12 h-12 bg-primary text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 z-[999] hover:bg-accent hover:scale-110 transition-all"
          >
            <FaArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
