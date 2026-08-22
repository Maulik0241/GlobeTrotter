import React, { useState } from 'react';
import { Compass, Plus, Calendar, Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
  openCreateTripModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab, openCreateTripModal }) => {
  const { trips, setSelectedTripId, calculateBudgetBreakdown } = useTrips();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'cost' | 'name'>('popular');

  // Regional Selections Data
  const regionalSelections = [
    { name: 'Europe', count: '14 Cities', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
    { name: 'Asia', count: '18 Cities', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { name: 'North America', count: '10 Cities', image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Middle East', count: '8 Cities', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Oceania', count: '6 Cities', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="w-full space-y-12 pb-24 animate-fade-in relative">
      
      {/* 1. Large Top Hero Banner Image */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-theme shadow-2xl p-8 sm:p-16 min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
          alt="GlobeTrotter Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 filter brightness-90"
        />

        <div className="relative z-20 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#007A87]/25 dark:bg-[#00E5FF]/25 backdrop-blur-md text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/40 dark:border-[#00E5FF]/40 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Personalized Travel Hub</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white font-header tracking-tight leading-none">
            GlobeTrotter
          </h1>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
            Welcome{user ? `, ${user.full_name}` : ''}! Dream, design, and organize multi-city travel itineraries with cost estimation and daily schedule timelines.
          </p>
        </div>
      </section>

      {/* 2. Search & Controls Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bar ..."
            className="w-full pl-11 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main placeholder:text-theme-muted text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
          />
        </div>

        {/* Action Pills: Group by, Filter, Sort by */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Region Filter / Group by */}
          <div className="flex items-center gap-2 bg-theme-subtle p-2 rounded-2xl border border-theme">
            <Filter className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] ml-2" />
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-theme-card">Group by: All Regions</option>
              <option value="Europe" className="bg-theme-card">Group by: Europe</option>
              <option value="Asia" className="bg-theme-card">Group by: Asia</option>
              <option value="North America" className="bg-theme-card">Group by: North America</option>
              <option value="Middle East" className="bg-theme-card">Group by: Middle East</option>
              <option value="Oceania" className="bg-theme-card">Group by: Oceania</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-theme-subtle p-2 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="popular" className="bg-theme-card">Sort by: Popularity</option>
              <option value="cost" className="bg-theme-card">Sort by: Lowest Daily Spend</option>
              <option value="name" className="bg-theme-card">Sort by: Name (A-Z)</option>
            </select>
          </div>

          <button
            onClick={() => setCurrentTab('cities')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Top Regional Selections */}
      <section className="space-y-5 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">Top Regional Selections</h2>
          <button
            onClick={() => setCurrentTab('cities')}
            className="text-xs sm:text-sm font-bold text-[#007A87] dark:text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full">
          {regionalSelections.map((reg) => (
            <div
              key={reg.name}
              onClick={() => {
                setSelectedRegionFilter(reg.name);
                setCurrentTab('cities');
              }}
              className="glass-card rounded-3xl overflow-hidden relative h-64 sm:h-72 lg:h-80 cursor-pointer group border border-theme shadow-xl hover:shadow-2xl transition-all duration-300 w-full"
            >
              <img
                src={reg.image}
                alt={reg.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <h4 className="text-lg sm:text-xl font-bold text-white font-header group-hover:text-[#00E5FF] transition-colors">{reg.name}</h4>
                <span className="text-xs text-slate-300 font-medium">{reg.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Previous Trips */}
      <section className="space-y-5 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">Previous Trips</h2>
          <button
            onClick={() => setCurrentTab('my-trips')}
            className="text-xs sm:text-sm font-bold text-[#007A87] dark:text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({trips.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 w-full">
          {trips.slice(0, 3).map((trip) => {
            const breakdown = calculateBudgetBreakdown(trip);
            return (
              <div
                key={trip.id}
                className="w-full glass-card rounded-3xl overflow-hidden flex flex-col group border border-theme bg-theme-card shadow-xl hover:shadow-2xl transition-all min-h-[500px]"
              >
                {/* Tall Vertical Cover Image Section */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-[#00E5FF] border border-white/10">
                    {trip.stops.length} Cities
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00E5FF] transition-colors line-clamp-1 font-header">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#00E5FF]" />
                      <span>{trip.start_date} ~ {trip.end_date}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  <div className="p-4 bg-theme-subtle rounded-2xl border border-theme flex items-center justify-between text-xs">
                    <div>
                      <span className="text-theme-muted text-[10px] uppercase font-bold block">Est. Cost</span>
                      <span className="font-bold text-sm text-theme-main">${breakdown.totalEstimated}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-theme-muted text-[10px] uppercase font-bold block">Target Budget</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">${trip.total_budget}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-theme">
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-view');
                      }}
                      className="py-3 rounded-xl bg-theme-subtle hover:brightness-95 text-theme-main text-xs font-bold text-center transition-colors border border-theme cursor-pointer"
                    >
                      View Trip
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-builder');
                      }}
                      className="py-3 rounded-xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      Open Builder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Floating Bottom-Right "+ Plan a trip" CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openCreateTripModal}
          className="btn-cta flex items-center gap-2.5 px-6 py-4 rounded-full text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Plan a trip</span>
        </button>
      </div>

    </div>
  );
};
