import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2, Circle, Eye, DollarSign } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { AddStopModal } from '../components/AddStopModal';
import { AddActivityModal } from '../components/AddActivityModal';

interface ItineraryBuilderProps {
  setCurrentTab: (tab: string) => void;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ setCurrentTab }) => {
  const { currentTrip, reorderStops, removeStopFromTrip, toggleActivityStatus, deleteActivity } = useTrips();

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<string | null>(null);

  if (!currentTrip) {
    return (
      <div className="w-full text-center py-20 glass-panel rounded-3xl space-y-4">
        <h3 className="text-xl font-bold text-slate-200">No Trip Selected</h3>
        <p className="text-xs text-slate-400">Please select or create a trip to start building your itinerary.</p>
        <button
          onClick={() => setCurrentTab('my-trips')}
          className="px-6 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs"
        >
          Select Trip
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-16 animate-fade-in">
      
      {/* Trip Header Banner */}
      <div className="relative w-full glass-panel rounded-3xl overflow-hidden p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
        <img
          src={currentTrip.cover_photo}
          alt={currentTrip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />

        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Itinerary Builder Studio</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white">{currentTrip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-4 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-teal-400" />
                {currentTrip.start_date} ~ {currentTrip.end_date}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <DollarSign className="w-4 h-4" />
                Target Budget: ${currentTrip.total_budget}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('itinerary-view')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <Eye className="w-4 h-4 text-teal-400" />
              <span>View Itinerary</span>
            </button>
            <button
              onClick={() => setCurrentTab('trip-budget')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget Breakdown</span>
            </button>
            <button
              onClick={() => setIsAddStopOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add City Stop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stops Timeline Accordion */}
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Day-Wise City Stops ({currentTrip.stops.length})</h2>
          <span className="text-xs text-slate-400">Reorder cities using the arrow controls</span>
        </div>

        {currentTrip.stops.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl space-y-4">
            <MapPin className="w-10 h-10 text-teal-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-200">No City Stops Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Start building your multi-city trip by adding your first destination stop.
            </p>
            <button
              onClick={() => setIsAddStopOpen(true)}
              className="px-6 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs"
            >
              Add First City
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {currentTrip.stops.map((stop, idx) => (
              <div
                key={stop.id}
                className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800/80 shadow-xl relative"
              >
                {/* Stop Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center justify-center text-base font-black shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>{stop.city_name}</span>
                        <span className="text-sm font-normal text-slate-400">({stop.country})</span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        <span>{stop.arrival_date} to {stop.departure_date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {idx > 0 && (
                      <button
                        onClick={() => reorderStops(currentTrip.id, idx, idx - 1)}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {idx < currentTrip.stops.length - 1 && (
                      <button
                        onClick={() => reorderStops(currentTrip.id, idx, idx + 1)}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setActiveStopForActivity(stop.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Activity</span>
                    </button>
                    <button
                      onClick={() => removeStopFromTrip(currentTrip.id, stop.id)}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400"
                      title="Remove Stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stop Notes */}
                {stop.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
                    "{stop.notes}"
                  </p>
                )}

                {/* Activities grid */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Scheduled Activities ({stop.activities.length})
                  </h4>

                  {stop.activities.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      No activities added for this stop yet. Click "Add Activity" or discover activities in Activity Search.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stop.activities.map((act) => (
                        <div
                          key={act.id}
                          className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                            act.is_completed
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleActivityStatus(currentTrip.id, stop.id, act.id)}
                              className="mt-0.5 text-slate-500 hover:text-teal-400 transition-colors"
                            >
                              {act.is_completed ? (
                                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600" />
                              )}
                            </button>
                            <div>
                              <h5
                                className={`text-sm font-bold ${
                                  act.is_completed ? 'line-through text-slate-400' : 'text-slate-100'
                                }`}
                              >
                                {act.title}
                              </h5>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                                <span>Day {act.day_number}</span>
                                {act.scheduled_time && <span>• {act.scheduled_time}</span>}
                                <span>• {act.duration_hours} hrs</span>
                                <span className="font-bold text-emerald-400">• ${act.cost}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteActivity(currentTrip.id, stop.id, act.id)}
                            className="text-slate-600 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStopModal
        tripId={currentTrip.id}
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
      />

      {activeStopForActivity && (
        <AddActivityModal
          tripId={currentTrip.id}
          stopId={activeStopForActivity}
          isOpen={!!activeStopForActivity}
          onClose={() => setActiveStopForActivity(null)}
        />
      )}

    </div>
  );
};
