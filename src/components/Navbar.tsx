import React, { useState } from 'react';
import { Compass, Plus, User, LogOut, Shield, Database, ChevronDown, Menu, X, MapPin, Calendar, LayoutGrid, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openCreateModal }) => {
  const { user, logout, setAuthModalOpen, setAuthMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isConnected = isSupabaseConfigured();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'my-trips', label: 'My Trips', icon: LayoutGrid },
    { id: 'cities', label: 'City Search', icon: MapPin },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'admin', label: 'Admin Stats', adminOnly: true, icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-900/80 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 transition-all shadow-md">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setCurrentTab('dashboard')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-all">
              <Compass className="w-6 h-6 text-slate-950 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                GlobeTrotter
              </span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                Personalized Travel
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/90 shadow-inner">
            {navItems.map((item) => {
              if (item.adminOnly && !user?.is_admin) return null;
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/25 scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-teal-500 dark:text-teal-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Theme Switcher Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-all shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Supabase status indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className="text-[11px] font-semibold">
                {isConnected ? 'Supabase Connected' : 'Local Storage Mode'}
              </span>
            </div>

            {/* Plan New Trip CTA */}
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all transform hover:scale-[1.03] shadow-lg shadow-teal-500/30 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Plan Trip</span>
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.full_name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-teal-500/30"
                  />
                  <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Logged in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-teal-500" />
                      <span>User Profile & Settings</span>
                    </button>

                    {user.is_admin && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-cyan-500" />
                        <span>Admin Insights</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-400 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {navItems.map((item) => {
              if (item.adminOnly && !user?.is_admin) return null;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold ${
                    currentTab === item.id
                      ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
