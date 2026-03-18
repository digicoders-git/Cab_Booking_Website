import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AppDownload = () => {
  return (
    <section className="bg-white section-padding overflow-hidden relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold uppercase tracking-wider">Download App</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-6 text-secondary">
              Get the KwibCabs App Now &<br />Save Up to 20%
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Book your ride on the go with our user-friendly mobile app. Enjoy exclusive discounts, real-time tracking, and seamless payments all from your smartphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="flex items-center justify-center sm:justify-start gap-3 bg-secondary text-white px-6 py-4 rounded-xl hover:bg-black transition-colors duration-300 w-full sm:w-auto shadow-xl hover:-translate-y-1 transform">
                <FaGooglePlay className="text-3xl text-primary" />
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider">Get it on</span>
                  <span className="block text-xl font-bold">Google Play</span>
                </div>
              </a>
              <a href="#" className="flex items-center justify-center sm:justify-start gap-3 bg-white text-secondary border-2 border-secondary px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 w-full sm:w-auto shadow-xl hover:-translate-y-1 transform">
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider text-gray-500">Download on the</span>
                  <span className="block text-xl font-bold">App Store</span>
                </div>
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Phone mockup placeholder */}
            <div className="relative mx-auto w-[240px] sm:w-[300px] h-[480px] sm:h-[600px] bg-secondary rounded-[40px] border-[10px] border-secondary shadow-2xl overflow-hidden before:absolute before:w-1/2 before:h-[30px] before:bg-secondary before:top-0 before:left-1/4 before:rounded-b-2xl before:z-20">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400" 
                alt="App Dashboard" 
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-6">
                 <div className="w-full">
                    <div className="bg-primary text-secondary font-bold p-3 rounded-lg text-center mb-4 shadow-lg animate-pulse">
                      Driver Arriving in 3 mins
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
