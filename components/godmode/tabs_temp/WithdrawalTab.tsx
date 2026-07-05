"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Landmark, CreditCard, Clock, CheckCircle, XCircle, 
  RefreshCw, Search, User 
} from "lucide-react";

export default function WithdrawalTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [toast, setToast] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/withdrawals');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        notify("Failed to load requests");
      }
    } catch (error) {
      notify("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests based on Active Tab
  const filteredRequests = requests.filter(req => req.status === activeTab);

  // 🚀 ASLI FUNCTION: API call ke saath jo wallet balance minus karega
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, status: newStatus })
      });
      
      const data = await res.json();

      if (data.success) {
        // UI mein turant status update kar do
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
        
        // Success Message
        if (newStatus === 'APPROVED') {
            notify(`Approved! ₹ deducted from user's vault.`);
        } else {
            notify(`Request marked as REJECTED.`);
        }
      } else {
        notify(data.error || "Failed to update status");
      }
    } catch (error) {
      notify("Network error while updating.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 w-full">
      
      {/* Dynamic Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-8 left-1/2 z-[200] bg-[#141414] border border-[#D4AF37]/30 text-white px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl">
            <CheckCircle size={18} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Financial Logistics Card & Tabs */}
      <div className="bg-[#111] border border-white/10 rounded-[20px] md:rounded-[30px] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_10px_40px_rgba(212,175,55,0.05)]">
          <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                  <Landmark size={28} />
              </div>
              <div>
                  <h2 className="text-xl md:text-2xl font-bold font-serif text-white">Financial Logistics</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage reward withdrawals and treasury outflows.</p>
              </div>
          </div>

          <div className="flex bg-black p-2 rounded-2xl border border-white/10 w-full lg:w-auto">
              {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                  <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
          {loading ? (
              <div className="text-center py-20">
                  <RefreshCw size={32} className="animate-spin text-[#D4AF37] mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">Loading Treasury Data...</p>
              </div>
          ) : filteredRequests.length === 0 ? (
              <div className="text-center py-24 bg-[#111] border border-white/10 rounded-[30px]">
                  <Search size={48} className="text-gray-800 mx-auto mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-500">NO {activeTab} REQUESTS</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredRequests.map((req) => (
                      <div key={req._id} className="bg-[#111] border border-white/10 hover:border-[#D4AF37]/50 transition-colors rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between">
                          
                          {/* Top Row: User Info & Amount */}
                          <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                              <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-2 flex items-center gap-2"><Clock size={12}/> {new Date(req.createdAt).toLocaleDateString()}</p>
                                  <h4 className="text-lg font-bold flex items-center gap-2 text-white"><User size={16} className="text-gray-500"/> {req.userEmail}</h4>
                                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {req.userId}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Requested Amount</p>
                                  <h3 className="text-3xl font-serif font-black italic text-[#D4AF37]">₹{req.amount?.toLocaleString()}</h3>
                              </div>
                          </div>

                          {/* Middle Row: Bank Details */}
                          <div className="bg-black p-5 rounded-2xl border border-white/5 mb-6">
                              <div className="flex items-center gap-3 mb-4">
                                  {req.paymentMethod?.type === 'upi' ? <CreditCard size={18} className="text-[#D4AF37]"/> : <Landmark size={18} className="text-[#D4AF37]"/>}
                                  <h5 className="text-sm font-black uppercase tracking-widest text-white">{req.paymentMethod?.type === 'upi' ? 'UPI Transfer' : 'Bank Transfer'}</h5>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {req.paymentMethod?.type === 'upi' ? (
                                      <div className="col-span-full">
                                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">UPI ID</p>
                                          <p className="font-mono text-sm bg-[#141414] p-3 rounded-lg border border-white/10 text-white">{req.paymentMethod?.details?.upiId || "N/A"}</p>
                                      </div>
                                  ) : (
                                      <>
                                          <div className="col-span-full">
                                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Account Name</p>
                                              <p className="text-sm font-bold bg-[#141414] p-3 rounded-lg border border-white/10 text-white">{req.paymentMethod?.details?.accountName || "N/A"}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Account Number</p>
                                              <p className="font-mono text-sm bg-[#141414] p-3 rounded-lg border border-white/10 text-white">{req.paymentMethod?.details?.accountNumber || "N/A"}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">IFSC Code</p>
                                              <p className="font-mono text-sm uppercase bg-[#141414] p-3 rounded-lg border border-white/10 text-white">{req.paymentMethod?.details?.ifsc || "N/A"}</p>
                                          </div>
                                      </>
                                  )}
                              </div>
                          </div>

                          {/* Bottom Row: Actions */}
                          {activeTab === 'PENDING' ? (
                              <div className="flex gap-3 mt-auto">
                                  <button 
                                      onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                                      disabled={actionLoading === req._id}
                                      className="flex-1 py-4 rounded-xl border border-red-900/50 text-red-500 hover:bg-red-950 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2"
                                  >
                                      {actionLoading === req._id ? <RefreshCw size={16} className="animate-spin"/> : <XCircle size={16}/>} Reject
                                  </button>
                                  <button 
                                      onClick={() => handleUpdateStatus(req._id, 'APPROVED')}
                                      disabled={actionLoading === req._id}
                                      className="flex-1 py-4 rounded-xl bg-[#D4AF37] text-black hover:bg-white text-[10px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-lg"
                                  >
                                      {actionLoading === req._id ? <RefreshCw size={16} className="animate-spin"/> : <CheckCircle size={16}/>} Approve & Pay
                                  </button>
                              </div>
                          ) : (
                              <div className={`mt-auto py-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border ${activeTab === 'APPROVED' ? 'bg-green-950/30 border-green-900/50 text-green-500' : 'bg-red-950/30 border-red-900/50 text-red-500'}`}>
                                  Status: {req.status}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}
      </div>
    </motion.div>
  );
}