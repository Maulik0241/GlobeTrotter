import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, SlidersHorizontal, Calendar, MapPin, Eye, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import type { Trip } from '../types';

interface MyTripsProps {
  setCurrentTab: (tab: string) => void;
  openCreateTripModal: () => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({ setCurrentTab, openCreateTripModal }) => {
  const { trips, deleteTrip, setSelectedTripId, calculateBudgetBreakdown } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'name'>('date');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  // Filter & Search Logic
  const filteredTrips = trips.filter((trip) => {
    const q = searchTerm.toLowerCase().trim();
    const stops = Array.isArray(trip.stops) ? trip.stops : [];
    const matchesSearch =
      !q ||
      (trip.name || '').toLowerCase().includes(q) ||
      (trip.description || '').toLowerCase().includes(q) ||
      stops.some((s) => (s.city_name || '').toLowerCase().includes(q));

    const now = new Date();
    const start = new Date(trip.start_date || '2026-01-01');
    const end = new Date(trip.end_date || '2026-12-31');

    let status = 'upcoming';
    if (now >= start && now <= end) status = 'ongoing';
    else if (now > end) status = 'completed';

    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && status === selectedFilter.toLowerCase();
  });

  // Dynamic Sorting Logic
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime();
    if (sortBy === 'budget') return (b.total_budget || 0) - (a.total_budget || 0);
    return (a.name || '').localeCompare(b.name || '');
  });

  // Categorize Trips into Ongoing, Up-coming, Completed (Screen 6 Mockup)
  const categorizeTrips = (tripList: Trip[]) => {
    const now = new Date();
    const ongoing: Trip[] = [];
    const upcoming: Trip[] = [];
    const completed: Trip[] = [];

    tripList.forEach((trip) => {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);

      if (now >= start && now <= end) {
        ongoing.push(trip);
      } else if (now < start) {
        upcoming.push(trip);
      } else {
        completed.push(trip);
      }
    });

    return { ongoing, upcoming, completed };
  };

  const { ongoing, upcoming, completed } = categorizeTrips(sortedTrips);

  const renderTripOverviewCard = (trip: Trip) => {
    const breakdown = calculateBudgetBreakdown(trip);
    return (
      <div
        key={trip.id}
        className="glass-card rounded-3xl overflow-hidden border border-theme bg-theme-card shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row justify-between w-full group"
      >
        {/* Cover Photo */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
          <img
            src={trip.cover_photo}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/40" />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-[#00E5FF] border border-white/10">
            {trip.stops.length} Cities Included
          </div>
        </div>

        {/* Short Overview Content (Screen 6 Mockup) */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-2xl font-black text-theme-main font-header group-hover:text-[#007A87] dark:group-hover:text-[#00E5FF] transition-colors">
                {trip.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTripToDelete(trip)}
                  className="p-2 rounded-xl text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Trip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-2 font-medium">
              <Calendar className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
              <span>{trip.start_date} ~ {trip.end_date}</span>
            </p>

            <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed pt-1">
              {trip.description}
            </p>

            {/* City Stops Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {trip.stops.map((stop) => (
                <span
                  key={stop.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-theme-subtle border border-theme text-[11px] font-bold text-theme-main"
                >
                  <MapPin className="w-3 h-3 text-[#007A87] dark:text-[#00E5FF]" />
                  {stop.city_name}
                </span>
              ))}
            </div>
          </div>

          {/* Budget & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-theme">
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-theme-muted text-[10px] uppercase font-bold block">Est. Cost</span>
                <span className="font-bold text-sm text-theme-main">${breakdown.totalEstimated}</span>
              </div>
              <div>
                <span className="text-theme-muted text-[10px] uppercase font-bold block">Target Budget</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">${trip.total_budget}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedTripId(trip.id);
                  setCurrentTab('itinerary-view');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 text-theme-main text-xs font-bold border border-theme cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                <span>View Trip</span>
              </button>
              <button
                onClick={() => {
                  setSelectedTripId(trip.id);
                  setCurrentTab('itinerary-builder');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 text-xs font-bold cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Open Builder</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-10 pb-24 animate-fade-in relative">
      
      {/* Top Title & CTA Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
            My Trips & Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">Manage ongoing, upcoming, and completed travel journeys.</p>
        </div>

        <button
          onClick={openCreateTripModal}
          className="btn-cta flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plan a trip</span>
        </button>
      </div>

      {/* Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 6 Mockup) */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
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

        {/* Group by / Filter / Sort by Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <Filter className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] ml-2" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-theme-card">Group by: All Statuses</option>
              <option value="Ongoing" className="bg-theme-card">Group by: Ongoing</option>
              <option value="Upcoming" className="bg-theme-card">Group by: Up-coming</option>
              <option value="Completed" className="bg-theme-card">Group by: Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="date" className="bg-theme-card">Sort by: Departure Date</option>
              <option value="budget" className="bg-theme-card">Sort by: Target Budget</option>
              <option value="name" className="bg-theme-card">Sort by: Trip Name</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-theme text-xs font-bold transition-all cursor-pointer ${
              showFilterDrawer || searchTerm || selectedFilter !== 'All'
                ? 'bg-[#007A87]/20 text-[#007A87] dark:text-[#00E5FF] border-[#007A87]/40'
                : 'bg-theme-subtle hover:brightness-95 text-theme-main'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {showFilterDrawer && (
        <div className="glass-panel p-4 rounded-3xl border border-theme bg-theme-card shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="text-xs font-bold text-theme-main">
            Active Filters: <span className="text-[#007A87] dark:text-[#00E5FF]">{selectedFilter} Statuses</span> {searchTerm ? `• Matching "${searchTerm}"` : ''}
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFilter('All');
              setShowFilterDrawer(false);
            }}
            className="px-4 py-2 rounded-xl bg-theme-subtle text-theme-muted text-xs font-bold border border-theme hover:text-theme-main cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Categorized Sections: Ongoing, Up-coming, Completed (Screen 6 Mockup) */}
      <div className="space-y-10 w-full">
        
        {/* 1. Ongoing Trips */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <h2 className="text-2xl font-black text-theme-main font-header flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Ongoing</span>
              <span className="text-xs font-normal text-theme-muted">({ongoing.length})</span>
            </h2>
          </div>

          {ongoing.length === 0 ? (
            <p className="text-xs text-theme-muted italic bg-theme-card p-6 rounded-2xl border border-theme">
              No active ongoing trips right now.
            </p>
          ) : (
            <div className="space-y-6 w-full">
              {ongoing.map(renderTripOverviewCard)}
            </div>
          )}
        </section>

        {/* 2. Up-coming Trips */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <h2 className="text-2xl font-black text-theme-main font-header flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#007A87] dark:bg-[#00E5FF] inline-block" />
              <span>Up-coming</span>
              <span className="text-xs font-normal text-theme-muted">({upcoming.length})</span>
            </h2>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-xs text-theme-muted italic bg-theme-card p-6 rounded-2xl border border-theme">
              No upcoming trips scheduled. Click "+ Plan a trip" to create your next journey.
            </p>
          ) : (
            <div className="space-y-6 w-full">
              {upcoming.map(renderTripOverviewCard)}
            </div>
          )}
        </section>

        {/* 3. Completed Trips */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <h2 className="text-2xl font-black text-theme-main font-header flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
              <span>Completed</span>
              <span className="text-xs font-normal text-theme-muted">({completed.length})</span>
            </h2>
          </div>

          {completed.length === 0 ? (
            <p className="text-xs text-theme-muted italic bg-theme-card p-6 rounded-2xl border border-theme">
              No completed trip history.
            </p>
          ) : (
            <div className="space-y-6 w-full">
              {completed.map(renderTripOverviewCard)}
            </div>
          )}
        </section>

      </div>

      {/* Delete Trip Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen z-[9999] bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#12181F] border border-[#DDE5E8] dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#1A2B32] dark:text-[#F8FAFC] space-y-5">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black font-header">Delete Trip Confirmation</h3>
            </div>

            <p className="text-xs text-theme-muted leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-theme-main">{tripToDelete.name}</strong>? This action cannot be undone and will remove all scheduled stops and activities.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-theme">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-5 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTrip(tripToDelete.id);
                  setTripToDelete(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 text-xs font-black shadow-lg cursor-pointer"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
