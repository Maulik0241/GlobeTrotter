import React, { useState } from 'react';
import { Plus, Calendar, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2, Circle, Eye, DollarSign } from 'lucide-react';
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
        <h3 className="text-xl font-bold text-theme-main font-header">No Trip Selected</h3>
        <p className="text-xs text-theme-muted">Please select or create a trip to start building your itinerary.</p>
        <button
          onClick={() => setCurrentTab('my-trips')}
          className="btn-cta px-6 py-3 rounded-2xl text-xs font-black"
        >
          Select Trip
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* Trip Header Showcase Banner */}
      <div className="relative w-full glass-panel rounded-3xl overflow-hidden p-8 sm:p-12 shadow-2xl border border-theme">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
        <img
          src={currentTrip.cover_photo}
          alt={currentTrip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />

        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold uppercase tracking-wider border border-[#00E5FF]/30">
              <Sparkles className="w-4 h-4" />
              <span>Itinerary Studio</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-header">{currentTrip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-4 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
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
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#00E5FF]" />
              <span>View Itinerary</span>
            </button>
            <button
              onClick={() => setCurrentTab('trip-budget')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget Breakdown</span>
            </button>
            <button
              onClick={() => setIsAddStopOpen(true)}
              className="btn-cta flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Section</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections List matching Screen 5 Wireframe Layout */}
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header">Itinerary Sections ({currentTrip.stops.length})</h2>
          <span className="text-xs text-theme-muted">Use arrows to reorder sections</span>
        </div>

        {currentTrip.stops.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl space-y-4 border border-theme bg-theme-card">
            <h4 className="text-base font-bold text-theme-main font-header">No Sections Added Yet</h4>
            <p className="text-xs text-theme-muted max-w-md mx-auto">
              Start building your multi-city trip by adding your first itinerary section.
            </p>
            <button
              onClick={() => setIsAddStopOpen(true)}
              className="btn-cta px-6 py-3 rounded-2xl text-xs font-black cursor-pointer"
            >
              Add another Section
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {currentTrip.stops.map((stop, idx) => {
              const sectionTotalCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);

              return (
                /* Screen 5 Wireframe Section Card */
                <div
                  key={stop.id}
                  className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-theme bg-theme-card shadow-xl relative w-full"
                >
                  {/* Section Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme">
                    <div>
                      <h3 className="text-2xl font-black text-theme-main font-header flex items-center gap-2">
                        <span>Section {idx + 1}: {stop.city_name}</span>
                        <span className="text-sm font-normal text-theme-muted">({stop.country})</span>
                      </h3>
                      <p className="text-xs text-theme-muted leading-relaxed mt-1">
                        {stop.notes || 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {idx > 0 && (
                        <button
                          onClick={() => reorderStops(currentTrip.id, idx, idx - 1)}
                          className="p-2.5 rounded-xl bg-theme-subtle border border-theme text-theme-muted hover:text-theme-main cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}
                      {idx < currentTrip.stops.length - 1 && (
                        <button
                          onClick={() => reorderStops(currentTrip.id, idx, idx + 1)}
                          className="p-2.5 rounded-xl bg-theme-subtle border border-theme text-theme-muted hover:text-theme-main cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeStopFromTrip(currentTrip.id, stop.id)}
                        className="p-2.5 rounded-xl bg-theme-subtle border border-theme text-theme-muted hover:text-rose-500 cursor-pointer"
                        title="Remove Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Date Range & Section Budget Pill (Screen 5 Wireframe Match) */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-5 py-3 rounded-2xl bg-theme-subtle border border-theme text-xs font-bold text-theme-main flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
                      <span>Date Range: {stop.arrival_date} to {stop.departure_date}</span>
                    </div>

                    <div className="px-5 py-3 rounded-2xl bg-theme-subtle border border-theme text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Budget of this section: ${sectionTotalCost}</span>
                    </div>

                    <button
                      onClick={() => setActiveStopForActivity(stop.id)}
                      className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Activity to Section</span>
                    </button>
                  </div>

                  {/* Activities grid inside Section */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted font-header">
                      Section Activities ({stop.activities.length})
                    </h4>

                    {stop.activities.length === 0 ? (
                      <p className="text-xs text-theme-muted italic">
                        No activities added to this section yet. Click "Add Activity to Section".
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stop.activities.map((act) => (
                          <div
                            key={act.id}
                            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                              act.is_completed
                                ? 'bg-theme-subtle/50 border-theme opacity-60'
                                : 'bg-theme-subtle border-theme hover:border-[#007A87] dark:hover:border-[#00E5FF]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleActivityStatus(currentTrip.id, stop.id, act.id)}
                                className="mt-0.5 text-theme-muted hover:text-[#00E5FF] transition-colors cursor-pointer"
                              >
                                {act.is_completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                                ) : (
                                  <Circle className="w-5 h-5 text-theme-muted" />
                                )}
                              </button>
                              <div>
                                <h5
                                  className={`text-sm font-bold font-header ${
                                    act.is_completed ? 'line-through text-theme-muted' : 'text-theme-main'
                                  }`}
                                >
                                  {act.title}
                                </h5>
                                <div className="flex items-center gap-3 text-[11px] text-theme-muted mt-1">
                                  <span>Day {act.day_number}</span>
                                  {act.scheduled_time && <span>• {act.scheduled_time}</span>}
                                  <span>• {act.duration_hours} hrs</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">• ${act.cost}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteActivity(currentTrip.id, stop.id, act.id)}
                              className="text-theme-muted hover:text-rose-500 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Button: "+ Add another Section" (Screen 5 Wireframe Match) */}
        <div className="pt-6 text-center">
          <button
            onClick={() => setIsAddStopOpen(true)}
            className="btn-cta flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black shadow-2xl mx-auto cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add another Section</span>
          </button>
        </div>
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
