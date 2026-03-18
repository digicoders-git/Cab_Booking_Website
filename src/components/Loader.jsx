import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      {/* Road track */}
      <div className="relative w-72 h-1.5 bg-white/10 rounded-full overflow-hidden mb-10">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        />
        {/* Dashed center line */}
        <div className="absolute inset-0 flex items-center gap-3 px-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-px w-6 bg-white/20" />
          ))}
        </div>
      </div>

      {/* Cab icon moving on road */}
      <div className="relative w-72 h-10 -mt-16 mb-6">
        <motion.div
          className="absolute top-0"
          initial={{ left: '-10%' }}
          animate={{ left: '90%' }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="text-primary text-3xl"
          >
            🚕
          </motion.div>
        </motion.div>
      </div>

      {/* Logo */}
      <motion.img
        src={logo}
        alt="KwibCabs"
        className="h-16 w-auto object-contain mb-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Loading dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <p className="text-white/40 text-xs mt-4 tracking-widest uppercase">KwibCabs — Finding your ride...</p>
    </motion.div>
  );
};

export default Loader;
