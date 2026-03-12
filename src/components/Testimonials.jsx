import { motion } from 'framer-motion';
import { testimonials } from '../data/mockData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920")' }}
      >
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[13px]">
            TESTIMONIALS
          </span>
          <h2 className="text-[38px] md:text-[46px] font-bold text-white mt-2 mb-4">
            What Our Client <span className="text-primary italic">Say's</span>
          </h2>
          {/* Custom Yellow Line Divider */}
          <div className="flex justify-center items-center gap-1">
            <div className="w-12 h-[3px] bg-primary"></div>
            <div className="w-10 h-2 rounded-full border-[2px] border-primary"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={25}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary !w-3 !h-3 !opacity-50',
              bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100 !w-6 !rounded-full transition-all'
            }}
            className="pb-16"
          >
            {testimonials.concat(testimonials).map((test, index) => (
              <SwiperSlide key={`${test.id}-${index}`}>
                <div className="bg-white p-8 rounded-[30px] text-left relative overflow-hidden group h-full flex flex-col min-h-[320px]">
                  
                  {/* Decorative Background Quote (99) */}
                  <div className="absolute bottom-4 right-6 text-[#FFC107] opacity-10 text-[80px] font-extrabold leading-none select-none pointer-events-none italic">
                    99
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-[70px] h-[70px] rounded-full border-[3px] border-primary p-1">
                      <img 
                        src={test.image} 
                        alt={test.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111] text-lg leading-tight">{test.name}</h4>
                      <p className="text-primary text-sm font-bold uppercase mt-1">Customer</p>
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-500 text-[15px] leading-relaxed font-medium mb-6 flex-1 relative z-10">
                    There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.
                  </p>

                  {/* Rating Section */}
                  <div className="flex gap-1 text-primary relative z-10 mt-auto">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-sm" />
                    ))}
                  </div>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
      
      {/* Custom Styles for Pagination */}
      <style jsx="true">{`
        .swiper-pagination {
          position: relative !important;
          margin-top: 20px !important;
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
