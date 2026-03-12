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
    <div className="bg-white py-12 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={2}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
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
              <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer opacity-60 hover:opacity-100 h-20">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx="true">{`
        .partners-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
};

export default PartnersSection;
