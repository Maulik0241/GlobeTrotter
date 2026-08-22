import React, { useState } from 'react';
import { User, CheckCircle2, Shield, Calendar, Eye, LogOut, Camera, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import type { Trip } from '../types';

interface UserProfileProps {
  setCurrentTab?: (tab: string) => void;
}

const getInitials = (name?: string): string => {
  if (!name) return 'GT';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const UserProfile: React.FC<UserProfileProps> = ({ setCurrentTab }) => {
  const { user, updateProfile, logout } = useAuth();
  const { trips, setSelectedTripId } = useTrips();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [language, setLanguage] = useState(user?.language_preference || 'English');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="w-full text-center py-20 glass-panel rounded-3xl space-y-4 border border-theme bg-theme-card">
        <h3 className="text-xl font-bold text-theme-main font-header">Please Sign In</h3>
        <p className="text-xs text-theme-muted">Log in to view your profile and managed trips.</p>
      </div>
    );
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const newUrl = reader.result as string;
        setAvatarUrl(newUrl);
        updateProfile({ avatar_url: newUrl });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAvatarUrl('');
    updateProfile({ avatar_url: '' });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      language_preference: language,
      avatar_url: avatarUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Categorize trips into Preplanned Trips (upcoming/ongoing) & Previous Trips (completed) (Screen 7 Wireframe)
  const now = new Date();
  const preplannedTrips: Trip[] = [];
  const previousTrips: Trip[] = [];

  trips.forEach((trip) => {
    const end = new Date(trip.end_date);
    if (end < now) {
      previousTrips.push(trip);
    } else {
      preplannedTrips.push(trip);
    }
  });

  const renderTripPortraitCard = (trip: Trip) => (
    <div
      key={trip.id}
      className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-theme bg-theme-card shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[440px] group"
    >
      {/* Cover Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={trip.cover_photo}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <h4 className="text-xl font-bold text-white font-header group-hover:text-[#00E5FF] transition-colors line-clamp-1">
            {trip.name}
          </h4>
          <p className="text-xs text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{trip.start_date} ~ {trip.end_date}</span>
          </p>
        </div>
      </div>

      {/* Card Details & View Button (Screen 7 Wireframe Match) */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
          {trip.description}
        </p>

        <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-theme-subtle border border-theme">
          <span className="text-theme-muted font-semibold">Budget</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">${trip.total_budget}</span>
        </div>

        <button
          onClick={() => {
            setSelectedTripId(trip.id);
            if (setCurrentTab) setCurrentTab('itinerary-view');
          }}
          className="w-full py-3 rounded-2xl bg-theme-subtle hover:bg-[#007A87]/15 dark:hover:bg-[#00E5FF]/15 text-theme-main hover:text-[#007A87] dark:hover:text-[#00E5FF] border border-theme text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-12 pb-24 animate-fade-in relative">
      
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-theme-muted mt-1">Manage personal info, preplanned trips, and previous travel history.</p>
      </div>

      {/* 2. User Profile Box (Screen 7 Wireframe Top Card) */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-theme shadow-2xl bg-theme-card w-full">
        <form onSubmit={handleSave} className="space-y-6">
          
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-5 h-5" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            
            {/* Left: Circle Avatar (Image or Name Initials Badge e.g. MP) */}
            <div className="flex flex-col items-center space-y-3 shrink-0">
              <label className="relative group cursor-pointer" title="Click to upload profile photo">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || user.full_name}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover ring-4 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-2xl group-hover:opacity-85 transition-all"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#0052CC] text-white flex items-center justify-center font-black text-4xl sm:text-5xl tracking-wider ring-4 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-2xl group-hover:brightness-110 transition-all">
                    {getInitials(fullName || user.full_name)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-slate-950/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity space-y-1">
                  <Camera className="w-7 h-7" />
                  <span className="text-[11px] font-bold">Select File</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            {/* Right: User Details Box with options to edit info */}
            <div className="flex-1 space-y-5 w-full">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <h3 className="text-xl font-bold text-theme-main font-header flex items-center gap-2">
                  <User className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
                  <span>User Details</span>
                </h3>
                {user.is_admin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0052CC]/10 text-[#0052CC] dark:text-[#00E5FF] border border-[#0052CC]/20 text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" /> Admin User
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-theme-subtle/50 border border-theme rounded-2xl text-theme-muted text-sm cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Language Preference</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] cursor-pointer"
                  >
                    <option value="English" className="bg-theme-card">English (US)</option>
                    <option value="Spanish" className="bg-theme-card">Spanish (Español)</option>
                    <option value="French" className="bg-theme-card">French (Français)</option>
                    <option value="Japanese" className="bg-theme-card">Japanese (日本語)</option>
                    <option value="German" className="bg-theme-card">German (Deutsch)</option>
                  </select>
                </div>

                {/* Avatar Image File Upload & Optional URL Input */}
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Profile Image (Optional):</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Paste Image URL or select file (Optional)"
                      className="flex-1 px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
                    />
                    <label className="px-4 py-3 bg-theme-subtle hover:brightness-95 border border-theme rounded-2xl text-xs font-bold text-theme-main cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-theme flex items-center justify-between">
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className="btn-cta px-6 py-3 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>

      {/* 3. Section 1: Preplanned Trips (Screen 7 Wireframe Match) */}
      <section className="space-y-6 w-full">
        <div className="border-b border-theme pb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">
            Preplanned Trips ({preplannedTrips.length})
          </h2>
        </div>

        {preplannedTrips.length === 0 ? (
          <p className="text-xs text-theme-muted italic bg-theme-card p-8 rounded-3xl border border-theme text-center">
            No preplanned trips scheduled yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {preplannedTrips.map(renderTripPortraitCard)}
          </div>
        )}
      </section>

      {/* 4. Section 2: Previous Trips (Screen 7 Wireframe Match) */}
      <section className="space-y-6 w-full">
        <div className="border-b border-theme pb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">
            Previous Trips ({previousTrips.length})
          </h2>
        </div>

        {previousTrips.length === 0 ? (
          <p className="text-xs text-theme-muted italic bg-theme-card p-8 rounded-3xl border border-theme text-center">
            No previous trips completed yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {previousTrips.map(renderTripPortraitCard)}
          </div>
        )}
      </section>

    </div>
  );
};
