import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { CityCard } from '../components/CityCard';

export const UserProfile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { cities } = useTrips();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [language, setLanguage] = useState(user?.language_preference || 'English');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Please Sign In</h3>
        <p className="text-xs text-slate-400">Log in to manage your traveler profile and saved destinations.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      language_preference: language,
      avatar_url: avatarUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const savedCityItems = cities.filter((c) => user.saved_destinations?.includes(c.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      
      <div>
        <h1 className="text-3xl font-black text-slate-100">User Profile & Travel Preferences</h1>
        <p className="text-xs text-slate-400">Manage your personal information and saved destinations</p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <img
            src={avatarUrl || user.avatar_url}
            alt={user.full_name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-teal-500/20"
          />
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            {user.is_admin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold">
                <Shield className="w-3 h-3" /> Admin Account
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language Preference</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="English">English (US)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
          >
            Sign Out
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Saved Destinations */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-teal-400" />
          <span>Saved Destination Bookmarks ({savedCityItems.length})</span>
        </h3>

        {savedCityItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
            No saved destinations yet. Click the bookmark icon on any city card to save it here!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCityItems.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
