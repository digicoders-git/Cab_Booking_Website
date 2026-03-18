import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const driversData = [
  { id: 1, name: 'Alma Mcelroy', role: 'Expert Driver', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Marie Hooks', role: 'Expert Driver', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Daniel Nesmith', role: 'Expert Driver', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Gertrude Barrow', role: 'Expert Driver', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
];

const ExpertDrivers = () => {
  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="container mx-auto 2xl:max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag justify-center">
            <span className="w-4 h-px bg-primary" /> Our Team
          </span>
          <h2 className="section-title">Expert Drivers</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {driversData.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-[#111111] border border-white/8 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={driver.image}
                  alt={driver.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Social icons on hover */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-black hover:bg-white transition-colors">
                      <Icon size={12} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-white font-bold text-base group-hover:text-primary transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>{driver.name}</h3>
                <p className="text-primary text-xs font-medium mt-1">{driver.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertDrivers;
