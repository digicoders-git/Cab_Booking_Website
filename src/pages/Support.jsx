import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaTicketAlt, FaHistory, FaPlus, FaPaperPlane,
  FaClock, FaCheckCircle, FaHeadset, FaShieldAlt,
  FaBolt, FaTimesCircle, FaExclamationCircle
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';

const Support = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
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
      if (data.success) {
        setTickets(data.requests || []);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error(err);
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
    if (p === 'High') return { cls: 'bg-red-500/10 text-red-400 border-red-500/20', icon: FaExclamationCircle };
    if (p === 'Low') return { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: FaCheckCircle };
    return { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: FaBolt };
  };

  const getStatusConfig = (s) => {
    if (s === 'Open') return { cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (s === 'Replied') return { cls: 'bg-primary/10 text-primary border-primary/20' };
    if (s === 'Closed') return { cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    return { cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  };

  return (
    <div className="bg-[#060606] min-h-screen pb-20">
      <PageHeader title="Support Center" breadcrumb="Support" />

      <div className="container mx-auto px-4 max-w-7xl pt-14">

        {/* Hero Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
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
            transition={{ duration: 0.35 }}
          >

            {/* ── CREATE TICKET ── */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Info */}
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

                {/* Right Form */}
                <div className="lg:col-span-8">
                  <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-6 shadow-2xl">

                    <div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-1">Raise a Ticket</h3>
                      <p className="text-white/30 text-xs">Describe your issue clearly so we can help you faster.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. Unable to track my ride"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary focus:bg-white/[0.07] transition-all text-white text-sm font-medium placeholder:text-white/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Priority Level</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary transition-all text-white text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option value="Low" className="bg-[#111]">🟢 Low — General Inquiry</option>
                        <option value="Medium" className="bg-[#111]">🟡 Medium — Booking Issues</option>
                        <option value="High" className="bg-[#111]">🔴 High — Safety / Payment</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Message</label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        placeholder="Describe your issue in detail..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-primary focus:bg-white/[0.07] transition-all text-white text-sm font-medium placeholder:text-white/20 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
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
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 bg-primary text-black font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all"
                    >
                      <FaPlus size={10} /> Create Ticket
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-primary/10 border-b border-primary/20">
                      <span className="text-primary text-[9px] font-black uppercase tracking-widest">Ticket ID / Subject</span>
                      <span className="text-primary text-[9px] font-black uppercase tracking-widest">Message</span>
                      <span className="text-primary text-[9px] font-black uppercase tracking-widest">Priority</span>
                      <span className="text-primary text-[9px] font-black uppercase tracking-widest">Date</span>
                      <span className="text-primary text-[9px] font-black uppercase tracking-widest">Status</span>
                    </div>

                    {/* Table Rows */}
                    {tickets.map((ticket, idx) => {
                      const pc = getPriorityConfig(ticket.priority);
                      const sc = getStatusConfig(ticket.status);
                      return (
                        <motion.div
                          key={ticket._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-all items-center ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                        >
                          {/* Ticket ID + Subject */}
                          <div>
                            <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-1">
                              #{(ticket.ticketId || ticket._id?.slice(-6) || '').toUpperCase()}
                            </p>
                            <p className="text-white font-bold text-sm leading-snug line-clamp-1">{ticket.subject}</p>
                            {ticket.adminReply && (
                              <div className="mt-2 flex items-center gap-1.5 text-primary text-[9px] font-black uppercase tracking-widest">
                                <FaHeadset size={8} /> Agent Replied
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{ticket.message}</p>

                          {/* Priority */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit ${pc.cls}`}>
                            <pc.icon size={8} /> {ticket.priority}
                          </span>

                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold">
                            <FaClock size={9} className="text-primary/50" />
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>

                          {/* Status */}
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit ${sc.cls}`}>
                            {ticket.status}
                          </span>
                        </motion.div>
                      );
                    })}

                    {/* Table Footer */}
                    <div className="px-6 py-4 bg-black/40 flex items-center justify-between">
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                        Total: {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="inline-flex items-center gap-2 bg-primary text-black font-black px-5 py-2 rounded-xl text-[9px] uppercase tracking-widest hover:bg-yellow-400 transition-all"
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
