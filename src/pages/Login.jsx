import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaTaxi, FaFacebookF, FaGoogle } from 'react-icons/fa';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-[100px] sm:pt-[160px] pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#111111] hidden lg:block skew-x-[-10deg] translate-x-20"></div>
      
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Form */}
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <FaTaxi className="text-[#111111]" />
              </div>
              <span className="text-2xl font-black text-[#111111] lowercase tracking-tighter">kwibcabs</span>
            </Link>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111111] mb-2 uppercase tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
                <span className="text-gray-600 font-medium group-hover:text-[#111111] transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary font-bold hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full bg-primary text-[#111111] font-black py-5 rounded-2xl text-lg hover:bg-black hover:text-white hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95">
              SIGN IN TO ACCOUNT
            </button>



            <p className="text-center text-gray-500 font-medium pt-4">
              Don't have an account? <Link to="/register" className="text-primary font-black hover:underline ml-1">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Image/Branding */}
        <div className="hidden lg:block relative bg-[#111111]">
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920" 
            alt="Taxi background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-16 left-12 right-12 text-white">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary text-xl">★</span>
              ))}
            </div>
            <h3 className="text-3xl font-black mb-4 leading-tight">THE FASTEST WAY TO GET A RIDE IN TOWN</h3>
            <p className="text-gray-300 font-medium leading-relaxed">Join thousands of happy customers who trust KwibCabs for their daily commute and professional travels.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
