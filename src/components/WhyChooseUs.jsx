import { motion } from 'framer-motion';
import { 
  FaTaxi, 
  FaUsers, 
  FaUserTie, 
  FaMapMarkedAlt,
  FaUserShield,
  FaBolt,
  FaHandHoldingUsd,
  FaHeadset
} from 'react-icons/fa';

const statsData = [
  { id: 1, num: '500', label: '+ Available Taxi', icon: FaTaxi },
  { id: 2, num: '900', label: '+ Happy Clients', icon: FaUsers },
  { id: 3, num: '700', label: '+ Our Drivers', icon: FaUserTie },
  { id: 4, num: '1800', label: '+ Road Trip Done', icon: FaMapMarkedAlt },
];

const featuresData = [
  { id: 1, title: 'Safety Guarantee', icon: FaUserShield },
  { id: 2, title: 'Fast Pickup', icon: FaBolt },
  { id: 3, title: 'Affordable Rate', icon: FaHandHoldingUsd },
  { id: 4, title: '24/7 Support', icon: FaHeadset },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full relative bg-[#111111]">
      
      {/* 1. OVERLAPPING STATS BANNER */}
      <div className="container mx-auto px-4 relative z-30 lg:-mt-16 -mt-10 mb-0">
        <div 
          className="rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
          style={{ background: '#1a1a1a' }}
        >
          {/* Subtle striped background pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 2px, transparent 2px, transparent 10px)' }}
          ></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10 divide-y sm:divide-y-0 lg:divide-x divide-white/5">
            {statsData.map((stat) => (
              <div key={stat.id} className="py-12 px-6 text-center group">
                <div className="w-[85px] h-[85px] rounded-full border-[3px] border-white p-1 mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <stat.icon className="text-[35px] text-[#111111]" />
                  </div>
                </div>
                <h3 className="text-[38px] font-extrabold text-white leading-none mb-3">{stat.num}</h3>
                <p className="text-gray-200 font-bold text-[13px] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. DARK FEATURES SECTION */}
      <div className="relative pt-24 pb-32 lg:pb-48">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549386345-42cfcefa9b61?auto=format&fit=crop&q=80&w=1920)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#111111]/90 to-[#111111]/80 z-0"></div>

        <div className="container relative z-10 mx-auto px-4">
          
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <span className="text-primary font-bold uppercase tracking-[0.25em] text-[13px] relative z-10">
              FEATURE
            </span>
            <h2 className="text-[38px] md:text-[46px] font-bold text-white leading-tight mt-2 mb-4">
              Our Awesome Feature
            </h2>
            
            {/* Custom Yellow Line Divider */}
            <div className="flex justify-center items-center gap-1">
              <div className="w-12 h-[3px] bg-primary"></div>
              <div className="w-10 h-2 rounded-full border-[2px] border-primary"></div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                // Added a staggering translate-y effect for 2nd and 4th cards on desktop
                className={`bg-white rounded-[20px] p-8 lg:p-10 text-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,193,7,0.15)] flex flex-col items-center
                  ${index % 2 !== 0 ? 'lg:translate-y-12' : ''}
                `}
              >
                {/* Yellow Icon Circle with Black border */}
                <div className="w-[95px] h-[95px] rounded-full border-[3px] border-[#111111] bg-primary flex items-center justify-center mb-8 relative">
                  <item.icon className="text-[45px] text-[#111111]" />
                </div>
                
                <h3 className="text-[22px] font-bold text-[#111111] mb-5">{item.title}</h3>
                <p className="text-gray-500 text-[15px] leading-[1.8] font-medium">
                  There are many variations of majority have suffered alteration in some form injected humour randomised words.
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
      
    </section>
  );
};

export default WhyChooseUs;
