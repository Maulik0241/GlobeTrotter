import React from 'react';
import { Star, MapPin, Plus, Bookmark } from 'lucide-react';
import type { CityCatalogItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface CityCardProps {
  city: CityCatalogItem;
  onAddToTrip?: (city: CityCatalogItem) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, onAddToTrip }) => {
  const { user, toggleSavedDestination } = useAuth();
  const isSaved = user?.saved_destinations?.includes(city.id);

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl border border-theme relative">
      {/* City Image Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={city.image_url}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Cost Index & Rating Pill */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950/80 backdrop-blur-md text-[#00E5FF] dark:text-[#00E5FF] border border-white/10">
            {city.cost_index} Cost
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 flex items-center gap-1 border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{city.popularity_score}</span>
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSavedDestination(city.id)}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-colors ${
            isSaved
              ? 'bg-[#FF5A5F] text-white shadow-lg'
              : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Destination'}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3.5 left-4 right-4">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#007A87]/80 dark:bg-[#00E5FF]/20 text-white dark:text-[#00E5FF] backdrop-blur-md">
            {city.region}
          </span>
          <h3 className="text-2xl font-black text-white mt-1 group-hover:text-[#00E5FF] transition-colors">
            {city.name}
          </h3>
          <p className="text-xs text-slate-300 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{city.country}</span>
          </p>
        </div>
      </div>

      {/* Details & Action Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-theme-card">
        <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
          {city.description}
        </p>

        {/* Interest Tags */}
        <div className="flex flex-wrap gap-1.5">
          {city.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-theme-subtle text-theme-muted border border-theme"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-theme flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Avg. Daily Spend</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${city.avg_daily_cost}/day</span>
          </div>

          {onAddToTrip && (
            <button
              onClick={() => onAddToTrip(city)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#007A87] to-[#0052CC] dark:from-[#00E5FF] dark:to-[#22C55E] text-white dark:text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add to Trip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
