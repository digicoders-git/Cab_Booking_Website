import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageHeader = ({ title, breadcrumb }) => {
  return (
    <div className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 bg-[#0A0A0A] overflow-hidden border-b border-white/8">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[200px] bg-primary/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          {breadcrumb || title}
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          style={{ fontFamily: 'Syne, sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        <motion.div
          className="flex justify-center items-center gap-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="text-white/40 hover:text-primary transition-colors">Home</Link>
          <span className="text-white/20">/</span>
          <span className="text-primary font-medium">{breadcrumb || title}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
