"use client";
import React, { useEffect, useState } from 'react';
import { Globe, AlertTriangle, CheckCircle, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

// Use the local StatCard component
import StatCard from './StatCard'; 

export default function SeoAnalyticsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeoStats = async () => {
            try {
                // Mocking data for Dashboard so it doesn't crash if API isn't ready
                setStats({
                    avgScore: 92, 
                    totalIndexed: 450, 
                    missingMetaTitle: 0, 
                    missingMetaDesc: 2, 
                    missingAltText: 5,
                    needsAttention: [
                        { id: '123', name: 'Rolex Daytona Platinum', issues: { desc: true, alt: true }, score: 65 }
                    ]
                });
            } catch (err) {
                console.error("Failed to load SEO stats");
            } finally {
                setLoading(false);
            }
        };
        fetchSeoStats();
    }, []);

    if (loading) return (
        <div className="p-12 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-10 bg-[#111] rounded-xl w-64" />
                    <div className="h-4 bg-[#111] rounded-lg w-48" />
                </div>
                <div className="h-20 bg-[#111] rounded-3xl w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-[#111] rounded-[2.5rem]" />)}
            </div>
        </div>
    );

    if (!stats) return (
        <div className="p-20 text-center bg-red-900/10 rounded-[3rem] border border-red-500/20">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-2xl font-serif font-black italic text-red-400">Intelligence Offline</h3>
            <p className="text-red-500/60 text-sm mt-2 font-bold uppercase tracking-widest">Failed to load SEO Dashboard data</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter text-white">SEO Command Center</h2>
                    <p className="text-[#00F0FF] text-xs font-black uppercase tracking-[0.3em] mt-2">Real-time health of your search engine visibility.</p>
                </div>
                <div className={`p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl border ${stats.avgScore >= 80 ? 'bg-green-900/10 border-green-500/30' : 'bg-orange-900/10 border-orange-500/30'}`}>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Site Health Score</p>
                        <p className={`text-4xl font-black font-mono mt-1 ${stats.avgScore >= 80 ? 'text-green-400' : 'text-orange-400'}`}>{stats.avgScore}/100</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stats.avgScore >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}`}>
                        {stats.avgScore >= 80 ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    </div>
                </div>
            </div>

            {/* 📈 CRITICAL STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatCard 
                    icon={<Globe size={24}/>} title="Indexed Pages" value={stats.totalIndexed} trend="Visible to Google" 
                    color="bg-[#111] border border-white/10 text-white"
                />
                <StatCard 
                    icon={<Type size={24}/>} title="Missing Meta Titles" value={stats.missingMetaTitle} trend={stats.missingMetaTitle === 0 ? "Perfect" : "Action Req"} 
                    color="bg-red-900/10 border border-red-500/20 text-red-400"
                />
                <StatCard 
                    icon={<LinkIcon size={24}/>} title="Missing Meta Desc" value={stats.missingMetaDesc} trend="Reduces Rank" 
                    color="bg-orange-900/10 border border-orange-500/20 text-orange-400"
                />
                <StatCard 
                    icon={<ImageIcon size={24}/>} title="Missing Alt Text" value={stats.missingAltText} trend="Image Drop" 
                    color="bg-blue-900/10 border border-blue-500/20 text-[#00F0FF]"
                />
            </div>

            {/* 🚨 NEEDS ATTENTION LIST */}
            <div className="bg-[#111] border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                <h3 className="text-xl font-serif font-black italic tracking-tighter text-white mb-10 flex items-center gap-3 border-b border-white/10 pb-4">
                    <AlertTriangle className="text-[#D4AF37]" size={24} /> Assets Needing Attention
                </h3>
                
                {stats.needsAttention.length === 0 ? (
                    <div className="py-20 text-center bg-black rounded-[2.5rem] border border-dashed border-white/10">
                        <CheckCircle className="mx-auto mb-4 text-[#00F0FF]" size={48}/>
                        <p className="text-gray-400 font-serif italic text-xl">All assets are fully optimized! Great job.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {stats.needsAttention.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-black hover:border-[#D4AF37]/50 border border-white/10 rounded-[2rem] gap-6 transition-all duration-500 group">
                                <div className="flex-1">
                                    <p className="text-sm font-black text-white mb-3 tracking-tight group-hover:text-[#D4AF37] transition-colors">{item.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.issues.title && <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[9px] uppercase font-black tracking-widest rounded-full border border-red-500/20">No Title</span>}
                                        {item.issues.desc && <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-[9px] uppercase font-black tracking-widest rounded-full border border-orange-500/20">No Desc</span>}
                                        {item.issues.alt && <span className="px-3 py-1 bg-[#00F0FF]/10 text-[#00F0FF] text-[9px] uppercase font-black tracking-widest rounded-full border border-[#00F0FF]/20">No Alt Text</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-center">
                                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Health Score</p>
                                        <p className={`text-xl font-black font-mono mt-1 ${item.score >= 80 ? 'text-green-400' : 'text-red-400'}`}>{item.score}%</p>
                                    </div>
                                    <Link href={`/godmode/products/edit/${item.id}`} className="px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Optimize Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}