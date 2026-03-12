import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920',
    title: 'Reliable',
    highlight: 'Taxi Service',
    titleEnd: 'in Your City',
    subtitle: 'Experience the best, fast, and secure ride with our professional drivers. Available 24/7 to get you where you need to be.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920',
    title: 'Professional &',
    highlight: 'Expert Drivers',
    titleEnd: 'For You',
    subtitle: 'Our drivers are well-trained and knowledgeable about the city routes to ensure you reach your destination safely and on time.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512850692650-fb0bb15ea3e9?auto=format&fit=crop&q=80&w=1920',
    title: 'Book Your Ride',
    highlight: 'Anytime',
    titleEnd: 'Anywhere',
    subtitle: 'Whether it is an airport transfer or a quick city trip, we offer affordable pricing with no hidden charges. Book now!',
  }
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-[90vh] min-h-[600px] lg:min-h-[700px] flex items-center pt-0">
      <style>{`

        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #ffffff;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #FFC107;
          opacity: 1;
          width: 30px;
          border-radius: 5px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 40px !important;
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full absolute inset-0 z-0 hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/65"></div>
            </div>
            
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-3xl text-white pt-20">
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      key={`content-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                        {slide.title} <span className="text-primary">{slide.highlight}</span> {slide.titleEnd}
                      </h1>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 mb-10 border-l-4 border-primary pl-5 py-2 font-medium max-w-2xl"
                      >
                        {slide.subtitle}
                      </motion.p>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5"
                      >
                        <Link to="/booking" className="bg-primary text-[#111111] font-extrabold uppercase text-[13px] px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 flex items-center justify-center tracking-wide">
                          Book a Ride
                        </Link>
                        <Link to="/about" className="bg-transparent border-2 border-white text-white font-extrabold uppercase text-[13px] px-8 py-4 rounded-full hover:bg-white hover:text-[#111111] transition-colors duration-300 flex items-center justify-center tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          Learn More
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
    </section>
  );
};

export default HeroSection;
