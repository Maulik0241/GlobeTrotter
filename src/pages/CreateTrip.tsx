import React, { useState } from 'react';
import { MapPin, DollarSign, Sparkles, CheckCircle2, AlertCircle, Upload, ChevronDown, Compass } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

interface CreateTripProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateTrip: React.FC<CreateTripProps> = ({ onSuccess, onCancel }) => {
  const { createTrip, addStopToTrip, addActivityToStop, cities, activityCatalog } = useTrips();
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

  // Selected Suggestions State
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find city object for currently selected place
  const currentCityObj = cities.find((c) => c.name === selectedPlace) || cities[0];

  // Dynamic suggestion filtering based on selected Destination Place dropdown
  const filteredSuggestions = activityCatalog.filter((act) => {
    if (!selectedPlace) return true;
    const actCityObj = cities.find((c) => c.name === act.city_name);
    return (
      act.city_name.toLowerCase() === selectedPlace.toLowerCase() ||
      (currentCityObj && actCityObj && actCityObj.country.toLowerCase() === currentCityObj.country.toLowerCase())
    );
  });

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

  const toggleActivitySelection = (actId: string) => {
    if (selectedActivityIds.includes(actId)) {
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== actId));
    } else {
      setSelectedActivityIds([...selectedActivityIds, actId]);
    }
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

      // Attach any selected suggestions automatically to the created trip
      const selectedActs = activityCatalog.filter((a) => selectedActivityIds.includes(a.id));
      selectedActs.forEach((act) => {
        addActivityToStop(newTripId, 'stop-' + Date.now(), {
          title: act.title,
          category: act.category,
          cost: act.cost,
          duration_hours: act.duration_hours,
          day_number: 1,
          is_completed: false,
          description: act.description,
          image_url: act.image_url,
        });
      });
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
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Summer Vacation in Europe 2026"
              className={`w-full px-4 py-3 bg-theme-subtle border rounded-2xl text-theme-main text-sm focus:outline-none ${
                errors.tripName ? 'border-rose-500' : 'border-theme focus:border-[#007A87] dark:focus:border-[#00E5FF]'
              }`}
            />
            {errors.tripName && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.tripName}</p>}
          </div>

          {/* Select Place / Destination Dropdown */}
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Destination Place <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted z-10" />
              <select
                value={selectedPlace}
                onChange={(e) => {
                  const placeName = e.target.value;
                  setSelectedPlace(placeName);
                  const matchedCity = cities.find((c) => c.name === placeName);
                  if (matchedCity) {
                    setCoverPhoto(matchedCity.image_url);
                  }
                }}
                className="w-full appearance-none pl-10 pr-12 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF] cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.name} className="bg-theme-card">
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-theme-muted pointer-events-none z-10" />
            </div>
          </div>
        </div>

        {/* Start Date, End Date, Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              End Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">
              Target Budget ($ USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-muted" />
              <input
                type="number"
                min={100}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-sm focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
              />
            </div>
          </div>
        </div>

        {/* Cover Image File Upload & URL */}
        <div>
          <label className="block text-xs font-bold text-theme-main mb-1.5 font-header">Cover Photo (URL or File Upload):</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 w-full px-4 py-3 bg-theme-subtle border border-theme rounded-2xl text-theme-main text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
            />
            <label className="w-full sm:w-auto px-5 py-3 bg-theme-subtle hover:brightness-95 border border-theme rounded-2xl text-xs font-bold text-theme-main cursor-pointer shrink-0 flex items-center justify-center gap-2 shadow-sm">
              <Upload className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
              <span>Upload Local Image</span>
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

      {/* 3. Dynamic Section: Suggestion for Places to Visit / Activities to perform */}
      <section className="space-y-6 pt-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FF5A5F] dark:text-[#FF7A00]" />
            <h2 className="text-2xl font-black text-theme-main font-header">
              Suggestion for Places to Visit / Activities to perform
            </h2>
          </div>

          <span className="text-xs text-theme-muted font-semibold">
            Showing suggestions for <strong className="text-[#007A87] dark:text-[#00E5FF]">{selectedPlace} ({currentCityObj?.country})</strong>
          </span>
        </div>

        {/* Dynamic Cards Grid or Clean Empty State */}
        {filteredSuggestions.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl space-y-3 border border-theme bg-theme-card shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#007A87]/10 dark:bg-[#00E5FF]/10 text-[#007A87] dark:text-[#00E5FF] flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-theme-main font-header">No Activity Suggestions Found</h4>
            <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
              There are currently no predefined activity suggestions for <strong className="text-theme-main">{selectedPlace} ({currentCityObj?.country})</strong> in the database catalog. You can proceed with creating your trip and add custom activities directly in the Itinerary Builder!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredSuggestions.map((act) => {
              const isSelected = selectedActivityIds.includes(act.id);

              return (
                <div
                  key={act.id}
                  onClick={() => toggleActivitySelection(act.id)}
                  className={`glass-card rounded-3xl overflow-hidden p-6 border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl ${
                    isSelected
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
                      {isSelected && (
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
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
