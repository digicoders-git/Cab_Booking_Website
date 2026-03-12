import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTaxi, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCaretRight, FaPaperPlane, FaArrowUp 
} from 'react-icons/fa';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white pt-0 overflow-hidden relative">
      
      {/* Top Checkerboard Decor */}
      <div className="w-full h-8 bg-primary">
         <div className="w-full h-full bg-[radial-gradient(#111111_20%,transparent_20%)] bg-[length:15px_15px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-0 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Logo & Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                 <FaTaxi className="text-[#111111] text-xl" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">taxica</span>
            </Link>
            <p className="text-gray-400 font-medium leading-[1.8] text-sm max-w-xs">
              We are many variations of passages available but the majority have suffered alteration in some form by injected humour words believable.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-[#111111] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                     <FaPhoneAlt size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-300">+2 123 654 7898</span>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-[#111111] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                     <FaMapMarkerAlt size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-300">25/B Milford Road, New York</span>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-[#111111] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                     <FaEnvelope size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-300">info@example.com</span>
               </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-2xl font-black mb-8 relative inline-block uppercase tracking-tighter">
               Quick Links
               <span className="absolute bottom-[-10px] left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Update News
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Testimonials
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Terms Of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/team" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Our Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Center */}
          <div className="lg:pl-4">
            <h3 className="text-2xl font-black mb-8 relative inline-block uppercase tracking-tighter">
               Support Center
               <span className="absolute bottom-[-10px] left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/faq" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> FAQ's
                </Link>
              </li>
              <li>
                <Link to="/booking" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Book A Ride
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold group">
                  <FaCaretRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-black mb-8 relative inline-block uppercase tracking-tighter">
               Newsletter
               <span className="absolute bottom-[-10px] left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed">
               Subscribe Our Newsletter To Get Latest Update And News
            </p>
            <div className="space-y-4">
               <input 
                 type="email" 
                 placeholder="Your Email"
                 className="w-full bg-white text-[#111111] py-4 px-6 rounded-2xl outline-none font-bold placeholder:text-gray-400" 
               />
               <button className="w-full bg-primary text-[#111111] font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-primary/20">
                  SUBSCRIBE NOW <FaPaperPlane size={14}/>
               </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="relative mt-20 -mx-4 lg:-mx-8">
           <div className="flex flex-col lg:flex-row h-auto lg:h-[100px] items-center">
              
              {/* Left Side (Dark) */}
              <div className="w-full lg:w-[55%] bg-[#1a1a1a] h-full flex items-center justify-center lg:justify-start lg:pl-12 py-6 lg:py-0 relative">
                 <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                    © Copyright {new Date().getFullYear()} <span className="text-primary">Taxica</span> All Rights Reserved.
                 </p>
                 {/* The Slant Overlay */}
                 <div className="hidden lg:block absolute top-0 right-[-50px] w-[100px] h-full bg-[#1a1a1a] skew-x-[-25deg] z-10"></div>
              </div>

              {/* Right Side (Yellow) */}
              <div className="w-full lg:w-[45%] bg-primary h-full flex items-center justify-center lg:justify-between px-8 lg:px-16 py-6 lg:py-0 relative z-0">
                 <div className="flex items-center gap-4">
                    <a href="#" className="w-11 h-11 bg-[#111111] text-primary rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"><FaFacebookF /></a>
                    <a href="#" className="w-11 h-11 bg-[#111111] text-primary rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"><FaTwitter /></a>
                    <a href="#" className="w-11 h-11 bg-[#111111] text-primary rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"><FaLinkedinIn /></a>
                    <a href="#" className="w-11 h-11 bg-[#111111] text-primary rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"><FaYoutube /></a>
                 </div>

                 {/* Floating Back to Top Button */}
                 <AnimatePresence>
                   {showScroll && (
                     <motion.button 
                       initial={{ opacity: 0, y: 20, scale: 0.5 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 20, scale: 0.5 }}
                       onClick={scrollToTop}
                       className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-[#111111] rounded-2xl flex items-center justify-center transition-all shadow-[0_10px_30px_rgba(255,193,7,0.3)] z-[999] hover:bg-[#111111] hover:text-primary active:scale-90"
                     >
                        <FaArrowUp size={20} className="animate-bounce" />
                     </motion.button>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
