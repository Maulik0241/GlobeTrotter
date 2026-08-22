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
    <div className="space-y-8 pb-16 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Global City Search & Discovery</h1>
          <p className="text-xs text-slate-400">Explore worldwide destinations, cost indices, and travel highlights</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search city, country, or tag (e.g. Paris, Gaudi, Beaches, Sushi)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Region Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Region:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion === region
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Cost Index Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-2">Budget Level:</span>
            {costIndices.map((cost) => (
              <button
                key={cost}
                onClick={() => setSelectedCostIndex(cost)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedCostIndex === cost
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
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
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Compass className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Destinations Found</h3>
          <p className="text-xs text-slate-400">Try broadening your search query or region filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
