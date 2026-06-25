import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCopy, FaCheckCircle, FaTag, FaInfoCircle } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/offers/active`);
        const data = await response.json();
        if (data.success) {
          setOffers(data.offers);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20 pb-20">
      <PageHeader 
        title="Exclusive Offers" 
        subtitle="Grab the best deals on your next ride with KwikCabs" 
      />

      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : offers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-[#111] rounded-3xl border border-white/5"
          >
            <FaInfoCircle className="text-6xl text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Active Offers</h3>
            <p className="text-white/60">Check back later for exciting new deals and discounts!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-[#111] rounded-3xl p-8 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/50"
              >
                {/* Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex justify-center items-center">
                      <FaTag className="text-2xl text-primary" />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-white/70">
                      {offer.bookingType} Booking
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2">
                    Save <span className="text-primary">₹{offer.discountAmount}</span>
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-8 flex-grow">
                    Valid on your next {offer.bookingType.toLowerCase()} ride. Apply the promo code during checkout to avail this exclusive discount.
                  </p>

                  <div className="mt-auto">
                    <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Promo Code</p>
                    <div 
                      onClick={() => copyToClipboard(offer.code)}
                      className="flex justify-between items-center bg-black border border-white/10 rounded-xl p-4 cursor-pointer group/code hover:border-primary/50 transition-colors"
                    >
                      <span className="text-xl font-bold tracking-widest text-white group-hover/code:text-primary transition-colors">
                        {offer.code}
                      </span>
                      {copiedCode === offer.code ? (
                        <FaCheckCircle className="text-green-500 text-lg" />
                      ) : (
                        <FaCopy className="text-white/40 group-hover/code:text-white transition-colors text-lg" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                    <span>Valid till</span>
                    <span className="font-medium text-white/60">
                      {new Date(offer.validTill).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
