import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaArrowDown, FaArrowUp, FaHistory, FaSearch, FaFilter } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';
import Loader from '../components/Loader';

const MyTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/wallet/my-wallet`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setTransactions(data.transactions || []);
                setBalance(data.walletBalance || 0);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredData = transactions.filter(t => {
        if (filter === 'All') return true;
        return t.type === filter;
    });

    if (loading) return <Loader />;

    return (
        <div className="bg-[#060606] min-h-screen text-white pb-24">
            <PageHeader title="Transaction History" breadcrumb="Wallet / History" />

            <div className="container mx-auto px-4 max-w-6xl mt-12 sm:mt-16 pt-4 sm:pt-0">
                
                {/* ── Wallet Overview ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    <div className="md:col-span-1 bg-gradient-to-br from-primary to-yellow-600 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <FaWallet className="text-black/40 text-4xl mb-4" />
                        <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Available Balance</p>
                        <h2 className="text-black font-black text-4xl italic">₹{balance.toLocaleString()}</h2>
                    </div>

                    <div className="md:col-span-2 bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-white font-black text-xl uppercase tracking-tight">Audit History</h4>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Track your ride payments and refunds</p>
                        </div>
                        <div className="flex gap-2">
                            {['All', 'Credit', 'Debit'].map(opt => (
                                <button 
                                    key={opt}
                                    onClick={() => setFilter(opt)}
                                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                                        filter === opt ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Transaction Table ── */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Transaction ID / Ref</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Description</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.length > 0 ? (
                                    filteredData.map((t, i) => (
                                        <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs ${
                                                        t.type === 'Credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                        {t.type === 'Credit' ? <FaArrowDown /> : <FaArrowUp />}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-[11px] uppercase tracking-widest">#{t._id.slice(-8).toUpperCase()}</p>
                                                        <p className={`text-[9px] font-bold uppercase tracking-widest ${
                                                            t.status === 'Completed' ? 'text-emerald-400/60' : 'text-yellow-400/60'
                                                        }`}>{t.status}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-white/60 text-[11px] font-medium max-w-xs">{t.description}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-white/30 text-[10px] font-bold">
                                                    {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-white/10 text-[9px] font-bold">
                                                    {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`text-lg font-black italic ${
                                                    t.type === 'Credit' ? 'text-emerald-400' : 'text-white'
                                                }`}>
                                                    {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="space-y-4">
                                                <FaHistory className="text-white/10 text-5xl mx-auto" />
                                                <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.3em]">No transactions found in your history</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MyTransactions;
