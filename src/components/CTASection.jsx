import { Link } from 'react-router-dom';
import { FaHeadset, FaArrowRight } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="relative bg-primary py-12 lg:py-0 overflow-hidden">
      {/* Top Checkerboard Border */}
      <div className="absolute top-0 left-0 w-full h-8 flex flex-col">
        <div className="flex h-1/2 w-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
        <div className="flex h-1/2 w-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 !== 0 ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
          
          {/* Left Content */}
          <div className="w-full lg:w-[60%] text-center lg:text-left">
            <h2 className="text-[32px] md:text-[50px] font-extrabold text-white leading-tight mb-4 drop-shadow-sm">
              Book Your Cab It's Simple <br className="hidden md:block" /> And Affordable
            </h2>
            <p className="text-white text-[15px] max-w-2xl leading-relaxed opacity-95">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout point of using is that it has normal distribution of letters.
            </p>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden lg:block w-[1px] h-24 bg-white/40 mx-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[30%] flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                <FaHeadset className="text-2xl" />
              </div>
              <span className="text-[28px] md:text-[32px] font-bold tracking-tight">
                +2 123 654 7898
              </span>
            </div>
            
            <Link 
              to="/booking" 
              className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider flex items-center gap-3 hover:bg-black transition-colors group shadow-lg"
            >
              Book Your Cab
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Checkerboard Border */}
      <div className="absolute bottom-0 left-0 w-full h-8 flex flex-col">
        <div className="flex h-1/2 w-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
        <div className="flex h-1/2 w-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 !== 0 ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
