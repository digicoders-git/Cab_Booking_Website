import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const driversData = [
  {
    id: 1,
    name: 'Alma Mcelroy',
    role: 'Expert Driver',
    // Using high quality unsplash images for diverse drivers matching the screenshot context
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Marie Hooks',
    role: 'Expert Driver',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Daniel Nesmith',
    role: 'Expert Driver',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    name: 'Gertrude Barrow',
    role: 'Expert Driver',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  }
];

const ExpertDrivers = () => {
  return (
    <section className="section-padding bg-[#fdfdfd] pt-24 pb-32">
      <div className="container mx-auto 2xl:max-w-[1400px]">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[13px]">
            DRIVERS
          </span>
          <h2 className="text-[38px] md:text-[46px] font-bold text-[#111111] mt-1 mb-4">
            Our Expert Drivers
          </h2>
          {/* Custom Yellow Line Divider */}
          <div className="flex justify-center items-center gap-1">
            <div className="w-12 h-[3px] bg-primary"></div>
            <div className="w-10 h-2 rounded-full border-[2px] border-primary"></div>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {driversData.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[40px] shadow-[0px_10px_30px_rgba(0,0,0,0.06)] overflow-hidden text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="p-5 pt-6 relative">
                {/* Yellow frame around the image */}
                <div className="rounded-[30px] border-2 border-primary p-2 group-hover:bg-primary/5 transition-colors duration-300">
                  <div className="rounded-[22px] overflow-hidden bg-gray-100 aspect-square">
                    <img 
                      src={driver.image} 
                      alt={driver.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-10 pt-2">
                <h3 className="text-[22px] font-bold text-[#111111] mb-1 group-hover:text-primary transition-colors">{driver.name}</h3>
                <p className="text-primary font-bold text-[14px] mb-6">{driver.role}</p>
                
                {/* Social Icons mapped dynamically */}
                <div className="flex justify-center items-center gap-3">
                  {[FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="w-[34px] h-[34px] rounded-full bg-primary flex items-center justify-center text-white hover:bg-[#111111] transition-colors duration-300 shadow-md"
                    >
                      <Icon className="text-[14px]" />
                    </a>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExpertDrivers;
