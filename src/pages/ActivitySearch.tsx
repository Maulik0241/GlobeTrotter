import React, { useState } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { ActivityCard } from '../components/ActivityCard';
import { AddActivityModal } from '../components/AddActivityModal';
import type { ActivityCatalogItem } from '../types';

export const ActivitySearch: React.FC = () => {
  const { activityCatalog, currentTrip } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivityForAdd, setSelectedActivityForAdd] = useState<ActivityCatalogItem | null>(null);

  const categories = ['All', 'Sightseeing', 'Food', 'Adventure', 'Transport', 'Stay', 'Shopping'];

  const filteredActivities = activityCatalog.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      <div>
        <h1 className="text-3xl font-black text-slate-100">Things To Do & Experience Search</h1>
        <p className="text-xs text-slate-400">Discover museum tours, culinary walks, outdoor adventure, and stays</p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities, tours, food experiences (e.g. Louvre, Colosseum, Ramen)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of activities */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Activities Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onAddActivity={(activity) => setSelectedActivityForAdd(activity)}
            />
          ))}
        </div>
      )}

      {/* Add activity modal */}
      {selectedActivityForAdd && currentTrip && currentTrip.stops[0] && (
        <AddActivityModal
          tripId={currentTrip.id}
          stopId={currentTrip.stops[0].id}
          isOpen={!!selectedActivityForAdd}
          onClose={() => setSelectedActivityForAdd(null)}
          presetActivity={selectedActivityForAdd}
        />
      )}

    </div>
  );
};
