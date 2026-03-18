import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { FaShieldAlt, FaLock, FaUserShield, FaRegFileAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FaUserShield />,
      title: "Data Collection",
      content: "We collect information you provide directly to us, such as your name, email, phone number, and pickup/drop-off locations when you book a ride. We also automatically collect certain information when you use our services, including GPS location to facilitate efficient pickups."
    },
    {
      icon: <FaShieldAlt />,
      title: "How We Use Information",
      content: "Your data is primarily used to provide and maintain our taxi services, process payments, and send important updates regarding your bookings. We also use information to improve our app performance and ensure the safety and security of both riders and drivers."
    },
    {
      icon: <FaLock />,
      title: "Information Sharing",
      content: "We do not sell your personal information. We share your location with our drivers to provide the service. We may also share data with third-party service providers (like payment processors) who help us operate our business, always under strict confidentiality agreements."
    },
    {
      icon: <FaRegFileAlt />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You can manage your notification preferences in the app settings. For any data-related inquiries, you can contact our dedicated privacy team at privacy@kwibcabs.com."
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Privacy Policy" subtitle="Your privacy is our top priority. Learn how KwibCabs protects your data." />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[60px] shadow-2xl border border-gray-50 mb-16"
          >
             <div className="prose prose-lg max-w-none text-gray-500 mb-12">
                <p className="font-bold text-[#111111] text-xl mb-6 uppercase tracking-tighter">Effective Date: March 12, 2026</p>
                <p>
                  At KwibCabs, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and mobile application. By using our services, you agree to the practices described in this policy.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-12">
                {sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-8 group"
                  >
                     <div className="w-16 h-16 bg-primary/20 text-primary rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300 shadow-inner">
                        {section.icon}
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-[#111111] uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{section.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">{section.content}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>

          <div className="bg-[#111111] p-12 rounded-[50px] text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mr-16 -mt-16"></div>
             <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Have questions about your privacy?</h4>
             <p className="text-gray-400 font-bold mb-8">Contact our legal team for any clarifications.</p>
             <button className="bg-primary text-[#111111] px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20">
                Contact Legal Team
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
