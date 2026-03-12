import { Link } from 'react-router-dom';
import { FaEnvelope, FaTaxi, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-[160px] pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#111111] hidden lg:block skew-x-[-10deg] translate-x-20"></div>
      
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 p-8 md:p-12">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <FaTaxi className="text-[#111111]" />
            </div>
            <span className="text-2xl font-black text-[#111111] lowercase tracking-tighter">taxica</span>
          </Link>
          
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <FaShieldAlt className="text-3xl text-primary" />
          </div>
          
          <h2 className="text-3xl font-black text-[#111111] mb-3 uppercase tracking-tight">Forgot Password?</h2>
          <p className="text-gray-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form className="space-y-6">
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

          <button type="submit" className="w-full bg-primary text-[#111111] font-black py-5 rounded-2xl text-lg hover:bg-black hover:text-white hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95 uppercase tracking-wide">
            Send Reset Link
          </button>

          <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 font-black hover:text-primary transition-colors">
            <FaArrowLeft size={14} /> BACK TO LOGIN
          </Link>
        </form>

        {/* Security Note */}
        <div className="mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-[12px] text-gray-400 text-center">
           Note: If you don't receive an email within 5 minutes, please check your spam folder or try again.
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
