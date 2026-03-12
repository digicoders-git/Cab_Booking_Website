import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaStar, FaIdCard, FaPhoneAlt } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const Team = () => {
  const drivers = [
    {
      id: 1,
      name: "Jack Sparrow",
      experience: "8 Years Exp.",
      image: "https://images.unsplash.com/photo-1544168190-79c175319808?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      trips: "2,500+"
    },
    {
      id: 2,
      name: "Tom Cruise",
      experience: "5 Years Exp.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
      rating: 4.8,
      trips: "1,800+"
    },
    {
      id: 3,
      name: "Will Smith",
      experience: "10 Years Exp.",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=300",
      rating: 5.0,
      trips: "4,200+"
    },
    {
      id: 4,
      name: "Emma Watson",
      experience: "4 Years Exp.",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      trips: "1,200+"
    },
    {
      id: 5,
      name: "Dwayne Johnson",
      experience: "12 Years Exp.",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
      rating: 4.7,
      trips: "5,000+"
    },
    {
      id: 6,
      name: "Scarlett Johans",
      experience: "6 Years Exp.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
      rating: 4.8,
      trips: "2,100+"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Expert Drivers" subtitle="Meet our professional and verified driving team" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="text-center mb-16 px-4">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-[#111111] font-extrabold text-[10px] uppercase tracking-widest rounded-full mb-6">
              <FaIdCard /> Certified Professionals
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111111] uppercase tracking-tighter mb-4">OUR ELITE DRIVING TEAM</h2>
           <p className="text-gray-500 max-w-2xl mx-auto font-medium">
             Every Taxica driver is background checked, highly trained, and committed to your safety and comfort.
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {drivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[50px] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20"
            >
              <div className="relative h-[350px] overflow-hidden">
                <img 
                  src={driver.image} 
                  alt={driver.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                
                {/* Social Hover */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                   <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-primary transition-colors shadow-lg"><FaFacebookF /></a>
                   <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-primary transition-colors shadow-lg"><FaTwitter /></a>
                   <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-primary transition-colors shadow-lg"><FaLinkedinIn /></a>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-6 left-6 bg-primary px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold text-[#111111] shadow-xl text-sm">
                   <FaStar className="text-white" /> {driver.rating}
                </div>
              </div>

              <div className="p-10 text-center">
                 <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3 block">{driver.experience}</span>
                 <h3 className="text-2xl font-extrabold text-[#111111] uppercase tracking-tighter mb-6 group-hover:text-primary transition-colors">{driver.name}</h3>
                 
                 <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-8">
                    <div className="text-left">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Trips</span>
                       <span className="text-lg font-extrabold text-[#111111]">{driver.trips}</span>
                    </div>
                    <button className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center hover:bg-primary hover:text-[#111111] transition-all">
                       <FaPhoneAlt />
                    </button>
                 </div>

                 <button className="w-full py-4 rounded-3xl border-2 border-[#111111] font-extrabold text-[12px] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all duration-300">
                    DRIVER DETAILS
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
