import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaTaxi, FaMapMarkerAlt, FaPhoneAlt, FaTimes, FaCheckCircle,
  FaClock, FaStar, FaUser, FaRoute, FaShieldAlt, FaChevronRight,
  FaCommentAlt, FaExclamationTriangle
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

// Static driver data
const driverData = {
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  rating: 4.9,
  trips: 2840,
  car: 'Toyota Camry',
  plate: 'DL 01 AB 1234',
  color: 'Pearl White',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
  eta: 8, // minutes
};

const statusSteps = [
  { id: 1, label: 'Booking Confirmed', desc: 'Your ride has been booked', icon: FaCheckCircle, done: true, active: false },
  { id: 2, label: 'Driver Assigned',   desc: 'Ravi Kumar is your driver', icon: FaUser,         done: true, active: false },
  { id: 3, label: 'Driver En Route',   desc: 'Your driver is on the way', icon: FaTaxi,         done: false, active: true },
  { id: 4, label: 'Driver Arrived',    desc: 'Driver reached pickup point',icon: FaMapMarkerAlt,done: false, active: false },
  { id: 5, label: 'Ride In Progress',  desc: 'Enjoy your trip!',           icon: FaRoute,       done: false, active: false },
];

// Animated car path points on the fake road grid
const carPositions = [
  { top: '60%', left: '20%' },
  { top: '55%', left: '30%' },
  { top: '48%', left: '38%' },
  { top: '43%', left: '47%' },
  { top: '38%', left: '55%' },
];

const DriverTracking = () => {
  const [carIndex, setCarIndex] = useState(0);
  const [eta, setEta] = useState(driverData.eta);
  const [showChat, setShowChat] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'driver', text: "Hello! I'm on my way. Please be ready at the pickup point.", time: '7:42 PM' }
  ]);

  // Animate car position every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCarIndex(prev => (prev < carPositions.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown ETA
  useEffect(() => {
    if (eta <= 0) return;
    const t = setInterval(() => setEta(prev => (prev > 0 ? prev - 1 : 0)), 60000);
    return () => clearInterval(t);
  }, []);

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: chatMsg, time: 'Just now' }]);
    setChatMsg('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'driver', text: "Got it! I'll be there shortly.", time: 'Just now' }]);
    }, 1200);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <PageHeader title="Live Driver Tracking" subtitle="Track your driver in real-time" />

      <div className="section-padding container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: MAP ── */}
          <div className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden" style={{ minHeight: '380px' }}>

            {/* Road Grid Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(17,17,17,0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(17,17,17,0.07) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                backgroundColor: '#e8edf2',
              }}
            />

            {/* Roads */}
            <div className="absolute inset-0 opacity-40">
              {/* Horizontal roads */}
              {[20, 40, 60, 80].map(y => (
                <div key={y} className="absolute w-full bg-white" style={{ top: `${y}%`, height: '14px', borderTop: '2px dashed #ccc', borderBottom: '2px dashed #ccc' }} />
              ))}
              {/* Vertical roads */}
              {[20, 40, 60, 80].map(x => (
                <div key={x} className="absolute h-full bg-white" style={{ left: `${x}%`, width: '14px', borderLeft: '2px dashed #ccc', borderRight: '2px dashed #ccc' }} />
              ))}
            </div>

            {/* Route Line (dotted) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
              <polyline
                points="20%,60% 30%,55% 38%,48% 47%,43% 55%,38%"
                fill="none"
                stroke="#FFC107"
                strokeWidth="3"
                strokeDasharray="10 6"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>

            {/* Pickup Pin */}
            <div className="absolute z-10 flex flex-col items-center" style={{ top: '57%', left: '18%', transform: 'translate(-50%,-100%)' }}>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <FaMapMarkerAlt className="text-white text-sm" />
              </div>
              <div className="mt-1 bg-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow text-green-600 uppercase tracking-widest whitespace-nowrap">Pickup</div>
            </div>

            {/* Destination Pin */}
            <div className="absolute z-10 flex flex-col items-center" style={{ top: '35%', left: '57%', transform: 'translate(-50%,-100%)' }}>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <FaMapMarkerAlt className="text-white text-sm" />
              </div>
              <div className="mt-1 bg-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow text-red-500 uppercase tracking-widest whitespace-nowrap">Drop-off</div>
            </div>

            {/* Animated Car */}
            <motion.div
              className="absolute z-20"
              animate={{ top: carPositions[carIndex].top, left: carPositions[carIndex].left }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              style={{ top: carPositions[0].top, left: carPositions[0].left, transform: 'translate(-50%,-50%)' }}
            >
              <div className="relative">
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-primary rounded-full"
                />
                <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 border-2 border-primary relative z-10">
                  <FaTaxi className="text-primary text-lg" />
                </div>
              </div>
            </motion.div>

            {/* ETA Badge */}
            <div className="absolute top-5 left-5 z-20 bg-[#111111] text-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
              <FaClock className="text-primary" />
              <div>
                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">ETA</div>
                <div className="text-xl font-extrabold leading-none">{eta} min</div>
              </div>
            </div>

            {/* Map credit label */}
            <div className="absolute bottom-4 right-4 z-20 bg-white/80 backdrop-blur-sm text-[9px] font-bold text-gray-400 px-3 py-1.5 rounded-full">
              Taxica Tracking Engine
            </div>
          </div>

          {/* ── RIGHT: INFO PANEL ── */}
          <div className="flex flex-col gap-6">

            {/* Driver Card */}
            <div className="bg-white rounded-[32px] shadow-xl p-8 flex items-center gap-6">
              <div className="relative shrink-0">
                <img src={driverData.avatar} alt={driverData.name} className="w-20 h-20 rounded-[20px] object-cover border-4 border-primary shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold text-[#111111] uppercase tracking-tight">{driverData.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(driverData.rating) ? 'text-primary text-sm' : 'text-gray-200 text-sm'} />
                  ))}
                  <span className="text-xs font-extrabold text-gray-500 ml-1">{driverData.rating} · {driverData.trips.toLocaleString()} trips</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="text-[10px] font-extrabold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">{driverData.car}</span>
                  <span className="text-[10px] font-extrabold bg-primary/10 text-[#111111] px-3 py-1 rounded-full uppercase tracking-widest">{driverData.plate}</span>
                  <span className="text-[10px] font-extrabold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">{driverData.color}</span>
                </div>
              </div>
              <a href={`tel:${driverData.phone}`} className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-[#111111] shadow-lg hover:bg-[#111111] hover:text-primary transition-all shrink-0">
                <FaPhoneAlt />
              </a>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-[32px] shadow-xl p-8">
              <h4 className="text-sm font-extrabold text-[#111111] uppercase tracking-widest mb-6">Ride Status</h4>
              <div className="space-y-1">
                {statusSteps.map((step, i) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        step.done ? 'bg-green-500 text-white' :
                        step.active ? 'bg-primary text-[#111111] shadow-lg shadow-primary/40' :
                        'bg-gray-100 text-gray-300'
                      }`}>
                        {step.active ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                            <step.icon className="text-sm" />
                          </motion.div>
                        ) : (
                          <step.icon className="text-sm" />
                        )}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${step.done ? 'bg-green-300' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-extrabold uppercase tracking-tight ${
                        step.active ? 'text-primary' : step.done ? 'text-[#111111]' : 'text-gray-300'
                      }`}>{step.label}</p>
                      <p className={`text-xs font-medium mt-0.5 ${step.done || step.active ? 'text-gray-500' : 'text-gray-200'}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center justify-center gap-2 bg-[#111111] text-white py-4 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all shadow-lg"
              >
                <FaCommentAlt /> Message Driver
              </button>
              <button
                onClick={() => setShowCancel(true)}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-500 py-4 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100"
              >
                <FaTimes /> Cancel Ride
              </button>
            </div>

            {/* Safety Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <FaShieldAlt />
              </div>
              <p className="text-xs font-medium text-gray-500">Your ride is protected by <span className="font-extrabold text-[#111111]">Taxica Safety Shield</span>. Share your trip with a trusted contact.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHAT MODAL ── */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-sm">
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }}>
              {/* Chat Header */}
              <div className="bg-[#111111] p-6 flex items-center gap-4">
                <img src={driverData.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary" />
                <div className="flex-1">
                  <h4 className="font-extrabold text-white uppercase tracking-tight">{driverData.name}</h4>
                  <p className="text-[10px] text-green-400 font-extrabold uppercase tracking-widest">● Online</p>
                </div>
                <button onClick={() => setShowChat(false)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20">
                  <FaTimes />
                </button>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                      msg.from === 'user' ? 'bg-[#111111] text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[9px] font-extrabold uppercase tracking-widest mt-1 ${msg.from === 'user' ? 'text-white/50' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none"
                />
                <button onClick={sendMessage} className="bg-primary text-[#111111] px-5 py-3 rounded-xl font-extrabold text-sm hover:bg-[#111111] hover:text-primary transition-all">
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CANCEL MODAL ── */}
      <AnimatePresence>
        {showCancel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111111] uppercase tracking-tight mb-3">Cancel Ride?</h3>
              <p className="text-gray-500 font-medium text-sm mb-8">Are you sure you want to cancel? A cancellation fee may apply as the driver is already en route.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowCancel(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest text-gray-600 hover:bg-gray-200 transition-all">
                  Keep Ride
                </button>
                <Link to="/my-booking" className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-extrabold text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all text-center flex items-center justify-center">
                  Yes, Cancel
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverTracking;
