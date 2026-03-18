import { motion } from 'framer-motion';
import { FaTaxi, FaUsers, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const stats = [
  { id: 1, number: '500+', label: 'Available Taxis', icon: FaTaxi },
  { id: 2, number: '50K+', label: 'Happy Clients', icon: FaUsers },
  { id: 3, number: '700+', label: 'Expert Drivers', icon: FaUserTie },
  { id: 4, number: '1.8K+', label: 'Trips Completed', icon: FaCheckCircle },
];

const StatsSection = () => {
  return (
    <section className="py-14 md:py-20 bg-[#0D0D0D] border-y border-white/8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl p-5 md:p-8 text-center transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 transition-colors">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.number}</div>
              <div className="text-white/40 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
