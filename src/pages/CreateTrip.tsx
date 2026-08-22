import React, { useState } from 'react';
import { Calendar, DollarSign, Image as ImageIcon, MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface CreateTripProps {
  onSuccess: (tripId: string) => void;
  onCancel: () => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
];

export const CreateTrip: React.FC<CreateTripProps> = ({ onSuccess, onCancel }) => {
  const { createTrip, cities } = useTrips();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-10');
  const [totalBudget, setTotalBudget] = useState(2500);
  const [coverPhoto, setCoverPhoto] = useState(PRESET_COVERS[0]);
  const [initialCityId, setInitialCityId] = useState(cities[0]?.id || 'paris');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newTripId = createTrip(
      {
        user_id: 'usr-101',
        name,
        description: description || 'Personalized multi-city itinerary.',
        cover_photo: coverPhoto,
        start_date: startDate,
        end_date: endDate,
        total_budget: Number(totalBudget),
        is_public: isPublic,
      },
      initialCityId
    );

    onSuccess(newTripId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-100">Create New Trip</h1>
          <p className="text-xs text-slate-400">Initialize your personalized multi-city itinerary</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Trip Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Trip Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Euro Summer Tour 2026 or Tokyo Autumn Getaway"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-base"
          />
        </div>

        {/* Dates & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Target Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-400" />
              <input
                type="number"
                min="100"
                step="50"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Initial Destination */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Primary Starting Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-400" />
            <select
              value={initialCityId}
              onChange={(e) => setInitialCityId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country} ({c.cost_index} • Avg ${c.avg_daily_cost}/day)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Trip Overview / Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share notes, goals, or theme for this trip..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
          />
        </div>

        {/* Cover Photo Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Choose Cover Photo</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
            {PRESET_COVERS.map((url, idx) => (
              <div
                key={idx}
                onClick={() => setCoverPhoto(url)}
                className={`relative h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  coverPhoto === url ? 'border-teal-400 scale-105 shadow-lg shadow-teal-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Cover preset" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Privacy toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <span className="text-sm font-semibold text-slate-200 block">Make Trip Sharable / Public</span>
            <span className="text-xs text-slate-400">Allows generating public links for friends to view or copy</span>
          </div>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
          />
        </div>

        {/* Action button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-teal-500/25 active:scale-95"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Create Itinerary</span>
          </button>
        </div>

      </form>

    </div>
  );
};
