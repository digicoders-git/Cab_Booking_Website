import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCamera, FaKey, FaSignOutAlt, FaTaxi, FaBell } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <PageHeader title="My Profile" subtitle="Manage your personal information and preferences" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
             <div className="bg-[#111111] p-10 rounded-[50px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] -mr-16 -mt-16"></div>
                
                <div className="relative z-10 text-center">
                   <div className="relative inline-block mb-8">
                      <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-primary group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                         <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-[#111111] rounded-2xl flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                         <FaCamera size={14} />
                      </button>
                   </div>
                   
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">John Alexander Doe</h3>
                   <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Platinum Member</span>
                   
                   <div className="mt-12 space-y-3">
                      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <FaTaxi className="text-primary" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Rides</span>
                         </div>
                         <span className="text-white font-black">124</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <FaBell className="text-primary" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Bookings</span>
                         </div>
                         <span className="text-white font-black">2</span>
                      </div>
                   </div>

                   <button className="w-full mt-10 bg-red-500/10 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20">
                      <FaSignOutAlt /> LOGOUT
                   </button>
                </div>
             </div>
          </div>

          {/* Right: Profile Information */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-12">
                   <h4 className="text-2xl font-black text-[#111111] uppercase tracking-tighter">Account Settings</h4>
                   <button className="text-primary font-black text-xs uppercase tracking-widest underline underline-offset-8">Edit Details</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">Full Name</label>
                      <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl group focus-within:bg-white focus-within:border-primary border-2 border-transparent transition-all">
                         <FaUser className="text-gray-300 group-focus-within:text-primary transition-colors" />
                         <span className="font-bold text-[#111111]">John Alexander Doe</span>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">Email Address</label>
                      <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl group border-2 border-transparent transition-all">
                         <FaEnvelope className="text-gray-300 group-focus-within:text-primary transition-colors" />
                         <span className="font-bold text-[#111111]">john.doe@example.com</span>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">Contact Number</label>
                      <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl group border-2 border-transparent transition-all">
                         <FaPhoneAlt className="text-gray-300 group-focus-within:text-primary transition-colors" />
                         <span className="font-bold text-[#111111]">+1 (234) 567 8910</span>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">Saved Address</label>
                      <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl group border-2 border-transparent transition-all">
                         <FaMapMarkerAlt className="text-gray-300 group-focus-within:text-primary transition-colors" />
                         <span className="font-bold text-[#111111]">Manhattan, NY</span>
                      </div>
                   </div>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FaKey /></div>
                      <div>
                         <h5 className="font-black text-[#111111] uppercase tracking-tighter">Security</h5>
                         <p className="text-xs font-medium text-gray-400">Password last changed 3 months ago</p>
                      </div>
                   </div>
                   <button className="bg-[#111111] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all duration-300">
                      Change Password
                   </button>
                </div>
             </div>

             <div className="bg-primary/5 p-10 rounded-[50px] border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                   <h4 className="text-xl font-black text-[#111111] uppercase tracking-tighter mb-2">Exclusive Benefits</h4>
                   <p className="text-gray-500 font-medium">As a platinum member, you get priority booking and 15% discount on all airport rides.</p>
                </div>
                <button className="bg-primary text-[#111111] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all shadow-xl shadow-primary/20">
                   View Rewards
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
