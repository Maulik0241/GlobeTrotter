import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, ArrowDown, DollarSign, Calendar, Edit3, Share2 } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface ItineraryViewProps {
  setCurrentTab: (tab: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ setCurrentTab }) => {
  const { currentTrip, calculateBudgetBreakdown } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'day' | 'cost' | 'name'>('day');

  if (!currentTrip) {
    return (
      <div className="w-full text-center py-20 glass-panel rounded-3xl space-y-4 border border-theme bg-theme-card">
        <h3 className="text-xl font-bold text-theme-main font-header">No Trip Selected</h3>
        <p className="text-xs text-theme-muted">Please select a trip to view its detailed itinerary.</p>
        <button
          onClick={() => setCurrentTab('my-trips')}
          className="btn-cta px-6 py-3 rounded-2xl text-xs font-black"
        >
          Browse Trips
        </button>
      </div>
    );
  }

  const breakdown = calculateBudgetBreakdown(currentTrip);

  // Group activities by Day number
  const activitiesByDay: { [day: number]: any[] } = {};
  currentTrip.stops.forEach((stop) => {
    stop.activities.forEach((act) => {
      if (!activitiesByDay[act.day_number]) {
        activitiesByDay[act.day_number] = [];
      }
      activitiesByDay[act.day_number].push({ ...act, city_name: stop.city_name });
    });
  });

  const sortedDays = Object.keys(activitiesByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Banner Header */}
      <div className="relative w-full glass-panel rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl border border-theme bg-theme-card">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src={currentTrip.cover_photo}
          alt={currentTrip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 filter brightness-75 scale-105"
        />

        <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 uppercase tracking-wider">
              Selected Place Itinerary
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-header">{currentTrip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-4 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
                {currentTrip.start_date} ~ {currentTrip.end_date}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <DollarSign className="w-4 h-4" />
                Est. Total: ${breakdown.totalEstimated} / Target: ${currentTrip.total_budget}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('itinerary-builder')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#00E5FF]" />
              <span>Edit Builder</span>
            </button>
            <button
              onClick={() => setCurrentTab('shared-itinerary')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 9 Mockup) */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full bg-theme-card">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bar ..."
            className="w-full pl-11 pr-4 py-2.5 bg-theme-subtle border border-theme rounded-2xl text-theme-main placeholder:text-theme-muted text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
          />
        </div>

        {/* Action Controls: Group by | Filter | Sort by */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <Filter className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] ml-2" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-theme-card">Group by: All Days</option>
              <option value="Completed" className="bg-theme-card">Group by: Completed</option>
              <option value="Pending" className="bg-theme-card">Group by: Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="day" className="bg-theme-card">Sort by: Day Number</option>
              <option value="cost" className="bg-theme-card">Sort by: Expense Cost</option>
              <option value="name" className="bg-theme-card">Sort by: Title</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Main Itinerary Header (Screen 9 Wireframe Match) */}
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl sm:text-4xl font-black text-theme-main font-header tracking-tight">
          Itinerary for a selected place
        </h2>
        <p className="text-xs sm:text-sm text-theme-muted">Timeline view with physical activity sequence and expense breakdown</p>
      </div>

      {/* 4. Table Header: Physical Activity | Expense (Screen 9 Wireframe Match) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card shadow-2xl space-y-8 w-full">
        <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-theme font-black text-sm uppercase tracking-wider text-theme-main font-header">
          <div className="col-span-8 sm:col-span-9 flex items-center gap-2">
            <span>Physical Activity</span>
          </div>
          <div className="col-span-4 sm:col-span-3 text-right">
            <span>Expense</span>
          </div>
        </div>

        {/* Timeline Rows grouped by Day (Screen 9 Wireframe Layout) */}
        {sortedDays.length === 0 ? (
          <div className="text-center py-16 text-theme-muted text-xs italic">
            No physical activities added to this itinerary yet.
          </div>
        ) : (
          <div className="space-y-10 w-full">
            {sortedDays.map((dayNum) => {
              const dayActivities = activitiesByDay[dayNum] || [];

              return (
                <div key={dayNum} className="space-y-6 w-full">
                  {/* Day Badge (Day 1, Day 2...) */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 font-black text-sm font-header">
                    <span>Day {dayNum}</span>
                  </div>

                  {/* List of Activities with Downward Arrows ↓ (Screen 9 Wireframe Layout) */}
                  <div className="space-y-4 w-full">
                    {dayActivities.map((act, actIdx) => (
                      <React.Fragment key={act.id}>
                        <div className="grid grid-cols-12 gap-4 items-center">
                          
                          {/* Physical Activity Box */}
                          <div className="col-span-8 sm:col-span-9 p-5 rounded-2xl bg-theme-subtle border border-theme shadow-md flex items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-theme-muted block">
                                {act.city_name} • {act.category}
                              </span>
                              <h4 className="text-base font-bold text-theme-main font-header">{act.title}</h4>
                              {act.description && (
                                <p className="text-xs text-theme-muted line-clamp-1 mt-1">{act.description}</p>
                              )}
                            </div>
                            <div className="text-right text-xs text-theme-muted shrink-0 hidden sm:block">
                              <span>{act.duration_hours} hrs</span>
                              {act.scheduled_time && <span className="block font-semibold">{act.scheduled_time}</span>}
                            </div>
                          </div>

                          {/* Expense Box */}
                          <div className="col-span-4 sm:col-span-3 p-5 rounded-2xl bg-theme-subtle border border-theme shadow-md text-right flex flex-col justify-center items-end">
                            <span className="text-[10px] uppercase font-bold text-theme-muted block">Cost</span>
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                              ${act.cost}
                            </span>
                          </div>

                        </div>

                        {/* Downward Arrow ↓ Connecting Physical Activities */}
                        {actIdx < dayActivities.length - 1 && (
                          <div className="flex justify-center py-1">
                            <div className="w-8 h-8 rounded-full bg-theme-subtle border border-theme flex items-center justify-center text-[#007A87] dark:text-[#00E5FF] shadow-sm">
                              <ArrowDown className="w-4 h-4 animate-bounce" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
