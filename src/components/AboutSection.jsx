import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const points = [
  'Professional, background-verified drivers',
  'Real-time GPS tracking on every ride',
  'Transparent pricing, no surge surprises',
];

const AboutSection = () => {
  return (
    <section className="section-padding bg-[#0D0D0D] overflow-hidden">
      <div className="container mx-auto 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow blob */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] scale-75" />

            {/* Stats badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -top-6 -right-2 sm:-right-4 lg:-right-8 bg-primary text-black rounded-2xl px-4 py-3 sm:px-5 sm:py-4 z-20 shadow-2xl shadow-primary/30"
            >
              <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>30+</div>
              <div className="text-xs font-bold opacity-70 uppercase tracking-wider">Years of Trust</div>
            </motion.div>

            <div className="relative z-10 bg-[#111111] border border-white/10 rounded-3xl overflow-hidden">
              <img
                src="/cab1.png"
                alt="Taxi Cab"
                className="w-full object-contain p-8 hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Bottom stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -left-2 sm:-left-4 lg:-left-8 bg-[#111111] border border-white/10 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 z-20"
            >
              <div className="text-primary text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>50K+</div>
              <div className="text-white/50 text-xs font-medium">Happy Riders</div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> About Us
            </span>
            <h2 className="section-title mb-6">
              Trusted Cab Service<br />
              <span className="gradient-text">Across The World</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-8 text-base">
              KwikCabs  connects you with professional drivers for safe, reliable rides. Whether it's a quick city trip or a long-distance journey, we deliver comfort and punctuality every time.
            </p>

            <ul className="space-y-4 mb-10">
              {points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <FaCheckCircle className="text-primary text-lg shrink-0" />
                  <span className="text-white/70 font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
