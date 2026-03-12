import { motion } from 'framer-motion';
import { FaTaxi, FaUsers, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const stats = [
  { id: 1, number: '500', label: 'Available Taxi', icon: <FaTaxi /> },
  { id: 2, number: '900', label: 'Happy Clients', icon: <FaUsers /> },
  { id: 3, number: '700', label: 'Our Drivers', icon: <FaUserTie /> },
  { id: 4, number: '1800', label: 'Road Trip Done', icon: <FaCheckCircle /> },
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[13px]">
            OUR STATS
          </span>
          <h2 className="text-[38px] md:text-[46px] font-bold text-[#111111] mt-1">
            Taxica In Numbers
          </h2>
        </div>

        {/* Stats Content */}
        <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
          {/* Background Overlay with Pattern */}
          <div className="absolute inset-0 bg-[#111111] z-0">
             {/* Diagonal Lines Pattern Overlay */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent)' , backgroundSize: '4px 4px' }}></div>
          </div>

          {/* Decorative Geometric Shapes (Triangles on the left) */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <div className="absolute -left-20 top-0 w-[400px] h-full bg-black skew-x-[-20deg]"></div>
             <div className="absolute -left-40 top-0 w-[400px] h-full bg-[#1a1a1a] skew-x-[-20deg]"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 px-8 md:px-16 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Icon Wrapper */}
                <div className="w-[100px] h-[100px] bg-primary rounded-full border-[6px] border-white flex items-center justify-center text-[40px] text-[#111111] mb-6 shadow-lg">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <div className="text-[42px] md:text-[50px] font-black text-white leading-none mb-3">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-white font-bold text-[16px] uppercase tracking-wide opacity-90">
                  + {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
