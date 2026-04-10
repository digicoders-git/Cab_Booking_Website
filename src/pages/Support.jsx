import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaTicketAlt, FaHistory, FaPlus, FaPaperPlane,
  FaClock, FaCheckCircle, FaHeadset, FaShieldAlt,
  FaBolt, FaExclamationCircle, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';

const Support = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'Medium' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'history') fetchTickets();
  }, [activeTab]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/support/my-tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      // 🔍 DEBUG — Console mein dekho exact structure
      console.log('✅ Full API Response:', data);
      const list = data.requests || data.tickets || data.data || [];
      if (list.length > 0) {
        console.log('✅ First Ticket Keys:', Object.keys(list[0]));
        console.log('✅ First Ticket Full:', list[0]);
        console.log('🔍 adminReply:', list[0]?.adminReply);
        console.log('🔍 reply:', list[0]?.reply);
        console.log('🔍 response:', list[0]?.response);
        console.log('🔍 adminResponse:', list[0]?.adminResponse);
      }

      if (data.success) {
        setTickets(list);
        // Auto expand first ticket
        if (list.length > 0) setExpandedId(list[0]._id);
      } else {
        console.error('❌ API Error:', data.message);
        setTickets([]);
      }
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      Swal.fire({ icon: 'error', title: 'Login Required', text: 'Please login to raise a ticket.', confirmButtonColor: '#FFD60A' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/support/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: 'Ticket Raised!', text: 'Our team will respond within 4-6 hours.', confirmButtonColor: '#FFD60A' });
        setFormData({ subject: '', message: '', priority: 'Medium' });
        setActiveTab('history');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Something went wrong.', confirmButtonColor: '#ef4444' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Connection failed.', confirmButtonColor: '#ef4444' });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (p) => {
    if (p === 'High') return { cls: 'bg-red-500/10 text-red-400 border-red-500/20', strip: 'bg-red-500', icon: FaExclamationCircle };
    if (p === 'Low') return { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', strip: 'bg-emerald-500', icon: FaCheckCircle };
    return { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', strip: 'bg-amber-400', icon: FaBolt };
  };

  const getStatusConfig = (s) => {
    if (s === 'Open') return { cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' };
    if (s === 'Replied') return { cls: 'bg-primary/10 text-primary border-primary/20', dot: 'bg-primary' };
    if (s === 'Closed') return { cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' };
    return { cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' };
  };

  // Saare possible admin reply field names handle karo
  const getAdminReply = (ticket) =>
    ticket.adminReply || ticket.reply || ticket.response ||
    ticket.adminResponse || ticket.replyMessage || ticket.agentReply || null;

  return (
    <div className="bg-[#060606] min-h-screen pb-20">
      <PageHeader title="Support Center" breadcrumb="Support" />

      <div className="container mx-auto px-4 max-w-5xl pt-14">

        {/* Hero Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: FaHeadset, title: '24/7 Support', desc: 'Always available for you', color: 'text-primary' },
            { icon: FaClock, title: '4-6 Hrs Response', desc: 'Average reply time', color: 'text-amber-400' },
            { icon: FaShieldAlt, title: 'Secure & Private', desc: 'Your data is safe', color: 'text-emerald-400' },
          ].map((item, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl px-6 py-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color} text-xl shrink-0`}>
                <item.icon />
              </div>
              <div>
                <p className="text-white font-black text-sm">{item.title}</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-[#111] p-1.5 rounded-2xl mb-10 border border-white/5 shadow-xl max-w-sm">
          {[
            { key: 'create', label: 'New Ticket', icon: FaPlus },
            { key: 'history', label: 'My Tickets', icon: FaHistory },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-primary text-black shadow-lg' : 'text-white/30 hover:text-white/60'}`}
            >
              <tab.icon size={11} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >

            {/* ── CREATE TICKET ── */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-6">
                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary text-2xl">
                      <FaHeadset />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-1">How it works</h3>
                      <p className="text-white/30 text-xs leading-relaxed mb-6">Follow these simple steps to get help fast.</p>
                      <ul className="space-y-5">
                        {[
                          'Fill the form with your issue and select priority.',
                          'Our agents review your request within 4-6 hours.',
                          'You get notified once an agent replies.',
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-[10px] font-black shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed">{step}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <FaClock />
                    </div>
                    <div>
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Avg Response Time</p>
                      <p className="text-white font-black text-2xl tracking-tighter">4–6 <span className="text-primary text-base">Hours</span></p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-6 shadow-2xl">
                    <div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-1">Raise a Ticket</h3>
                      <p className="text-white/30 text-xs">Describe your issue clearly so we can help you faster.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Subject</label>
                      <input type="text" name="subject" required placeholder="e.g. Unable to track my ride"
                        value={formData.subject} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary focus:bg-white/[0.07] transition-all text-white text-sm font-medium placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Priority Level</label>
                      <select name="priority" value={formData.priority} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary transition-all text-white text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option value="Low" className="bg-[#111]">🟢 Low — General Inquiry</option>
                        <option value="Medium" className="bg-[#111]">🟡 Medium — Booking Issues</option>
                        <option value="High" className="bg-[#111]">🔴 High — Safety / Payment</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Message</label>
                      <textarea name="message" required rows="5" placeholder="Describe your issue in detail..."
                        value={formData.message} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary focus:bg-white/[0.07] transition-all text-white text-sm font-medium placeholder:text-white/20 resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" disabled={loading}
                        className="flex items-center gap-3 bg-primary text-black font-black py-4 px-10 rounded-2xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      >
                        {loading ? 'Submitting...' : 'Raise Ticket'} <FaPaperPlane size={13} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── TICKET HISTORY ── */}
            {activeTab === 'history' && (
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <FaTicketAlt className="text-primary text-4xl animate-pulse" />
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Loading Tickets...</p>
                  </div>
                ) : (!tickets || tickets.length === 0) ? (
                  <div className="bg-[#111] border border-white/5 rounded-[2rem] p-20 text-center">
                    <FaHistory className="text-white/10 text-5xl mx-auto mb-6" />
                    <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">No Tickets Yet</h3>
                    <p className="text-white/30 text-sm mb-8 max-w-xs mx-auto leading-relaxed">You haven't raised any support tickets. Create one if you need help.</p>
                    <button onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 bg-primary text-black font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all"
                    >
                      <FaPlus size={10} /> Create Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket, idx) => {
                      const pc = getPriorityConfig(ticket.priority);
                      const sc = getStatusConfig(ticket.status);
                      const adminReply = getAdminReply(ticket);
                      const isOpen = expandedId === ticket._id;

                      return (
                        <motion.div
                          key={ticket._id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all"
                        >
                          {/* Priority Strip */}
                          <div className={`h-[3px] w-full ${pc.strip}`} />

                          {/* ── Ticket Header (always visible) ── */}
                          <div
                            className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none"
                            onClick={() => setExpandedId(isOpen ? null : ticket._id)}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Status dot */}
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${sc.dot} ${ticket.status === 'Open' ? 'animate-pulse' : ''}`} />
                              <div className="min-w-0">
                                <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-0.5">
                                  #{(ticket.ticketId || ticket._id?.slice(-6) || '').toUpperCase()}
                                </p>
                                <h4 className="text-white font-black text-sm truncate">{ticket.subject}</h4>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Admin replied badge */}
                              {adminReply && (
                                <span className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                  <FaHeadset size={8} /> Replied
                                </span>
                              )}
                              <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${sc.cls}`}>
                                {ticket.status}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${pc.cls}`}>
                                <pc.icon size={8} /> {ticket.priority}
                              </span>
                              <div className="w-7 h-7 bg-white/5 rounded-xl flex items-center justify-center text-white/30 ml-1">
                                {isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                              </div>
                            </div>
                          </div>

                          {/* ── Expanded Chat View ── */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-white/5 bg-[#0a0a0a]">

                                  {/* Date */}
                                  <div className="flex justify-center py-4">
                                    <span className="bg-white/5 border border-white/5 text-white/20 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                      <FaClock size={8} />
                                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>

                                  <div className="px-6 pb-6 space-y-4">

                                    {/* User Message — LEFT side */}
                                    <div className="flex items-end gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/40 shrink-0 text-xs font-black">
                                        U
                                      </div>
                                      <div className="max-w-[80%]">
                                        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">You</p>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                                          <p className="text-white/80 text-sm leading-relaxed">{ticket.message}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Admin Reply — RIGHT side */}
                                    {adminReply ? (
                                      <div className="flex items-end gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black shrink-0">
                                          <FaHeadset size={12} />
                                        </div>
                                        <div className="max-w-[80%]">
                                          <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-1.5 mr-1 text-right">KwikCabs Support</p>
                                          <div className="bg-primary/10 border border-primary/30 rounded-2xl rounded-br-sm px-5 py-4">
                                            <p className="text-white text-sm leading-relaxed">{adminReply}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Awaiting reply */
                                      <div className="flex justify-center">
                                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-3">
                                          <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                          </div>
                                          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Awaiting admin reply...</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}

                    {/* Footer */}
                    <div className="flex items-center justify-between px-2 pt-2">
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                        Total: {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                      </span>
                      <button onClick={() => setActiveTab('create')}
                        className="inline-flex items-center gap-2 bg-primary text-black font-black px-5 py-2.5 rounded-xl text-[9px] uppercase tracking-widest hover:bg-yellow-400 transition-all"
                      >
                        <FaPlus size={8} /> New Ticket
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Support;
