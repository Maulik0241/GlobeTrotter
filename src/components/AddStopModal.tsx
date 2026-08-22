import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen z-[9999] bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12181F] border border-[#DDE5E8] dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#1A2B32] dark:text-[#F8FAFC] my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-theme-muted hover:text-theme-main rounded-full hover:bg-theme-subtle transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-theme-main font-header">Add City Stop to Trip</h3>
            <p className="text-xs text-theme-muted">Expand your multi-city journey with new destinations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Select Destination City</label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} className="bg-theme-card">
                  {c.name}, {c.country} ({c.cost_index} • Avg ${c.avg_daily_cost}/day)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Arrival Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Departure Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-cta w-full py-3.5 px-4 rounded-2xl text-sm font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Stop to Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
