import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTaxi, FaUserTie, FaMapMarkedAlt, FaTimes } from 'react-icons/fa';

const featuresData = [
  { 
    id: 1, 
    title: 'Best Quality Taxi', 
    num: '01', 
    icon: FaTaxi, 
    desc: 'There are many variations of passages available but the majority have suffered alteration in form injected humour words which don\'t look even slightly believable. If you are going passage you need there anything embar.' 
  },
  { 
    id: 2, 
    title: 'Expert Drivers', 
    num: '02', 
    icon: FaUserTie, 
    desc: 'There are many variations of passages available but the majority have suffered alteration in form injected humour words which even slightly believable. If you are going passage you need there anything.' 
  },
  { 
    id: 3, 
    title: 'Many Locations', 
    num: '03', 
    icon: FaMapMarkedAlt, 
    desc: 'There are many variations of passages available but the majority have suffered alteration in form injected humour words which don\'t look even slightly believable. If you are going passage you need there anything embar.' 
  },
];

const QualityServiceSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full bg-[#111111] pb-24 z-10">
      
      {/* Repeating Topographic Background Pattern (Simulated with SVG data URI) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* OVERLAPPING VIDEO BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-[1100px] mx-auto mb-20 lg:mb-28 mt-4 lg:mt-8 pt-6"
        >
          <div className="relative rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200" 
              alt="Video Thumbnail" 
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#111111]/30 flex items-center justify-center">
              {/* Play Button */}
              <motion.div 
                onClick={() => setIsVideoOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-[85px] h-[85px] bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(255,193,7,0.6)] relative group"
              >
                {/* Simple CSS triangle for play icon */}
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#111111] border-b-[12px] border-b-transparent ml-1.5 relative z-10 transition-transform group-hover:scale-110"></div>
                {/* Ping rings */}
                <div className="absolute inset-[-12px] rounded-full border-[2px] border-primary animate-ping opacity-40"></div>
                <div className="absolute inset-[-25px] rounded-full border-[1px] border-primary animate-ping opacity-20" style={{ animationDelay: '0.4s' }}></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isVideoOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10"
            >
              <div 
                className="absolute inset-0 bg-[#111111]/95 backdrop-blur-md"
                onClick={() => setIsVideoOpen(false)}
              ></div>
              
              <motion.div 
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-5 right-5 z-20 w-11 h-11 bg-primary rounded-full flex items-center justify-center text-[#111111] text-lg shadow-xl hover:bg-white transition-colors"
                >
                  <FaTimes />
                </button>

                {/* Video Player */}
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ckHzmP1evNU?autoplay=1"
                  title="Taxi Service Promo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Side: Text and Taxi Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[13px] block mb-3">
              WHY CHOOSE US
            </span>
            <h2 className="text-[38px] md:text-[45px] lg:text-[42px] xl:text-[48px] font-bold text-white leading-[1.15] mb-6">
              We Are Dedicated <span className="text-primary">To Provide</span> Quality Service
            </h2>
            <p className="text-gray-400 text-[15.5px] leading-[1.8] mb-10 font-medium">
              There are many variations of passages available but the majority have suffered alteration in some form going to use a passage by injected humour randomised words which don't look even slightly believable.
            </p>
            
            <div className="relative mt-8">
              <img 
                src="/cab2.png" 
                alt="Yellow Taxi" 
                className="w-full max-w-[500px] object-contain transform translate-y-4 hover:-translate-y-2 transition-transform duration-500 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
              />
            </div>
          </motion.div>

          {/* Right Side: Feature Cards */}
          <div className="space-y-6">
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-[20px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center group hover:shadow-[0_15px_30px_rgba(255,193,7,0.15)] transition-shadow duration-300"
              >
                {/* Yellow Icon Circle */}
                <div className="w-[75px] h-[75px] shrink-0 rounded-full bg-primary flex items-center justify-center border-[3px] border-transparent group-hover:border-[#111111]/10 transition-colors">
                  <feature.icon className="text-[32px] text-[#111111]" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pr-0 sm:pr-4">
                  <h3 className="text-[22px] font-bold text-[#111111] mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-[1.7] font-medium">
                    {feature.desc}
                  </p>
                </div>

                {/* Number Outline */}
                <div className="hidden sm:block">
                  <span 
                    className="text-transparent text-[60px] lg:text-[70px] font-black leading-none opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ WebkitTextStroke: '1.5px #FFC107' }}
                  >
                    {feature.num}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default QualityServiceSection;
