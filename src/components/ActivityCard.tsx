import React from 'react';
import type { ActivityCatalogItem } from '../types';
import { Star, Clock, DollarSign, Plus, MapPin } from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityCatalogItem;
  onAddActivity?: (activity: ActivityCatalogItem) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAddActivity }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Sightseeing':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Food':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Adventure':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Transport':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Stay':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group">
      
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={activity.image_url}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${getCategoryColor(
            activity.category
          )}`}
        >
          {activity.category}
        </span>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-amber-400 border border-slate-700/80">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{activity.rating}</span>
          <span className="text-[10px] text-slate-500">({activity.reviews_count})</span>
        </div>

        {/* City Location label */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-slate-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>{activity.city_name}</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-2">
            {activity.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Duration & Price */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{activity.duration_hours} hrs</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{activity.cost === 0 ? 'Free' : `$${activity.cost}`}</span>
            </div>
          </div>

          {onAddActivity && (
            <button
              onClick={() => onAddActivity(activity)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-teal-500/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add to Itinerary</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
