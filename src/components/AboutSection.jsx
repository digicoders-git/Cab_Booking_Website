import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaTaxi } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section className="section-padding bg-white overflow-hidden py-24">
      <div className="container mx-auto 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Image + Badge + Blob Background */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative pr-0 lg:pr-10 mt-10 lg:mt-0"
          >
            {/* The Badge (Top Left Dashboard) */}
            <div className="absolute -top-10 -left-2 sm:-left-6 md:-left-12 lg:-top-12 lg:-left-16 bg-[#111111] text-white rounded-[40px] pl-3 pr-6 py-2.5 flex items-center gap-4 z-20 shadow-[0_10_30px_rgba(0,0,0,0.3)] border-[3px] border-[#FFE9A6]/20">
              <div className="w-[45px] h-[45px] rounded-full border-2 border-primary border-dashed flex items-center justify-center p-1">
                 <div className="bg-primary/20 w-full h-full rounded-full flex items-center justify-center">
                   <FaTaxi className="text-primary text-[18px]" />
                 </div>
              </div>
              <div className="leading-[1.2]">
                <span className="block font-extrabold text-[15px]">30 Years Of</span>
                <span className="block font-medium text-[13px] text-gray-300">Quality Service</span>
              </div>
            </div>

            {/* Simulated Brush/Blob Dark Background */}
            <div 
              className="absolute inset-[10%] bg-[#0a0a0a] z-0 opacity-95 blur-[1px] transform -rotate-6"
              style={{
                borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            ></div>
            
            {/* Some yellow dynamic dashed circle accents */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] border-t-[3px] border-r-[3px] border-dashed border-primary rounded-tr-[100px] opacity-60 z-0"></div>
            <div className="absolute bottom-10 left-0 w-[120px] h-[120px] border-b-[3px] border-l-[3px] border-dashed border-primary rounded-bl-[100px] opacity-60 z-0"></div>
            
            {/* Yellow Dot Clusters Pattern */}
            <div className="absolute -left-10 top-1/2 flex gap-2 flex-wrap w-10 opacity-30 z-0">
               {[...Array(6)].map((_, i) => <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full"></span>)}
            </div>

            {/* Main Yellow Taxi Car Image */}
            <img 
              src="/cab1.png" 
              alt="Yellow Taxi Cab" 
              className="relative z-10 w-[110%] max-w-none -ml-[5%] object-contain transform translate-y-4 hover:-translate-y-2 transition-transform duration-500 max-h-[450px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* Right Side: Typography & Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            {/* Subheading */}
            <span className="text-primary font-bold uppercase tracking-[0.25em] text-[13px] flex items-center gap-3 mb-2">
              <span className="w-10 h-[2px] bg-primary"></span> ABOUT US
            </span>
            
            {/* Main Heading matching the screenshot strictly */}
            <h2 className="text-[34px] md:text-[44px] lg:text-[40px] xl:text-[46px] font-extrabold mt-2 mb-6 leading-[1.1] text-[#111111] tracking-tight">
               We Provide Trusted <span className="text-primary text-shadow-sm italic">Cab<br/>Service</span> In The World
            </h2>
            
            {/* Text Description */}
            <p className="text-gray-600 leading-[1.8] mb-8 text-[16px] font-medium border-l-4 border-gray-100 pl-4">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
            </p>
            
            {/* Key list items */}
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3.5 group">
                <FaCheckCircle className="text-primary text-[22px] group-hover:scale-110 transition-transform duration-300 shadow-sm rounded-full bg-white" />
                <span className="font-bold text-[#333] text-[16px]">At vero eos et accusamus et iusto odio.</span>
              </li>
              <li className="flex items-center gap-3.5 group">
                <FaCheckCircle className="text-primary text-[22px] group-hover:scale-110 transition-transform duration-300 shadow-sm rounded-full bg-white" />
                <span className="font-bold text-[#333] text-[16px]">Established fact that a reader will be distracted.</span>
              </li>
              <li className="flex items-center gap-3.5 group">
                <FaCheckCircle className="text-primary text-[22px] group-hover:scale-110 transition-transform duration-300 shadow-sm rounded-full bg-white" />
                <span className="font-bold text-[#333] text-[16px]">Sed ut perspiciatis unde omnis iste natus sit.</span>
              </li>
            </ul>
            
            {/* Call to Action Button */}
            <Link 
              to="/about" 
              className="inline-flex items-center gap-4 bg-primary text-[#111111] font-extrabold uppercase text-[13px] pl-8 pr-2 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-[0_10px_20px_rgba(255,193,7,0.3)] group"
            >
              ABOUT US 
              <div className="bg-white/30 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                <FaArrowRight className="text-[17px] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
