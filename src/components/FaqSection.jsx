import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestion, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqData = [
  {
    id: 1,
    question: "How Long Does A Booking Take ?",
    answer: "We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire. Ante odio dignissim quam, vitae pulvinar turpis erat ac elit eu orci id odio facilisis pharetra."
  },
  {
    id: 2,
    question: "How Can I Become A Member ?",
    answer: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
  },
  {
    id: 3,
    question: "What Payment Gateway You Support ?",
    answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  },
  {
    id: 4,
    question: "How Can I Cancel My Request ?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
  }
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4 items-center">
          
          {/* Left Column: Info + Image */}
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <div className="max-w-xl">
              <span className="text-primary font-bold uppercase tracking-wider text-sm mb-3 block">
                FAQ'S
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-tight">
                General <span className="text-primary font-black italic">Frequently</span> Asked Questions
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even.
              </p>
              
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="/faq.jpg" 
                  alt="Customer Support" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="w-full lg:w-1/2 px-4">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'border-primary shadow-lg' : 'border-gray-100 shadow-sm'}`}
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeIndex === index ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                        <FaQuestion className="text-sm" />
                      </div>
                      <span className={`font-bold text-lg md:text-xl transition-colors ${activeIndex === index ? 'text-primary' : 'text-[#111111]'}`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`text-gray-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                      <FaChevronDown />
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-gray-100 pt-4 mt-2">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
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
    </section>
  );
};

export default FaqSection;
