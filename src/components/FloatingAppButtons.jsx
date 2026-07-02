import { FaGooglePlay } from 'react-icons/fa';

const FloatingAppButtons = () => {
  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[9999] flex flex-col gap-3 items-end">
      {/* User App Button */}
      <a 
        href="https://play.google.com/store/apps/details?id=digi.coders.kwikcabs"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-end bg-primary text-black h-12 w-12 hover:w-[170px] rounded-l-xl shadow-[0_4px_15px_rgba(255,214,10,0.4)] transition-all duration-300 overflow-hidden relative cursor-pointer"
      >
        <span className="absolute left-0 w-[122px] text-center whitespace-nowrap opacity-0 group-hover:opacity-100 font-bold text-[14px] transition-all duration-300 delay-75">
          User App
        </span>
        <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-primary z-10 rounded-l-xl">
          <FaGooglePlay size={18} />
        </div>
      </a>

      {/* Driver App Button */}
      <a 
        href="https://play.google.com/store/apps/details?id=digi.coders.kwikcabsdriver"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-end bg-[#111] border border-r-0 border-primary text-primary h-12 w-12 hover:w-[150px] rounded-l-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden relative cursor-pointer"
      >
        <span className="absolute left-0 w-[102px] text-center whitespace-nowrap opacity-0 group-hover:opacity-100 font-bold text-[14px] transition-all duration-300 delay-75">
          Driver App
        </span>
        <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-[#111] z-10 rounded-l-xl">
          <FaGooglePlay size={18} />
        </div>
      </a>
    </div>
  );
};

export default FloatingAppButtons;
