import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-theme-main font-header">Add Activity to Itinerary</h3>
            <p className="text-xs text-theme-muted">Schedule hours, dining, adventure, or stay details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Guided Louvre Museum Tour"
              className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm cursor-pointer"
              >
                <option value="Sightseeing" className="bg-theme-card">Sightseeing</option>
                <option value="Food" className="bg-theme-card">Food & Dining</option>
                <option value="Adventure" className="bg-theme-card">Adventure</option>
                <option value="Transport" className="bg-theme-card">Transport</option>
                <option value="Stay" className="bg-theme-card">Accommodation / Stay</option>
                <option value="Shopping" className="bg-theme-card">Shopping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Estimated Cost ($)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Day Number</label>
              <input
                type="number"
                min="1"
                max="30"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full px-3 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Time Slot</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Duration (hrs)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Notes / Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Meeting point near main pyramid entrance..."
              className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-cta w-full py-3.5 px-4 rounded-2xl text-sm font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save Activity</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
