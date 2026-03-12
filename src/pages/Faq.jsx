import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaQuestionCircle, FaHeadset } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How do I book a taxi through your website?",
      answer: "Booking a taxi is easy! Simply go to our Home page or Booking section, enter your pickup location, destination, date, and time. Choose your preferred vehicle type and confirm the booking. You'll receive a confirmation email and SMS instantly."
    },
    {
      question: "What are your payment options?",
      answer: "We accept all major credit/debit cards, digital wallets (like PayPal, Apple Pay, Google Pay), and cash payments. You can pay online during booking or directly to the driver after your ride is completed."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking through your user dashboard or by contacting our 24/7 support team. Cancellations made at least 1 hour before the scheduled pickup time are free of charge. Late cancellations may incur a small fee."
    },
    {
      question: "What happens if my driver is late?",
      answer: "Our drivers are highly punctual, but in rare cases of heavy traffic or unforeseen delays, we'll notify you via the app. If a driver is more than 10 minutes late, you can request a re-assignment or get a discount on your current trip."
    },
    {
      question: "Are your drivers background checked?",
      answer: "Absolutely. Safety is our top priority. All our drivers undergo rigorous background checks, professional training, and regular performance reviews to ensure you have a safe and pleasant journey."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="FAQ Support" subtitle="Find answers to common questions about our service" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Support Info */}
          <div className="lg:col-span-1">
             <div className="sticky top-32 bg-[#111111] p-10 rounded-[40px] text-white shadow-2xl">
                <FaHeadset className="text-primary text-5xl mb-6" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Still have questions?</h3>
                <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                   Can't find the answer you're looking for? Please chat to our friendly team.
                </p>
                <button className="w-full bg-primary text-[#111111] font-black py-4 rounded-2xl hover:bg-white transition-all duration-300">
                   CONTACT SUPPORT
                </button>
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Available 24/7</p>
                   <div className="text-primary font-black">+1 (234) 567 890</div>
                </div>
             </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="lg:col-span-2 space-y-4">
             {faqs.map((faq, index) => (
               <div 
                 key={index}
                 className={`rounded-3xl border-2 transition-all duration-300 ${activeIndex === index ? 'border-primary bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
               >
                 <button
                   onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                   className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4"
                 >
                   <div className="flex items-center gap-4">
                      <FaQuestionCircle className={`text-xl shrink-0 ${activeIndex === index ? 'text-primary' : 'text-gray-300'}`} />
                      <span className={`text-lg font-black uppercase tracking-tight ${activeIndex === index ? 'text-[#111111]' : 'text-gray-500'}`}>
                         {faq.question}
                      </span>
                   </div>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-primary text-[#111111]' : 'bg-gray-100 text-gray-400'}`}>
                      {activeIndex === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                   </div>
                 </button>
                 
                 <AnimatePresence>
                   {activeIndex === index && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="px-6 md:px-8 pb-8 pt-0 text-gray-500 font-medium leading-relaxed">
                          <div className="w-full h-[2px] bg-primary/10 mb-6"></div>
                          {faq.answer}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Faq;
