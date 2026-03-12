import { useState } from 'react';
import { motion } from 'framer-motion';
import { cars } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCarSide, FaUser, FaSuitcase, FaSnowflake, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa';

const tabs = ['ALL TAXI', 'HYBRID TAXI', 'TOWN TAXI', 'SUV TAXI', 'LIMOUSINE TAXI'];

const featuresList = [
  { label: 'Taxi Doors:', value: '4', icon: FaCarSide },
  { label: 'Passengers:', value: '4', icon: FaUser },
  { label: 'Luggage Carry:', value: '2', icon: FaSuitcase },
  { label: 'Air Condition:', value: 'Yes', icon: FaSnowflake },
  { label: 'GPS Navigation:', value: 'Yes', icon: FaMapMarkerAlt },
  { label: 'Driver Choosing:', value: 'Yes', icon: FaUserTie },
];

const CarFleet = () => {
  const [activeTab, setActiveTab] = useState('ALL TAXI');

  return (
    <section className="section-padding bg-[#fdfdfd] py-24">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Subtitle with slight yellow highlight behind */}
          <div className="inline-block relative mb-3">
            <span className="relative z-10 text-primary font-bold uppercase tracking-widest text-sm">
              OUR TAXI
            </span>
            <div className="absolute bottom-1 left-0 w-full h-2 bg-primary/20 z-0"></div>
          </div>
          
          <h2 className="text-[42px] font-bold text-[#111111] leading-tight mb-4">
            Let's Check Available Taxi
          </h2>
          
          {/* Custom Yellow Line Divider */}
          <div className="flex justify-center items-center gap-1 mb-8">
            <div className="w-12 h-[3px] bg-primary"></div>
            <div className="w-10 h-2 rounded-full border-[2px] border-primary"></div>
          </div>

          {/* Tabs - Scrollable on mobile, centered on desktop */}
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 md:px-7 py-3 md:py-3.5 rounded-full font-black text-[11px] md:text-[13px] tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 border-2 ${
                  activeTab === tab 
                    ? 'bg-primary border-primary text-[#111111] shadow-lg shadow-primary/20' 
                    : 'bg-[#1a1a1a] border-[#1a1a1a] text-white hover:bg-primary hover:border-primary hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.slice(0, 3).map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Top Image Section (Light Gray Background) */}
              <div className="bg-[#f8f9fa] pt-10 pb-6 px-6 relative rounded-t-[20px] flex justify-center items-center min-h-[220px]">
                <img 
                  src="/cab2.png" 
                  alt="Taxi Car" 
                  className="w-[90%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content Data */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-[20px] font-black text-[#111111] mb-2 uppercase tracking-tight">BMW M5 2019 MODEL</h3>
                  <div className="text-primary font-medium text-[15px]">${car.price}.00/km</div>
                  <div className="w-8 h-[3px] bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 flex-1">
                  {featuresList.map((feature, i) => (
                    <div key={i} className="flex justify-between items-center text-[14px]">
                      <div className="flex items-center gap-3">
                        <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white p-1.5 shadow-sm">
                          <feature.icon className="w-full h-full" />
                        </div>
                        <span className="text-gray-500 font-medium">{feature.label}</span>
                      </div>
                      <span className="text-[#111111] font-bold">{feature.value}</span>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <Link 
                  to="/booking" 
                  className="w-full bg-primary text-[#111111] font-black uppercase text-[14px] tracking-wider py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#111111] hover:text-white transition-colors duration-300"
                >
                  BOOK TAXI NOW <FaArrowRight />
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
