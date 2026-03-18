import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqData = [
  { id: 1, question: 'How long does a booking take?', answer: 'Booking takes less than 60 seconds. Enter your pickup and drop-off, choose your ride type, and confirm. Your driver will be assigned instantly.' },
  { id: 2, question: 'How can I become a member?', answer: 'Simply register on our platform with your email or phone number. Membership is free and gives you access to exclusive discounts and priority support.' },
  { id: 3, question: 'What payment methods are supported?', answer: 'We support all major credit/debit cards, UPI, net banking, and cash payments. All digital transactions are secured with 256-bit encryption.' },
  { id: 4, question: 'How can I cancel my booking?', answer: 'You can cancel your ride from the My Bookings page up to 5 minutes before the scheduled pickup. Cancellations within 5 minutes may incur a small fee.' },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> FAQ
            </span>
            <h2 className="section-title mb-6">
              Frequently Asked<br /><span className="gradient-text">Questions</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Got questions? We've got answers. If you don't find what you're looking for, reach out to our 24/7 support team.
            </p>
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <img src="/faq.jpg" alt="FAQ Support" className="w-full h-64 object-cover opacity-80" />
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
          >
            {faqData.map((faq, index) => (
              <div
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'border-primary/50 bg-[#111111]' : 'border-white/8 bg-[#111111]'}`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`font-bold text-base transition-colors ${activeIndex === index ? 'text-primary' : 'text-white/80'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all ${activeIndex === index ? 'bg-primary text-black rotate-180' : 'bg-white/10 text-white/50'}`}>
                    <FaChevronDown size={11} />
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 border-t border-white/8 pt-4">
                        <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
