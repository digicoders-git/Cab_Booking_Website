import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageHeader = ({ title, breadcrumb }) => {
  return (
    <div 
      className="relative pt-[120px] pb-20 lg:pt-[180px] lg:pb-[100px] bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&q=80&w=1920)' }}
    >
      <div className="absolute inset-0 bg-secondary/80"></div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        
        <motion.div 
          className="flex justify-center items-center space-x-2 text-primary font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-primary">{breadcrumb || title}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
