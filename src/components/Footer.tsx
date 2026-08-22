import React from 'react';
import { Compass, Code, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-slate-100 tracking-tight">GlobeTrotter</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering personalized travel planning with intelligent itinerary building, automated cost estimates, and collaborative sharing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Explore Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Interactive Itinerary Builder</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">City & Destination Discovery</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Budget & Expense Breakdown</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Timeline & Calendar Views</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Community & Sharing</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Public Trip Gallery</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Fork & Copy Itineraries</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Collaborative Multi-City Plans</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Supabase Cloud Sync</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Odoo Hackathon 2026</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Built with React, Supabase, Tailwind CSS, Recharts, and TypeScript.
            </p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg text-teal-400 border border-slate-800">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GlobeTrotter Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for global travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
