import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, DollarSign, Plus } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface CitySearchProps {
  openCreateTripModal: () => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({ openCreateTripModal }) => {
  const { cities } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'cost' | 'name'>('popular');

  const filteredCities = cities
    .filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.popularity_score - a.popularity_score;
      if (sortBy === 'cost') return a.avg_daily_cost - b.avg_daily_cost;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
          City & Destination Search
        </h1>
        <p className="text-xs sm:text-sm text-theme-muted mt-1">Explore worldwide cities, average cost indices, and travel highlights.</p>
      </div>

      {/* Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 8 Mockup) */}
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
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
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

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="popular" className="bg-theme-card">Sort by: Popularity</option>
              <option value="cost" className="bg-theme-card">Sort by: Daily Spend</option>
              <option value="name" className="bg-theme-card">Sort by: City Name</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Results Header Section (Screen 8 Wireframe Match) */}
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-theme pb-3">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">
            Results ({filteredCities.length})
          </h2>
          <span className="text-xs text-theme-muted font-medium">Showing matching destination options</span>
        </div>

        {filteredCities.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl space-y-3 w-full border border-theme bg-theme-card">
            <h3 className="text-xl font-bold text-theme-main font-header">No Results Found</h3>
            <p className="text-xs text-theme-muted">Try clearing your search query or changing region filters.</p>
          </div>
        ) : (
          /* List of Option Cards matching Screen 8 Wireframe Horizontal Option Rows */
          <div className="space-y-4 w-full">
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="glass-card rounded-3xl p-6 border border-theme bg-theme-card shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 w-full group"
              >
                {/* Image / Thumbnail */}
                <div className="relative w-full md:w-64 h-44 shrink-0 rounded-2xl overflow-hidden">
                  <img
                    src={city.image_url}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-[#00E5FF]">
                    {city.cost_index} Cost Index
                  </div>
                </div>

                {/* Option and its details (Screen 8 Wireframe Match) */}
                <div className="flex-1 space-y-2 text-center md:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h3 className="text-xl font-black text-theme-main font-header group-hover:text-[#007A87] dark:group-hover:text-[#00E5FF] transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-xs text-theme-muted">({city.country})</span>
                  </div>

                  <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
                    {city.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    {city.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-theme-subtle border border-theme text-[10px] font-bold text-theme-main"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-col items-center md:items-end justify-between gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-theme">
                  <div className="text-center md:text-right">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Avg Daily Spend</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center md:justify-end gap-0.5">
                      <DollarSign className="w-4 h-4" />
                      {city.avg_daily_cost}/day
                    </span>
                  </div>

                  <button
                    onClick={openCreateTripModal}
                    className="btn-cta flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Plan Trip Here</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
