import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSyncAlt, FaUserCircle, FaMapMarkerAlt, FaCheckCircle, FaTaxi } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const AutoMatching = () => {
  const [matchingStatus, setMatchingStatus] = useState('searching');
  const [foundRiders, setFoundRiders] = useState([]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFoundRiders([{ id: 1, name: 'John D.', distance: '0.5 km away', rating: 4.8 }]);
    }, 2000);

    const timer2 = setTimeout(() => {
      setFoundRiders(prev => [...prev, { id: 2, name: 'Sarah M.', distance: '1.2 km away', rating: 4.9 }]);
      setMatchingStatus('matched');
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Auto Matching" subtitle="Real-time rider matching system" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Matching Area */}
          <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 text-center border border-gray-100">
             
             {/* Matching Animation Section */}
             <div className="relative h-64 flex items-center justify-center mb-16">
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div
                     animate={{ 
                       scale: [1, 1.5, 1],
                       opacity: [0.3, 0.1, 0.3]
                     }}
                     transition={{ repeat: Infinity, duration: 3 }}
                     className="w-64 h-64 bg-primary/20 rounded-full"
                   ></motion.div>
                </div>

                <div className="relative z-10 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                   >
                      <FaSyncAlt className="text-4xl text-[#111111]" />
                   </motion.div>
                </div>

                {/* Pulsing Icons around */}
                {matchingStatus === 'searching' && (
                  <AnimatePresence>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.5, 1],
                          x: Math.cos(i * 60) * 120,
                          y: Math.sin(i * 60) * 120,
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3, 
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                        className="absolute text-primary/40"
                      >
                        <FaUserCircle className="text-2xl" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
             </div>

             <div className="mb-12">
                <h3 className="text-3xl md:text-4xl font-black text-[#111111] mb-4 uppercase tracking-tighter">
                  {matchingStatus === 'searching' ? 'Searching for Cool Ride-mates...' : 'Perfect Matches Found!'}
                </h3>
                <p className="text-gray-500 font-medium max-w-xl mx-auto">
                   Our smart algorithm is analyzing nearby travel requests to find you the most direct route and reliable co-passengers.
                </p>
             </div>

             {/* Found Riders List */}
             <div className="space-y-4 max-w-2xl mx-auto">
                <AnimatePresence>
                  {foundRiders.map((rider, idx) => (
                    <motion.div
                      key={rider.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-primary/30 transition-all group"
                    >
                       <div className="relative">
                          <FaUserCircle className="text-5xl text-gray-300 group-hover:text-primary transition-colors" />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white"></div>
                       </div>
                       <div className="text-left flex-grow">
                          <h4 className="font-black text-[#111111] uppercase tracking-tight text-lg">{rider.name}</h4>
                          <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                             <FaMapMarkerAlt className="text-primary" />
                             {rider.distance}
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-primary font-black text-xl">★ {rider.rating}</div>
                          <div className="text-[10px] font-black uppercase opacity-40">Rating</div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             {matchingStatus === 'matched' && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-16"
               >
                  <button className="bg-primary text-[#111111] px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#111111] hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl shadow-primary/20">
                     PROCEED TO BOOKING <FaTaxi />
                  </button>
               </motion.div>
             )}

          </div>

          <div className="mt-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3">
             <span className="w-12 h-[1px] bg-gray-200"></span>
             Powered by Taxica AI Matching Engine
             <span className="w-12 h-[1px] bg-gray-200"></span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AutoMatching;
