import { motion } from 'framer-motion';
import { services } from '../data/mockData';
import { FaPlane, FaCity, FaBriefcase, FaCar, FaClock, FaMapSigns } from 'react-icons/fa';

const iconMap = {
  FaPlane: <FaPlane className="text-4xl text-primary" />,
  FaCity: <FaCity className="text-4xl text-primary" />,
  FaBriefcase: <FaBriefcase className="text-4xl text-primary" />,
  FaCar: <FaCar className="text-4xl text-primary" />,
  FaClock: <FaClock className="text-4xl text-primary" />,
  FaMapSigns: <FaMapSigns className="text-4xl text-primary" />
};

const ServicesSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-wider">What We Offer</span>
          <h2 className="text-4xl font-bold mt-2">Our Taxi Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {iconMap[service.icon]}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.desc}
              </p>
              <a href="#" className="font-semibold text-secondary hover:text-primary transition-colors inline-flex items-center gap-2">
                Read More <span>&rarr;</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
