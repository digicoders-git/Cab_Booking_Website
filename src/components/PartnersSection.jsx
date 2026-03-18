import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const partners = [
  { id: 1, name: 'Partner 1', logo: '/partener1.png' },
  { id: 2, name: 'Partner 2', logo: '/partener2.png' },
  { id: 3, name: 'Partner 3', logo: '/partener3.png' },
  { id: 4, name: 'Partner 4', logo: '/partener4.png' },
  { id: 5, name: 'Partner 1', logo: '/partener1.png' },
  { id: 6, name: 'Partner 2', logo: '/partener2.png' },
  { id: 7, name: 'Partner 3', logo: '/partener3.png' },
  { id: 8, name: 'Partner 4', logo: '/partener4.png' },
];

const PartnersSection = () => {
  return (
    <div className="bg-[#0A0A0A] border-y border-white/8 py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-white/20 text-xs font-bold uppercase tracking-widest">Trusted by leading companies</p>
      </div>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={60}
        slidesPerView={2}
        loop={true}
        speed={4000}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="partners-swiper"
      >
        {partners.map((partner, index) => (
          <SwiperSlide key={`${partner.id}-${index}`}>
            <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 opacity-30 hover:opacity-70 transition-all duration-500 cursor-pointer invert">
              <img src={partner.logo} alt={partner.name} className="max-h-full object-contain" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>{`.partners-swiper .swiper-wrapper { transition-timing-function: linear !important; }`}</style>
    </div>
  );
};

export default PartnersSection;
