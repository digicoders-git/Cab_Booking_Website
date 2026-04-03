import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="relative bg-[#0A0A0A] py-14 md:py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#111111] border border-white/10 rounded-3xl p-7 sm:p-12 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-tl-full" />

          <div className="relative z-10">
            <span className="section-tag justify-center mb-6">
              <span className="w-4 h-px bg-primary" /> Get Started Today
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Book Your Cab.<br />
              <span className="gradient-text">Simple & Affordable.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of happy KwibCabs riders. Download the app or book online in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary shadow-2xl shadow-primary/30 hover:scale-105 transition-transform text-sm font-bold">
                Book a Ride Now <FaArrowRight />
              </Link>
              <a href="tel:+7310221010" className="btn-secondary text-sm font-bold hover:scale-105 transition-transform">
                <FaPhoneAlt size={14} /> +91 7310221010
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
