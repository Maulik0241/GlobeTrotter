import React from 'react';
import { Compass, Code, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] dark:bg-[#080E14] border-t border-[#DDE5E8] dark:border-white/10 text-[#6C7E8B] dark:text-[#94A3B8] py-12 mt-20 transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#FF7A00] flex items-center justify-center text-white dark:text-slate-950 shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-[#1A2B32] dark:text-[#F8FAFC] tracking-tight font-header">
                GlobeTrotter
              </span>
            </div>
            <p className="text-xs text-[#6C7E8B] dark:text-[#94A3B8] leading-relaxed">
              Empowering personalized travel planning with intelligent itinerary building, automated cost estimates, and collaborative sharing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2B32] dark:text-[#F8FAFC] mb-3 font-header">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Interactive Itinerary Builder</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">City & Destination Discovery</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Budget & Expense Breakdown</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Timeline & Calendar Views</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2B32] dark:text-[#F8FAFC] mb-3 font-header">
              Community & Sharing
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Public Trip Gallery</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Fork & Copy Itineraries</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Collaborative Multi-City Plans</span></li>
              <li><span className="hover:text-[#007A87] dark:hover:text-[#00E5FF] transition-colors cursor-pointer">Realtime Cloud Sync</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2B32] dark:text-[#F8FAFC] mb-3 font-header">
              Odoo Hackathon 2026
            </h4>
            <p className="text-xs text-[#6C7E8B] dark:text-[#94A3B8] mb-3 leading-relaxed">
              Built with React, Supabase, Tailwind CSS, Recharts, and TypeScript.
            </p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#EAEFEF] dark:bg-[#12181F] rounded-xl text-[#007A87] dark:text-[#00E5FF] border border-[#DDE5E8] dark:border-white/10">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#DDE5E8] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6C7E8B] dark:text-[#94A3B8]">
          <p>© 2026 GlobeTrotter Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for global travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
