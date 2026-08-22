import React, { useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import type { CityCatalogItem } from '../types';

interface AddStopModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  preselectedCity?: CityCatalogItem;
}

export const AddStopModal: React.FC<AddStopModalProps> = ({ tripId, isOpen, onClose, preselectedCity }) => {
  const { cities, addStopToTrip } = useTrips();
  const [selectedCityId, setSelectedCityId] = useState(preselectedCity?.id || cities[0]?.id || 'paris');
  const [startDate, setStartDate] = useState('2026-09-12');
  const [endDate, setEndDate] = useState('2026-09-16');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = cities.find((c) => c.id === selectedCityId) || preselectedCity || cities[0];
    if (city) {
      addStopToTrip(tripId, city, startDate, endDate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Add City Stop to Trip</h3>
            <p className="text-xs text-slate-400">Expand your multi-city journey with new destinations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Destination City</label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country} ({c.cost_index} • Avg ${c.avg_daily_cost}/day)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Arrival Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Departure Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Stop to Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
