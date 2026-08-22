import React from 'react';
import type { CityCatalogItem } from '../types';
import { MapPin, DollarSign, Bookmark, Plus, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CityCardProps {
  city: CityCatalogItem;
  onSelectCity?: (city: CityCatalogItem) => void;
  onAddToTrip?: (city: CityCatalogItem) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, onSelectCity, onAddToTrip }) => {
  const { user, toggleSavedDestination } = useAuth();
  const isSaved = user?.saved_destinations?.includes(city.id);

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image container with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.image_url}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Region & Cost badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-teal-300 border border-slate-700/80">
            {city.region}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
            {city.cost_index}
          </span>
        </div>

        {/* Bookmark save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedDestination(city.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* City Name & Country overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.country}</span>
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-teal-300 transition-colors">
            {city.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {city.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {city.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-400 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-300 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-400">${city.avg_daily_cost}</span>
            <span className="text-[11px] text-slate-500">/ day avg</span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectCity && (
              <button
                onClick={() => onSelectCity(city)}
                className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                title="View details"
              >
                <Compass className="w-4 h-4" />
              </button>
            )}
            {onAddToTrip && (
              <button
                onClick={() => onAddToTrip(city)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-teal-500/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add to Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
