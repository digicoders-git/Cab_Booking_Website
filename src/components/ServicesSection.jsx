import { motion } from 'framer-motion';
import { services } from '../data/mockData';
import { FaPlane, FaCity, FaBriefcase, FaCar, FaClock, FaMapSigns, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const iconMap = {
  FaPlane: FaPlane,
  FaCity: FaCity,
  FaBriefcase: FaBriefcase,
  FaCar: FaCar,
  FaClock: FaClock,
  FaMapSigns: FaMapSigns,
};

const ServicesSection = () => {
  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 gap-4"
        >
          <div>
            <span className="section-tag mx-auto">
              <span className="w-4 h-px bg-primary" /> What We Offer <span className="w-4 h-px bg-primary" />
            </span>
            <h2 className="section-title text-3xl md:text-5xl mb-4 gradient-text">Our Services</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto mb-6">
              Experience the best-in-class cab services tailored for your comfort and safety.
            </p>
          </div>
          <Link to="/services" className="flex items-center gap-2 text-primary text-sm font-black hover:gap-3 transition-all bg-primary/5 px-6 py-2 rounded-full border border-primary/20">
            View all services <FaArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl p-8 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 transition-colors mx-auto">
                    {Icon && <Icon className="text-primary text-2xl" />}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{service.desc}</p>
                  <div className="flex items-center gap-2 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <FaArrowRight size={10} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
