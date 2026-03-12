import { motion } from 'framer-motion';
import { plans } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const Pricing = () => {
  return (
    <>
      <PageHeader title="Pricing Plans" breadcrumb="Pricing" />
      
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-primary font-bold uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold mt-2">Choose Your Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${plan.recommended ? 'border-primary scale-105' : 'border-transparent hover:border-gray-200'}`}
              >
                {plan.recommended && (
                  <div className="bg-primary text-secondary text-center text-sm font-bold py-2 uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6 border-b border-gray-100 pb-6 flex items-baseline">
                    <span className="text-5xl font-bold text-secondary">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/ hour</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <FaCheck className="text-primary" />
                        <span className="text-gray-600 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className={`w-full justify-center ${plan.recommended ? 'btn-primary' : 'btn-secondary'}`}>
                    Choose Plan
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Pricing;
