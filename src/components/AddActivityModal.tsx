import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import type { ActivityCatalogItem } from '../types';

interface AddActivityModalProps {
  tripId: string;
  stopId: string;
  isOpen: boolean;
  onClose: () => void;
  presetActivity?: ActivityCatalogItem;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  tripId,
  stopId,
  isOpen,
  onClose,
  presetActivity,
}) => {
  const { addActivityToStop } = useTrips();

  const [title, setTitle] = useState(presetActivity?.title || '');
  const [category, setCategory] = useState<'Sightseeing' | 'Food' | 'Adventure' | 'Transport' | 'Stay' | 'Shopping'>(
    presetActivity?.category || 'Sightseeing'
  );
  const [cost, setCost] = useState(presetActivity?.cost || 45);
  const [duration, setDuration] = useState(presetActivity?.duration_hours || 2);
  const [dayNumber, setDayNumber] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [description, setDescription] = useState(presetActivity?.description || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addActivityToStop(tripId, stopId, {
      title,
      category,
      cost: Number(cost),
      duration_hours: Number(duration),
      day_number: Number(dayNumber),
      scheduled_time: scheduledTime,
      description,
      image_url: presetActivity?.image_url,
    });
    onClose();
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
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Add Activity to Itinerary</h3>
            <p className="text-xs text-slate-400">Schedule tours, dining, adventure, or stay details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Guided Louvre Museum Tour"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food">Food & Dining</option>
                <option value="Adventure">Adventure</option>
                <option value="Transport">Transport</option>
                <option value="Stay">Accommodation / Stay</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Cost ($)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Day Number</label>
              <input
                type="number"
                min="1"
                max="30"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time Slot</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (hrs)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes / Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Meeting point near main pyramid entrance..."
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save Activity</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
