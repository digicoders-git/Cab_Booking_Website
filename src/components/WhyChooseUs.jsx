import { motion } from 'framer-motion';
import {
  FaTaxi, FaUsers, FaUserTie, FaMapMarkedAlt,
  FaUserShield, FaBolt, FaHandHoldingUsd, FaHeadset
} from 'react-icons/fa';

const stats = [
  { num: '500+', label: 'Available Taxis', icon: FaTaxi },
  { num: '50K+', label: 'Happy Clients', icon: FaUsers },
  { num: '700+', label: 'Expert Drivers', icon: FaUserTie },
  { num: '1.8K+', label: 'Trips Completed', icon: FaMapMarkedAlt },
];

const features = [
  { title: 'Safety First', desc: 'All drivers are background-verified and trained for your safety.', icon: FaUserShield },
  { title: 'Fast Pickup', desc: 'Average pickup time under 3 minutes in metro areas.', icon: FaBolt },
  { title: 'Best Rates', desc: 'Transparent pricing with no hidden charges or surge fees.', icon: FaHandHoldingUsd },
  { title: '24/7 Support', desc: 'Round-the-clock customer support for every ride.', icon: FaHeadset },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-[#0A0A0A]">
      {/* Stats Bar */}
      <div className="border-y border-white/8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8 divide-y lg:divide-y-0">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center py-8 lg:py-12 px-4 lg:px-6 text-center group hover:bg-white/3 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4 transition-colors">
                  <stat.icon size={22} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.num}</div>
                <div className="text-white/40 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="section-tag justify-center">
              <span className="w-4 h-px bg-primary" /> Why Choose Us
            </span>
            <h2 className="section-title">Built for the Modern<br /><span className="gradient-text">Commuter</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl p-8 text-center transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
