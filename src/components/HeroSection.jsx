import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FaArrowRight, FaStar, FaShieldAlt, FaClock } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920',
    tag: 'Fast & Reliable',
    title: 'Your Ride,',
    highlight: 'Your Rules.',
    subtitle: 'Book a cab in seconds. Professional drivers, transparent pricing, zero hassle.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920',
    tag: 'Premium Fleet',
    title: 'Ride in',
    highlight: 'Pure Comfort.',
    subtitle: 'From economy to luxury — choose the ride that fits your style and budget.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512850692650-fb0bb15ea3e9?auto=format&fit=crop&q=80&w=1920',
    tag: '24/7 Available',
    title: 'Anytime,',
    highlight: 'Anywhere.',
    subtitle: 'Airport transfers, city rides, outstation trips — we\'ve got you covered round the clock.',
  }
];

const badges = [
  { icon: FaStar, label: '4.9 Rating', sub: '50K+ reviews' },
  { icon: FaShieldAlt, label: 'Safe Rides', sub: 'Verified drivers' },
  { icon: FaClock, label: '3 min ETA', sub: 'Avg pickup time' },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="w-full h-full absolute inset-0 z-0 hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto h-full flex items-center">
              <div className="max-w-2xl pt-20 px-4 sm:px-0">
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      key={`slide-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        {slide.tag}
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4 md:mb-6 tracking-tight"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {slide.title}<br />
                        <span className="gradient-text">{slide.highlight}</span>
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="text-white/70 text-base md:text-xl mb-6 md:mb-10 leading-relaxed max-w-lg font-light"
                      >
                        {slide.subtitle}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <Link to="/booking" className="btn-primary text-sm font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                          Book a Ride <FaArrowRight />
                        </Link>
                        <Link to="/fleet" className="btn-secondary text-sm font-bold hover:scale-105 transition-transform">
                          Explore Fleet
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom badges */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-px bg-white/10 rounded-t-3xl overflow-hidden backdrop-blur-xl border border-white/10 border-b-0">
            {badges.map((badge, i) => (
              <div key={i} className="flex-1 flex items-center gap-3 px-5 sm:px-8 py-4 sm:py-5 bg-black/40 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <badge.icon size={18} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{badge.label}</div>
                  <div className="text-white/40 text-xs">{badge.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
