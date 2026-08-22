import React from 'react';
import { Compass, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const handleNav = (tab: string) => {
    if (setCurrentTab) {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#FFFFFF] dark:bg-[#080E14] border-t border-[#DDE5E8] dark:border-white/10 text-[#6C7E8B] dark:text-[#94A3B8] py-6 mt-16 transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Logo & Copyright */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNav('dashboard')}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#FF7A00] flex items-center justify-center text-white dark:text-slate-950 shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#1A2B32] dark:text-[#F8FAFC] tracking-tight font-header">
              GlobeTrotter
            </span>
          </div>
          <span className="text-theme-muted hidden sm:inline">•</span>
          <p>© 2026 GlobeTrotter Inc. All rights reserved.</p>
        </div>

        {/* Crafted with love */}
        <div className="flex items-center gap-1 font-medium text-xs text-[#6C7E8B] dark:text-[#94A3B8]">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for global travelers</span>
        </div>

      </div>
    </footer>
  );
};
