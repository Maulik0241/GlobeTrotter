import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Sparkles, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

interface CreateTripProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateTrip: React.FC<CreateTripProps> = ({ onSuccess, onCancel }) => {
  const { createTrip, addStopToTrip, cities, activityCatalog } = useTrips();
  const { user } = useAuth();

  // Form State
  const [tripName, setTripName] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(cities[0]?.name || 'Paris');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [totalBudget, setTotalBudget] = useState(2500);
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
  );

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required.';
    } else if (tripName.trim().length < 3) {
      newErrors.tripName = 'Trip name must be at least 3 characters long.';
    }

    if (!selectedPlace) {
      newErrors.selectedPlace = 'Please select a destination place.';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be before the start date.';
    }

    if (!totalBudget || totalBudget <= 0) {
      newErrors.totalBudget = 'Target budget must be a positive number greater than $0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const initialCityObj = cities.find((c) => c.name === selectedPlace) || cities[0];

    const newTripId = createTrip({
      name: tripName,
      description: description || `Personalized trip to ${selectedPlace} and global destinations.`,
      cover_photo: coverPhoto,
      start_date: startDate,
      end_date: endDate,
      total_budget: Number(totalBudget),
      is_public: true,
      user_id: user?.id || 'usr-demo',
    });

    if (newTripId && initialCityObj) {
      addStopToTrip(newTripId, initialCityObj, startDate, endDate);
    }

    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Title */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
          Plan a new trip
        </h1>
        <p className="text-xs sm:text-sm text-theme-muted">Configure dates, select destination place, and review activities.</p>
      </div>

      {/* Validation Top Banner if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs font-bold">
            Please fix the validation errors highlighted below before submitting.
          </div>
        </div>
      )}

      {/* 2. Form Section */}
      <form onSubmit={handleSubmit} className="w-full glass-panel p-6 sm:p-10 rounded-3xl border border-theme shadow-2xl space-y-6 bg-theme-card">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Trip Title */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Trip Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => {
                setTripName(e.target.value);
                if (errors.tripName) setErrors({ ...errors, tripName: '' });
              }}
              placeholder="e.g. Grand European Exploration"
              className={`w-full px-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none transition-colors ${
                errors.tripName ? 'border-rose-500 bg-rose-500/5' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
              }`}
            />
            {errors.tripName && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.tripName}</span>
              </p>
            )}
          </div>

          {/* Select a Place */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Select a Place : <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
              <select
                value={selectedPlace}
                onChange={(e) => {
                  setSelectedPlace(e.target.value);
                  const found = cities.find((c) => c.name === e.target.value);
                  if (found) setCoverPhoto(found.image_url);
                  if (errors.selectedPlace) setErrors({ ...errors, selectedPlace: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none cursor-pointer ${
                  errors.selectedPlace ? 'border-rose-500 bg-rose-500/5' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
                }`}
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.name} className="bg-theme-card">
                    {city.name} ({city.country}) - ${city.avg_daily_cost}/day
                  </option>
                ))}
              </select>
            </div>
            {errors.selectedPlace && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.selectedPlace}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Start Date: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) setErrors({ ...errors, startDate: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none ${
                  errors.startDate ? 'border-rose-500 bg-rose-500/5' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
                }`}
              />
            </div>
            {errors.startDate && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.startDate}</span>
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              End Date: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors({ ...errors, endDate: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none ${
                  errors.endDate ? 'border-rose-500 bg-rose-500/5' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
                }`}
              />
            </div>
            {errors.endDate && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.endDate}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Target Budget */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Total Target Budget ($USD): <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => {
                  setTotalBudget(Number(e.target.value));
                  if (errors.totalBudget) setErrors({ ...errors, totalBudget: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none ${
                  errors.totalBudget ? 'border-rose-500 bg-rose-500/5' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
                }`}
              />
            </div>
            {errors.totalBudget && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.totalBudget}</span>
              </p>
            )}
          </div>

          {/* Cover Photo Image Upload */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Cover Photo Image:</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={coverPhoto}
                onChange={(e) => setCoverPhoto(e.target.value)}
                placeholder="Paste Image URL or upload file..."
                className="flex-1 px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
              />
              <label className="px-4 py-3 bg-theme-subtle hover:brightness-95 border border-theme rounded-2xl text-xs font-bold text-theme-main cursor-pointer shrink-0 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (reader.result) setCoverPhoto(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Description / Trip Notes:</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief overview of your planned trip..."
            className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-theme flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl bg-theme-subtle hover:brightness-95 text-theme-main text-xs font-bold border border-theme cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cta px-8 py-4 rounded-2xl text-sm font-black shadow-xl cursor-pointer"
          >
            {isSubmitting ? 'Creating Trip...' : 'Create & Open Itinerary Builder'}
          </button>
        </div>
      </form>

      {/* 3. Bottom Half Section: Suggestion for Places to Visit/Activities to perform */}
      <section className="space-y-6 pt-4 w-full">
        <div className="flex items-center gap-2 border-b border-theme pb-3">
          <Sparkles className="w-6 h-6 text-[#FF5A5F] dark:text-[#FF7A00]" />
          <h2 className="text-2xl font-black text-theme-main font-header">
            Suggestion for Places to Visit / Activities to perform
          </h2>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {activityCatalog.slice(0, 6).map((act) => (
            <div
              key={act.id}
              onClick={() => {
                const foundCity = cities.find((c) => c.name === act.city_name);
                if (foundCity) {
                  setSelectedPlace(foundCity.name);
                  setCoverPhoto(foundCity.image_url);
                }
              }}
              className={`glass-card rounded-3xl overflow-hidden p-6 border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl ${
                selectedPlace === act.city_name
                  ? 'border-[#007A87] dark:border-[#00E5FF] bg-[#007A87]/10 dark:bg-[#00E5FF]/10 ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30'
                  : 'border-theme bg-theme-card'
              }`}
            >
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img src={act.image_url} alt={act.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-[#00E5FF]">
                  {act.category}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-theme-main font-header flex items-center justify-between">
                  <span>{act.title}</span>
                  {selectedPlace === act.city_name && (
                    <CheckCircle2 className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
                  )}
                </h4>
                <p className="text-xs text-theme-muted line-clamp-2">{act.description}</p>
              </div>

              <div className="pt-2 border-t border-theme flex items-center justify-between text-xs font-bold">
                <span className="text-theme-muted">{act.city_name} • {act.duration_hours} hrs</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">${act.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
