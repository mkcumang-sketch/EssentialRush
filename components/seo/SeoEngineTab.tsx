"use client";

import React from 'react';
import { motion } from 'framer-motion';
import SeoAnalyticsDashboard from './SeoAnalyticsDashboard';
import { Globe, ShieldCheck, Activity } from 'lucide-react';

export default function SeoEngine() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      key="seo" 
      className="space-y-8 w-full max-w-[100vw] overflow-x-hidden"
    >
      {/* 🚀 J.A.R.V.I.S. Top Core Status Bar */}
      <div className="bg-[#111] border border-[#00F0FF]/30 rounded-[20px] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] relative overflow-hidden">
               <Globe size={20} className="relative z-10" />
               <div className="absolute inset-0 bg-[#00F0FF]/20 blur-md animate-pulse"></div>
            </div>
            <div>
               <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] text-[#00F0FF] flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" /> Global Network Protocol
               </p>
               <p className="text-white text-sm md:text-base font-mono font-bold mt-1">SEO Core Engine Online</p>
            </div>
         </div>
         <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-5 py-3 rounded-xl text-green-400 text-[10px] md:text-xs uppercase font-bold tracking-widest shadow-inner">
            <ShieldCheck size={16} /> <span className="animate-pulse">Synced with Google Index</span>
         </div>
      </div>

      {/* 📊 SEO Command Center */}
      <div className="relative z-10">
        <SeoAnalyticsDashboard />
      </div>

    </motion.div>
  );
}