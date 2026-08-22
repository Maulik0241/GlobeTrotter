import React, { useState } from 'react';
import { Copy, Check, Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import confetti from 'canvas-confetti';

interface SharedItineraryProps {
  setCurrentTab: (tab: string) => void;
}

export const SharedItinerary: React.FC<SharedItineraryProps> = ({ setCurrentTab }) => {
  const { currentTrip, copyTripToUser, calculateBudgetBreakdown } = useTrips();
  const [copied, setCopied] = useState(false);
  const [forked, setForked] = useState(false);

  if (!currentTrip) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200">No Trip Selected</h3>
        <button onClick={() => setCurrentTab('my-trips')} className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
          Select Trip
        </button>
      </div>
    );
  }

  const breakdown = calculateBudgetBreakdown(currentTrip);
  const shareUrl = `${window.location.origin}/#share=${currentTrip.share_code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleForkTrip = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    copyTripToUser(currentTrip);
    setForked(true);
    setTimeout(() => {
      setForked(false);
      setCurrentTab('itinerary-builder');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Public Sharable Itinerary
            </span>
            <h1 className="text-3xl font-black text-white mt-2">{currentTrip.name}</h1>
            <p className="text-xs text-slate-400">Created by {currentTrip.user_name || 'Traveler'}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleForkTrip}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-teal-500/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>{forked ? 'Trip Copied!' : 'Copy Trip to My Account'}</span>
            </button>
          </div>
        </div>

        {/* Share Link Generator Box */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-slate-300">Public Shareable Link & Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-teal-400 font-mono text-xs focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-teal-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Dates</span>
              <span className="text-xs font-bold text-slate-100">{currentTrip.start_date} ~ {currentTrip.end_date}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Destinations</span>
              <span className="text-xs font-bold text-slate-100">{currentTrip.stops.length} Cities</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Est. Cost</span>
              <span className="text-xs font-bold text-emerald-400">${breakdown.totalEstimated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Itinerary Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100">Public Itinerary Preview</h3>

        {currentTrip.stops.map((stop) => (
          <div key={stop.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-4">
              <img src={stop.cover_image} alt={stop.city_name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="text-lg font-bold text-white">{stop.city_name}, {stop.country}</h4>
                <p className="text-xs text-slate-400">{stop.notes}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {stop.activities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{act.title}</span>
                    <span className="text-[10px] text-slate-400">Day {act.day_number} • {act.category}</span>
                  </div>
                  <span className="font-bold text-emerald-400">${act.cost}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
