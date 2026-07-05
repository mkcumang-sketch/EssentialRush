"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, CreditCard, Wallet, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useHydratedCart } from '@/store/cartStoretemp'; 

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, _hasHydrated, clearCart } = useHydratedCart();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  // Address Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Calculations
  const subtotal = (items || []).reduce((acc, item) => acc + ((item.offerPrice || item.price || 0) * (item.qty || item.quantity || 1)), 0);
  const shipping = subtotal > 10000 ? 0 : 500; // Free shipping above 10k
  const walletBalance = (session?.user as any)?.walletBalance || 0;
  const discount = useWallet ? Math.min(walletBalance, subtotal * 0.1) : 0; // Max 10% of subtotal can be paid via wallet
  const total = subtotal + shipping - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // 1. Order Payload - Backend Schema ke hisaab se exact match
      const orderPayload = {
        userId: (session?.user as any)?.id || null, // User ID bhejna zaroori hai wallet deduction ke liye
        customerInfo: formData,
        orderItems: items,
        subtotal: subtotal,
        shippingFee: shipping,
        discount: discount,
        totalAmount: total,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        useWallet: useWallet
      };

      // 2. Asli Backend API ko call kar rahe hain
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        setStep(3); // Success Screen dikhao
        clearCart(); // Cart clear karo
      } else {
        const errorData = await res.json();
        console.error("Backend Error:", errorData);
        alert("Order failed to save. Check console for details.");
      }
    } catch (error) {
      console.error("Order processing error:", error);
      alert("Network error while placing order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🚀 HYDRATION CHECK: Server-Side mismatches roko
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F7]">
         <div className="animate-pulse w-12 h-12 bg-black text-[#D4AF37] rounded-2xl flex items-center justify-center font-black text-xl mb-4">♞</div>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Securing Checkout...</p>
      </div>
    );
  }

  // Agar cart khali hai
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
          <ShieldCheck size={32} className="text-[#D4AF37]" />
        </div>
        <h2 className="text-3xl font-serif italic text-black mb-4">Your Vault is Empty</h2>
        <p className="text-gray-500 mb-8 text-sm">Add some luxury timepieces to proceed to checkout.</p>
        <Link href="/" className="bg-black text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors">
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#050505] font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 h-20 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </Link>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-[#D4AF37] rounded-lg flex items-center justify-center font-black text-sm">♞</div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] hidden sm:block">Secure Checkout</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">SSL Secured</span>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <AnimatePresence mode="wait">
          {step === 3 ? (
            /* SUCCESS SCREEN */
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-gray-100 mt-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 size={48} className="text-green-500" />
              </motion.div>
              <h2 className="text-4xl font-serif italic text-black mb-4">Order Secured</h2>
              <p className="text-gray-500 mb-8">Your luxury timepiece will be prepared and shipped shortly. An email confirmation has been sent.</p>
              <div className="bg-gray-50 p-6 rounded-2xl mb-10 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Reference</p>
                <p className="font-mono font-bold text-lg text-black">#RUSH-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <Link href="/" className="bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors">
                Return to Home
              </Link>
            </motion.div>
          ) : (
            /* CHECKOUT SPLIT SCREEN */
            <motion.div 
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-10 xl:gap-16"
            >
              
              {/* LEFT SIDE: FORM */}
              <div className="flex-1">
                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8">
                  <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
                    <MapPin className="text-[#D4AF37]" size={24} />
                    Shipping Details
                  </h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Complete Address</label>
                      <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">City</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                        <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Loyalty Wallet Section */}
                {session && walletBalance > 0 && (
                  <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Wallet size={120} />
                    </div>
                    <h3 className="text-xl font-serif italic mb-2 relative z-10 flex items-center gap-3">
                      <Wallet className="text-[#D4AF37]" size={24} />
                      Luxury Vault Points
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 relative z-10">Balance is <span className="text-[#D4AF37] font-bold">₹{walletBalance.toLocaleString()}</span></p>
                    
                    <label className="flex items-center gap-4 cursor-pointer relative z-10 group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${useWallet ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600 group-hover:border-[#D4AF37]'}`}>
                        {useWallet && <CheckCircle2 size={16} className="text-black" />}
                      </div>
                      <span className="text-sm font-medium">Apply Vault Points (Max 10% of order value)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: ORDER SUMMARY */}
              <div className="lg:w-[450px] flex-shrink-0">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-32">
                  <h3 className="text-xl font-serif italic mb-8 border-b border-gray-100 pb-6">Order Summary</h3>
                  
                  <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id || item._id} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 flex-shrink-0">
                           <img src={item.images?.[0] || item.imageUrl || '/placeholder.png'} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">{item.brand}</p>
                          <p className="text-sm font-bold leading-tight mb-2 line-clamp-2">{item.name || item.title}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Qty: {item.qty || item.quantity || 1}</span>
                            <span className="font-black font-serif">₹{((item.offerPrice || item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-4 mb-8">
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-black">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Secured Shipping</span>
                      <span className="text-black">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                    </div>
                    {useWallet && discount > 0 && (
                      <div className="flex justify-between text-sm font-medium text-[#D4AF37]">
                        <span>Vault Points Applied</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Acquisition</span>
                      <span className="text-3xl font-serif font-black text-black">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="w-full bg-[#0A0A0A] text-[#D4AF37] py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                        <ShieldCheck size={20} />
                      </motion.div>
                    ) : (
                      <>
                        <CreditCard size={20} /> Pay Securely
                      </>
                    )}
                  </button>
                  <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                     <ShieldCheck size={14} />
                     <p className="text-[9px] uppercase tracking-widest font-bold">256-bit Encryption • Secure Gateway</p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}