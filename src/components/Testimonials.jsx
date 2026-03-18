import { motion } from 'framer-motion';
import { testimonials } from '../data/mockData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <section className="section-padding bg-[#0A0A0A] overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag justify-center">
            <span className="w-4 h-px bg-primary" /> Testimonials
          </span>
          <h2 className="section-title">
            What Riders <span className="gradient-text">Say</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/20 !w-2 !h-2 !opacity-100',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !w-6 !rounded-full',
            }}
            className="pb-14"
          >
            {testimonials.concat(testimonials).map((test, index) => (
              <SwiperSlide key={`${test.id}-${index}`}>
                <div className="bg-[#111111] border border-white/8 hover:border-primary/30 rounded-3xl p-8 transition-all duration-300 h-full flex flex-col min-h-[280px] group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-primary text-xs" />
                      ))}
                    </div>
                    <FaQuoteLeft className="text-primary/20 text-3xl" />
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">
                    "{test.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <img
                      src={test.image}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div>
                      <div className="text-white font-bold text-sm">{test.name}</div>
                      <div className="text-white/40 text-xs">{test.role}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      <style>{`
        .swiper-pagination { position: relative !important; margin-top: 8px !important; }
      `}</style>
    </section>
  );
};

export default Testimonials;
