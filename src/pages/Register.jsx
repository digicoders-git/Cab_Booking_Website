import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaTaxi, FaUser, FaPhoneAlt, FaGoogle, FaFacebookF } from 'react-icons/fa';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-[160px] pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[#111111] hidden lg:block skew-x-[10deg] -translate-x-20"></div>
      
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex-row-reverse">
        
        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <FaTaxi className="text-[#111111]" />
              </div>
              <span className="text-2xl font-black text-[#111111] lowercase tracking-tighter">taxica</span>
            </Link>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] mb-2 uppercase tracking-tight">Create Account</h2>
            <p className="text-gray-500 font-medium">Get started with your free account today</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Full Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]" 
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Phone Number</label>
                <div className="relative flex items-center">
                  <FaPhoneAlt className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" 
                    required 
                    placeholder="+1 234 567 890"
                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]" 
                  />
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="example@mail.com"
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]" 
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-widest ml-1 mb-2 block opacity-70">Password</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-medium text-[#111111]" 
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
                <span className="text-xs font-medium text-gray-500 group-hover:text-[#111111] transition-colors leading-relaxed">
                  I agree to the <Link to="#" className="text-primary font-bold">Terms of Service</Link> and <Link to="#" className="text-primary font-bold">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="w-full bg-[#111111] text-white font-black py-5 rounded-2xl text-lg hover:bg-primary hover:text-[#111111] hover:scale-[1.02] shadow-xl shadow-black/10 transition-all duration-300 active:scale-95 mt-6">
              CREATE YOUR ACCOUNT
            </button>

            <p className="text-center text-gray-500 font-medium pt-4">
              Already have an account? <Link to="/login" className="text-primary font-black hover:underline ml-1">Log In</Link>
            </p>
          </form>
        </div>

        {/* Left Side: Image/Branding */}
        <div className="hidden lg:block relative bg-[#111111] order-2 lg:order-1">
          <img 
            src="https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&q=80&w=1920" 
            alt="Taxi background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-16 left-12 right-12 text-white">
             <div className="inline-block px-4 py-2 bg-primary rounded-full text-[#111111] font-black text-xs uppercase tracking-widest mb-6">
               New Member Offer
             </div>
            <h3 className="text-3xl font-black mb-4 leading-tight">GET 20% OFF ON YOUR <span className="text-primary">FIRST RIDE</span></h3>
            <p className="text-gray-300 font-medium leading-relaxed">Experience the ultimate comfort and reliability. Join our community and enjoy exclusive benefits on your travel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
