import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaCar, FaUsers, FaGasPump, FaRoad, FaCogs } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const FareCalculation = () => {
  const [distance, setDistance] = useState(15); // km
  
  const baseFare = 50;
  const ratePerKm = 12;
  const sharedDiscount = 0.4; // 40% off

  const calculateTotal = (isShared) => {
    const amount = baseFare + (distance * ratePerKm);
    return isShared ? amount * (1 - sharedDiscount) : amount;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <PageHeader title="Fare Calculation" subtitle="Transparent pricing engine for your rides" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Input & Estimation */}
          <div className="bg-white p-10 rounded-[40px] shadow-2xl">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary text-2xl">
                   <FaCalculator />
                </div>
                <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Price Estimator</h3>
             </div>

             <div className="space-y-8">
                <div>
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Select Distance ({distance} km)</label>
                   <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={distance} 
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <FaRoad className="text-primary mb-3" />
                      <div className="text-xs font-black text-gray-400 uppercase">Base Fare</div>
                      <div className="text-xl font-black text-[#111111]">${baseFare}</div>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <FaGasPump className="text-primary mb-3" />
                      <div className="text-xs font-black text-gray-400 uppercase">Per KM</div>
                      <div className="text-xl font-black text-[#111111]">${ratePerKm}</div>
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                   <h4 className="font-black text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                     <FaCogs className="text-primary" /> Cost Factors
                   </h4>
                   <ul className="space-y-4">
                      {[
                        'Standard Fuel Surcharge included',
                        'Night hours (10PM-6AM) +$10 extra',
                        'Wait time: $2/per 5 mins after arrival',
                        'Toll charges are separate from fare'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-500">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>

          {/* Right: Comparative Cards */}
          <div className="space-y-6">
             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               className="bg-[#111111] p-10 rounded-[40px] shadow-2xl relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-8">
                   <FaCar className="text-6xl text-white/5 group-hover:text-primary/20 transition-all duration-500 transform -rotate-12 group-hover:rotate-0" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <FaCar className="text-primary" />
                      <span className="text-white/50 text-xs font-black uppercase tracking-widest">Single Rider</span>
                   </div>
                   <h3 className="text-3xl font-black text-white mb-2 underline decoration-primary decoration-4 underline-offset-8 uppercase">PRIVATE CAB</h3>
                   <div className="mt-8 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">${calculateTotal(false)}</span>
                      <span className="text-white/40 font-bold uppercase text-xs">est. fare</span>
                   </div>
                   <p className="text-gray-400 mt-6 text-sm font-medium">Standard premium ride with no sharing. Best for business and urgent travel.</p>
                </div>
             </motion.div>

             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-10 rounded-[40px] shadow-2xl border-2 border-primary group relative overflow-hidden"
             >
                {/* Save Badge */}
                <div className="absolute top-0 right-0 bg-primary text-[#111111] px-6 py-2 font-black text-xs uppercase tracking-tighter transform rotate-45 translate-x-8 translate-y-4 shadow-lg">
                   SAVE 40%
                </div>

                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <FaUsers className="text-primary" />
                      <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Multi Rider</span>
                   </div>
                   <h3 className="text-3xl font-black text-[#111111] mb-2 uppercase tracking-tighter">SHARED CAB</h3>
                   <div className="mt-8 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-[#111111]">${calculateTotal(true).toFixed(0)}</span>
                      <span className="text-gray-400 font-bold uppercase text-xs">per seat</span>
                   </div>
                   <p className="text-gray-500 mt-6 text-sm font-medium italic">"The most economical and sustainable way to travel comfortably."</p>
                   
                   <button className="mt-10 w-full bg-[#111111] text-white font-black py-4 rounded-2xl hover:bg-primary hover:text-[#111111] transition-all duration-300">
                      BOOK SHARED NOW
                   </button>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FareCalculation;
