import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { FaGavel, FaBan, FaCheckDouble, FaHandshake } from 'react-icons/fa';

const TermsOfService = () => {
  const terms = [
    {
      icon: <FaHandshake />,
      title: "Agreement to Terms",
      content: "By accessing or using Taxica services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our app or website. These terms govern your use of our platform and the transportation services provided by our captains."
    },
    {
      icon: <FaCheckDouble />,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining the confidentiality of their account. You must provide accurate information when booking. Riders are expected to behave respectfully towards drivers. Any damage caused to vehicles by a passenger will be the passenger's financial responsibility."
    },
    {
      icon: <FaGavel />,
      title: "Pricing & Payment",
      content: "Fares are calculated based on distance, time, and demand. Estimates provided are not final until the trip is completed. Payments must be made through our authorized payment gateways. Taxes and service fees are included in the final fare shown upon completion."
    },
    {
      icon: <FaBan />,
      title: "Cancellation Policy",
      content: "Cancellations made within 5 minutes of driver acceptance are free. Following this period, a small cancellation fee may apply to compensate the driver's time and fuel. Frequent cancellations may result in temporary account suspension to maintain service efficiency."
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Terms of Service" subtitle="Please read these terms carefully before using our premium services." />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 mb-16 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

             <div className="prose prose-lg max-w-none text-gray-500 mb-12 relative z-10">
                <p className="font-black text-[#111111] text-xl mb-6 uppercase tracking-widest border-l-4 border-primary pl-6">Last Updated: March 2026</p>
                <p>
                  Welcome to Taxica. These Terms of Service ("Terms") constitute a legally binding agreement between you and Taxica regarding your use of our network of websites and mobile applications. By using our service, you acknowledge that you have read and understood these terms.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-10 relative z-10">
                {terms.map((term, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-[40px] bg-gray-50 border border-transparent hover:border-primary/30 transition-all group"
                  >
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-14 h-14 bg-[#111111] text-primary rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xl group-hover:rotate-12 transition-transform">
                           {term.icon}
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-[#111111] uppercase tracking-tighter mb-3">{term.title}</h3>
                           <p className="text-gray-500 font-medium leading-relaxed text-sm">{term.content}</p>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>

          <footer className="text-center pb-12">
             <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Questions about our terms?</p>
             <a href="mailto:legal@taxica.com" className="text-[#111111] font-black text-xl hover:text-primary transition-colors underline underline-offset-8">LEGAL@TAXICA.COM</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
