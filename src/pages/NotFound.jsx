import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTaxi, FaArrowLeft, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 relative overflow-hidden bg-white">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
        <h1 className="text-[30rem] font-black text-[#111111]">404</h1>
      </div>

      <div className="container max-w-4xl mx-auto relative z-10 text-center">
        {/* Animated Icon Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 relative inline-block"
        >
          <div className="text-[120px] md:text-[180px] font-black text-[#111111] leading-none flex items-center justify-center tracking-tighter">
            4
            <div className="relative mx-2">
               <motion.div
                 animate={{ 
                   x: [0, 5, -5, 0],
                   rotate: [0, 2, -2, 0]
                 }}
                 transition={{ 
                   repeat: Infinity,
                   duration: 4,
                   ease: "easeInOut"
                 }}
               >
                 <FaTaxi className="text-primary text-[100px] md:text-[150px]" />
               </motion.div>
               {/* Search Icon over taxi */}
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center border-4 border-white">
                 <FaSearch className="text-primary text-lg animate-pulse" />
               </div>
            </div>
            4
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-6 uppercase tracking-tight">
            Whoops! This Road is a <span className="text-primary italic">Dead End</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            The destination you're looking for doesn't exist or took a wrong turn. Let's get you back on the right track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/" 
              className="group flex items-center gap-3 bg-primary text-[#111111] px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#111111] hover:text-white transition-all duration-300 shadow-xl shadow-primary/20"
            >
              <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              BACK TO HOME
            </Link>
            
            <Link 
              to="/contact" 
              className="flex items-center gap-3 bg-gray-100 text-[#111111] px-10 py-5 rounded-2xl font-black text-lg hover:bg-white hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200"
            >
              REPORT AN ISSUE
            </Link>
          </div>
        </motion.div>

        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5">
           <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
