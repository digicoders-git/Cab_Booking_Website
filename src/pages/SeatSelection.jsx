import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCouch, FaTaxi, FaInfoCircle } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  
  // Define seats: 4 seats for a standard sedan (1 front-right, 3 back)
  const seats = [
    { id: 1, type: 'front', label: 'Front L', isAvailable: false },
    { id: 2, type: 'front', label: 'Front R', isAvailable: true }, // Driver is usually Left/Right depending on country, let's assume Right is passenger
    { id: 3, type: 'back', label: 'Back L', isAvailable: true },
    { id: 4, type: 'back', label: 'Back C', isAvailable: false },
    { id: 5, type: 'back', label: 'Back R', isAvailable: true },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Seat Selection" subtitle="Choose your preferred seat for a shared journey" />
      
      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Visual Seat Map */}
          <div className="relative bg-gray-100 p-12 rounded-[60px] flex justify-center items-center shadow-inner overflow-hidden">
             {/* Taxi Outline Background */}
             <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                <FaTaxi className="text-[500px]" />
             </div>

             <div className="relative z-10 w-full max-w-[320px] bg-white p-10 rounded-[40px] shadow-2xl border-4 border-[#111111]">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-2 bg-gray-800 rounded-full"></div> {/* Steering Wheel Indicator */}
                </div>

                {/* Front Seats */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                   {seats.filter(s => s.type === 'front').map(seat => (
                     <div key={seat.id} className="flex flex-col items-center">
                        <button
                          disabled={!seat.isAvailable}
                          onClick={() => setSelectedSeat(seat.id)}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            !seat.isAvailable 
                              ? 'bg-red-100 text-red-300 cursor-not-allowed' 
                              : selectedSeat === seat.id 
                                ? 'bg-primary text-[#111111] scale-110 shadow-lg shadow-primary/40' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          }`}
                        >
                          <FaCouch className="text-2xl" />
                        </button>
                        <span className="text-[10px] font-extrabold uppercase mt-2 opacity-50">{seat.label === 'Front L' ? 'Driver' : seat.label}</span>
                     </div>
                   ))}
                </div>

                {/* Back Seats */}
                <div className="grid grid-cols-3 gap-4">
                   {seats.filter(s => s.type === 'back').map(seat => (
                     <div key={seat.id} className="flex flex-col items-center">
                        <button
                          disabled={!seat.isAvailable}
                          onClick={() => setSelectedSeat(seat.id)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            !seat.isAvailable 
                              ? 'bg-red-100 text-red-300 cursor-not-allowed font-medium' 
                              : selectedSeat === seat.id 
                                ? 'bg-primary text-[#111111] scale-110 shadow-lg shadow-primary/40' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          }`}
                        >
                          <FaCouch className="text-xl" />
                        </button>
                        <span className="text-[10px] font-extrabold uppercase mt-2 opacity-50">{seat.label}</span>
                     </div>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-3 gap-2">
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 bg-gray-100 rounded"></div>
                      <span className="text-[8px] font-bold opacity-70">FREE</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 bg-red-100 rounded"></div>
                      <span className="text-[8px] font-bold opacity-70">TAKEN</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="text-[8px] font-bold opacity-70">YOURS</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Side: Info & Proceed */}
          <div className="flex flex-col justify-center">
             <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-extrabold text-xs uppercase tracking-widest mb-6">
               Shared Cab Booking
             </div>
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-8 uppercase tracking-tighter">
               SELECT YOUR <span className="text-primary italic">FAVORITE SEAT</span>
             </h2>
             <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
               Choose your preferred seat for a comfortable journey. Prices may vary slightly depending on front or back selection in shared rides.
             </p>

             <div className="bg-gray-50 border-s-4 border-primary p-6 rounded-r-3xl mb-12">
                <div className="flex items-start gap-4">
                   <FaInfoCircle className="text-primary text-xl mt-1" />
                   <div>
                      <h4 className="font-extrabold text-[#111111] mb-1">PRO TIP</h4>
                      <p className="text-gray-500 text-sm font-medium italic">"Front seats offer a better view, while back seats provide more privacy for multi-rider trips."</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-grow w-full">
                   <div className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Total Selection</div>
                   <div className="text-2xl font-extrabold text-[#111111]">{selectedSeat ? `Seat ID: ${selectedSeat}` : "None Selected"}</div>
                </div>
                <button 
                  disabled={!selectedSeat}
                  className={`w-full sm:w-auto px-12 py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-primary/20 transition-all duration-300 ${
                    selectedSeat ? 'bg-[#111111] text-white hover:bg-primary hover:text-[#111111]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  CONFIRM SEAT
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
