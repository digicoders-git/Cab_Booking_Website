import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTaxi, FaUserTie, FaMapMarkedAlt, FaTimes, FaPlay } from 'react-icons/fa';

const featuresData = [
  { id: 1, title: 'Best Quality Taxi', num: '01', icon: FaTaxi, desc: 'Premium vehicles maintained to the highest standards for your comfort and safety on every journey.' },
  { id: 2, title: 'Expert Drivers', num: '02', icon: FaUserTie, desc: 'Background-verified, professionally trained drivers who know the city routes inside out.' },
  { id: 3, title: 'Many Locations', num: '03', icon: FaMapMarkedAlt, desc: 'Serving hundreds of pickup and drop-off points across the city and beyond.' },
];

const QualityServiceSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative bg-[#0D0D0D] section-padding">
      <div className="container mx-auto px-4">

        {/* Video Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-20 shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200"
            alt="Video Thumbnail"
            className="w-full h-[280px] md:h-[380px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <motion.button
              onClick={() => setIsVideoOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 cursor-pointer"
            >
              <FaPlay className="text-black text-xl ml-1" />
              <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10"
              >
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black hover:bg-white transition-colors"
                >
                  <FaTimes />
                </button>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ckHzmP1evNU?autoplay=1"
                  title="Taxi Service Promo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> Why Choose Us
            </span>
            <h2 className="section-title mb-6">
              Dedicated To<br /><span className="gradient-text">Quality Service</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              We combine technology with human expertise to deliver the most reliable cab experience in the city. Every ride is tracked, every driver is vetted.
            </p>
            <div className="relative">
              <img
                src="/cab2.png"
                alt="Taxi"
                className="w-full max-w-md object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </motion.div>

          <div className="space-y-4">
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group flex items-center gap-6 bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl p-6 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <feature.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </div>
                <span
                  className="hidden sm:block text-5xl font-black opacity-10 group-hover:opacity-30 transition-opacity"
                  style={{ WebkitTextStroke: '1px #FFD60A', color: 'transparent' }}
                >
                  {feature.num}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityServiceSection;
