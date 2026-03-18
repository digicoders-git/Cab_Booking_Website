import { useState } from 'react';
import { motion } from 'framer-motion';
import { cars } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUser, FaSuitcase, FaSnowflake, FaMapMarkerAlt, FaUserTie, FaCarSide } from 'react-icons/fa';

const tabs = ['All', 'Economy', 'Standard', 'Luxury'];

const features = [
  { label: 'Passengers', icon: FaUser },
  { label: 'Luggage', icon: FaSuitcase },
  { label: 'AC', icon: FaSnowflake },
  { label: 'GPS', icon: FaMapMarkerAlt },
  { label: 'Pro Driver', icon: FaUserTie },
  { label: 'Doors', icon: FaCarSide },
];

const CarFleet = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? cars : cars.filter(c => c.category === activeTab);

  return (
    <section className="section-padding bg-[#0D0D0D]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> Our Fleet
            </span>
            <h2 className="section-title">Pick Your Ride</h2>
          </div>

          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 3).map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300"
            >
              {/* Image */}
              <div className="relative bg-[#1A1A1A] p-8 flex justify-center items-center min-h-[200px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/cab2.png"
                  alt={car.name}
                  className="w-4/5 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10"
                />
                <div className="absolute top-4 right-4 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  {car.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>{car.name}</h3>
                    <p className="text-white/40 text-xs mt-1">BMW M5 · 2024 Model</p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold text-xl">₹{car.price}</div>
                    <div className="text-white/30 text-xs">/km</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { icon: FaUser, val: `${car.capacity} seats` },
                    { icon: FaSuitcase, val: `${car.luggage} bags` },
                    { icon: FaSnowflake, val: 'AC' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-2">
                      <f.icon className="text-primary text-xs" />
                      <span className="text-white/60 text-xs">{f.val}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/booking"
                  className="w-full bg-primary text-black font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-accent transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  Book Now <FaArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarFleet;
