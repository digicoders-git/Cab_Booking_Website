import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUser, FaSnowflake, FaSpinner, FaBolt, FaCheckCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const fallbackCars = [
  { _id: '1', name: 'Mini', seatCapacity: 4, privateRatePerKm: 12, sharedRatePerSeatPerKm: 4, baseFare: 30, avgSpeedKmH: 25, image: null },
  { _id: '2', name: 'Sedan', seatCapacity: 4, privateRatePerKm: 15, sharedRatePerSeatPerKm: 5.5, baseFare: 50, avgSpeedKmH: 30, image: null },
  { _id: '3', name: 'SUV', seatCapacity: 6, privateRatePerKm: 22, sharedRatePerSeatPerKm: 8, baseFare: 80, avgSpeedKmH: 28, image: null },
];

const CarFleet = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/car-categories/active`);
        const data = await res.json();
        if (data.success && data.categories?.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(fallbackCars);
        }
      } catch {
        setCategories(fallbackCars);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const backendUrl = API_BASE_URL.replace('/api', '');

  return (
    <section className="section-padding bg-[#0D0D0D]">
      <div className="container mx-auto 2xl:max-w-[1400px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> Our Fleet
            </span>
            <h2 className="section-title">Pick Your Ride</h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs leading-relaxed">
            Choose from our premium fleet — economy to luxury, every ride is comfortable.
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-4">
            <FaSpinner className="text-primary text-3xl animate-spin" />
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Loading Fleet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-[#111111] border border-white/5 hover:border-primary/50 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Top Glow on Hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Area */}
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex justify-center items-center h-[220px] overflow-hidden">
                  {/* BG Glow */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <img
                    src={car.image ? `${backendUrl}/uploads/${car.image}` : '/cab2.png'}
                    alt={car.name}
                    className="w-full h-full object-contain p-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10"
                    onError={e => { e.target.src = '/cab2.png'; }}
                  />

                  {/* Speed Badge */}
                  {car.avgSpeedKmH && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      <FaBolt className="text-primary text-[8px]" /> {car.avgSpeedKmH} km/h
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                    {car.name}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                {/* Content */}
                <div className="p-6 space-y-5">

                  {/* Name + Price */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-black text-xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {car.name}
                      </h3>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                        Base Fare: ₹{car.baseFare}
                      </p>
                    </div>
                    <div className="text-right bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2">
                      <div className="text-primary font-black text-2xl leading-none">₹{car.privateRatePerKm}</div>
                      <div className="text-primary/50 text-[9px] font-bold uppercase tracking-wider mt-0.5">per km</div>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: FaUser, label: `${car.seatCapacity} Seats` },
                      { icon: FaSnowflake, label: 'AC' },
                      { icon: FaCheckCircle, label: 'GPS Tracked' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/5 rounded-xl px-3 py-2 text-white/50 text-[10px] font-bold">
                        <f.icon className="text-primary text-[9px]" />
                        {f.label}
                      </div>
                    ))}
                  </div>

                  {/* Shared Rate Row */}
                  {car.sharedRatePerSeatPerKm && (
                    <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3">
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Shared / Seat</span>
                      <span className="text-primary font-black text-sm">₹{car.sharedRatePerSeatPerKm}<span className="text-primary/40 text-[9px] font-bold">/km</span></span>
                    </div>
                  )}

                  {/* Book Button */}
                  <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-primary text-black font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 group-hover:shadow-primary/40 active:scale-95"
                  >
                    Book Now <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarFleet;
