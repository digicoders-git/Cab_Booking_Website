import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaSuitcase, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { io } from 'socket.io-client';

const PopularPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fixed-routes/routes/active`);
        const data = await response.json();
        if (data.success) {
          // Show only top 6 packages
          setPackages(data.routes.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
    
    // Listen for new fixed routes via WebSocket
    const socket = io(API_BASE_URL.replace('/api', ''));
    socket.on('newFixedRoute', (data) => {
      if (data && data.route && data.route.isActive) {
        setPackages(prev => {
          const updated = [data.route, ...prev];
          return updated.slice(0, 6); // Keep max 6 items
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  if (loading || packages.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-3 block"
          >
            Exclusive Rides
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Popular <span className="text-primary">Packages</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Book fixed route rides at unbeatable prices. Travel in comfort with our premium fleet and professional drivers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-[#111] rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/50 flex flex-col"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                  <FaCar />
                  <span>{pkg.carCategory?.name}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4 flex-grow">
                <div className="relative pl-6 pb-4 border-l-2 border-dashed border-white/20 ml-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-[#111]"></div>
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Pickup</p>
                  <h4 className="text-white font-medium text-lg leading-tight">{pkg.pickupLocation}</h4>
                </div>
                <div className="relative pl-6 ml-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-[#111]"></div>
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Drop</p>
                  <h4 className="text-white font-medium text-lg leading-tight">{pkg.dropLocation}</h4>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Fixed Fare</p>
                  <p className="text-3xl font-black text-white">₹{pkg.price}</p>
                </div>
                <button 
                  onClick={() => navigate('/offers')}
                  className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-primary/20"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/offers" 
            className="inline-flex items-center space-x-2 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black font-bold py-4 px-10 rounded-full transition-all duration-300 group"
          >
            <span>View All Packages</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
