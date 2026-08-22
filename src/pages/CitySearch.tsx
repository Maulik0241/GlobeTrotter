import React, { useState } from 'react';
import { Search, Filter, Compass } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { CityCard } from '../components/CityCard';

interface CitySearchProps {
  openCreateTripModal: () => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({ openCreateTripModal }) => {
  const { cities } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCostIndex, setSelectedCostIndex] = useState('All');

  const regions = ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Middle East', 'Oceania'];
  const costIndices = ['All', '$', '$$', '$$$', '$$$$'];

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    const matchesCost = selectedCostIndex === 'All' || city.cost_index === selectedCostIndex;
    return matchesSearch && matchesRegion && matchesCost;
  });

  return (
    <div className="w-full space-y-8 pb-16 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100">Global Destination Search</h1>
          <p className="text-xs text-slate-400 mt-1">Discover worldwide cities, average cost indices, and travel highlights</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl border border-slate-800 w-full">
        <div className="relative w-full">
          <Search className="absolute left-4.5 top-4 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search city, country, or interest tags (e.g. Paris, Gaudi, Beaches, Tech, Sushi)..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Region Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Region:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  selectedRegion === region
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/20'
                    : 'bg-slate-950/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Cost Index Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">Budget Level:</span>
            {costIndices.map((cost) => (
              <button
                key={cost}
                onClick={() => setSelectedCostIndex(cost)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedCostIndex === cost
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cost}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Cities */}
      {filteredCities.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-3 w-full">
          <Compass className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-200">No Destinations Found</h3>
          <p className="text-xs text-slate-400">Try broadening your search query or region filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredCities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onAddToTrip={() => {
                openCreateTripModal();
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
};
