import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import PageHeader from '../components/PageHeader';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTaxi, FaWhatsapp, FaClock, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Message Received',
      text: 'Thank you for contacting KwibCabs! Our team will get back to you soon.',
      confirmButtonColor: '#FFD60A',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Our Location",
      desc: "123 Taxi Street, Downtown Core, New York, NY 10001",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaPhoneAlt />,
      title: "Call Us 24/7",
      desc: "+1 (234) 567 8900 | +1 (987) 654 3210",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: <FaEnvelope />,
      title: "Email Support",
      desc: "info@kwibcabs.com | support@kwibcabs.com",
      color: "from-emerald-400 to-teal-500"
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="Contact Us" subtitle="Get in touch with KwibCabs — your most reliable cab service" />
      
      <section className="section-padding container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Contact Info & Brand */}
            <div className="lg:col-span-5 space-y-10">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="space-y-6"
               >
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary font-black text-xs uppercase tracking-widest rounded-full">
                     <FaTaxi /> Connect with us
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#111111] uppercase tracking-tighter leading-none">
                     HAVE A QUESTION? <br />
                     <span className="text-primary">DROP US A LINE</span>
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed max-w-md">
                     Whether you're looking for a quick ride, planning a corporate event, or have a business inquiry, our team is ready to help you 24/7.
                  </p>
               </motion.div>

               <div className="space-y-6">
                  {contactInfo.map((info, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white p-5 sm:p-8 rounded-[40px] shadow-xl border border-gray-50 flex items-center gap-4 sm:gap-6 hover:border-primary/20 transition-all duration-300"
                    >
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300 shadow-inner">
                          {info.icon}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-[#111111] uppercase tracking-widest mb-1">{info.title}</h4>
                          <p className="text-gray-500 font-medium text-sm">{info.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>

               <div className="bg-[#111111] p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-2">
                        <FaWhatsapp className="text-primary text-xl" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">WhatsApp Support</span>
                     </div>
                     <div className="text-2xl font-black">+1 (234) 567 890</div>
                  </div>
                  <button className="bg-primary p-4 rounded-2xl text-[#111111] hover:bg-white transition-colors">
                     <FaPaperPlane />
                  </button>
               </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 sm:p-10 md:p-16 rounded-[40px] sm:rounded-[60px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-50 h-full"
               >
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Full Name</label>
                           <input 
                             type="text" 
                             name="name"
                             required
                             placeholder="Ex: John Doe"
                             value={formData.name}
                             onChange={handleChange}
                             className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-3xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Email Address</label>
                           <input 
                             type="email" 
                             name="email"
                             required
                             placeholder="Ex: john@taxica.com"
                             value={formData.email}
                             onChange={handleChange}
                             className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-3xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Subject</label>
                        <input 
                          type="text" 
                          name="subject"
                          required
                          placeholder="How can we help you today?"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-3xl outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111]" 
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Your Message</label>
                        <textarea 
                          name="message"
                          required
                          rows="5"
                          placeholder="Tell us everything..."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-2 border-transparent py-5 px-6 rounded-[40px] outline-none focus:bg-white focus:border-primary transition-all font-bold text-[#111111] resize-none" 
                        ></textarea>
                     </div>

                     <div className="flex justify-end">
                        <button type="submit" className="bg-[#111111] text-white font-black py-5 px-10 rounded-3xl text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-[#111111] transition-all duration-300 flex items-center gap-3">
                           SEND MESSAGE NOW <FaPaperPlane size={14} />
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Modern High-Quality Map integration */}
      <section className="relative h-[600px] w-full overflow-hidden border-t-8 border-primary">
         <div className="absolute bottom-10 left-10 z-10 hidden md:block">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="bg-[#111111]/95 backdrop-blur-md p-8 rounded-[40px] text-white shadow-2xl border border-white/10 max-w-xs"
            >
               <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-4">CITY HUB</h4>
               <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  Our headquarters is located at the heart of the tech district. Drop by for a cup of coffee.
               </p>
               <div className="mt-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                     <FaClock size={16}/>
                  </div>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary block">Open 24/7</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Every Single Day</span>
                  </div>
               </div>
            </motion.div>
         </div>
         
         <iframe 
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1710240000000!5m2!1sen!2sin" 
           width="100%" 
           height="100%" 
           style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }} 
           allowFullScreen="" 
           loading="lazy" 
           referrerPolicy="no-referrer-when-downgrade"
           className="hover:opacity-100 transition-opacity duration-500"
         ></iframe>
      </section>
    </div>
  );
};

export default Contact;
