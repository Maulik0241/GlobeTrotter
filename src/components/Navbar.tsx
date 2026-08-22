import React, { useState, useEffect, useRef } from 'react';
import { Compass, User, LogOut, Shield, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
}

const getInitials = (name?: string): string => {
  if (!name) return 'GT';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const Navbar: React.FC<NavbarProps> = ({ setCurrentTab }) => {
  const { user, logout, setAuthModalOpen, setAuthMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#FFFFFF]/90 dark:bg-[#12181F]/90 border-b border-[#DDE5E8] dark:border-white/10 text-[#1A2B32] dark:text-[#F8FAFC] transition-all shadow-sm">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setCurrentTab('dashboard')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#FF7A00] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
              <Compass className="w-6 h-6 text-white dark:text-slate-950 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight font-header bg-gradient-to-r from-[#007A87] to-[#0052CC] dark:from-[#00E5FF] dark:to-[#22C55E] bg-clip-text text-transparent">
                GlobeTrotter
              </span>
            </div>
          </div>

          {/* Right Header Actions: Theme Switcher & Profile Avatar ◯ */}
          <div className="flex items-center gap-3">
            
            {/* Theme Switcher Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-[#EAEFEF] dark:bg-[#080E14] border border-[#DDE5E8] dark:border-white/10 text-[#1A2B32] dark:text-[#F8FAFC] hover:scale-105 transition-all shadow-sm cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#FF9900]" />
              ) : (
                <Moon className="w-5 h-5 text-[#0052CC]" />
              )}
            </button>

            {/* User Profile Circle Avatar ◯ or Initials Badge (e.g. MP) */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full bg-[#EAEFEF] dark:bg-[#080E14] hover:bg-[#DDE5E8] dark:hover:bg-slate-800 transition-colors border border-[#DDE5E8] dark:border-white/10 cursor-pointer"
                  title="User Account Menu"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#007A87] to-[#00E5FF] text-white flex items-center justify-center font-black text-xs ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-md">
                      {getInitials(user.full_name)}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-[#6C7E8B] dark:text-[#94A3B8] transition-transform duration-300 ${
                      userDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#12181F] border border-[#DDE5E8] dark:border-white/10 rounded-3xl shadow-2xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-3 border-b border-[#DDE5E8] dark:border-white/10 flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#007A87] to-[#00E5FF] text-white flex items-center justify-center font-black text-xs ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shrink-0 shadow-md">
                          {getInitials(user.full_name)}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#1A2B32] dark:text-[#F8FAFC] truncate">{user.full_name}</p>
                        <p className="text-[11px] text-[#6C7E8B] dark:text-[#94A3B8] truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#1A2B32] dark:text-[#F8FAFC] hover:bg-[#F4F7F6] dark:hover:bg-slate-800 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('my-trips');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#1A2B32] dark:text-[#F8FAFC] hover:bg-[#F4F7F6] dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                      <span>My Trips</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#1A2B32] dark:text-[#F8FAFC] hover:bg-[#F4F7F6] dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                      <span>User Profile & Settings</span>
                    </button>

                    {user.is_admin && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#1A2B32] dark:text-[#F8FAFC] hover:bg-[#F4F7F6] dark:hover:bg-slate-800 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#0052CC] dark:text-[#22C55E]" />
                        <span>Admin Insights</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-[#DDE5E8] dark:border-white/10"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-[#FF5A5F] dark:text-[#FF3366] hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#1A2B32] dark:text-[#F8FAFC] hover:bg-[#EAEFEF] dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#EAEFEF] dark:bg-slate-800 text-[#1A2B32] dark:text-[#F8FAFC] border border-[#DDE5E8] dark:border-slate-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
