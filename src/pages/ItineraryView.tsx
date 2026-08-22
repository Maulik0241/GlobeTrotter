import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, CheckCircle2, Circle, Share2, Printer, Edit3, LayoutList, CalendarRange } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface ItineraryViewProps {
  setCurrentTab: (tab: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ setCurrentTab }) => {
  const { currentTrip, toggleActivityStatus, calculateBudgetBreakdown } = useTrips();
  const [viewMode, setViewMode] = useState<'timeline' | 'cities'>('timeline');

  if (!currentTrip) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200">No Trip Selected</h3>
        <button
          onClick={() => setCurrentTab('my-trips')}
          className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
        >
          Browse Trips
        </button>
      </div>
    );
  }

  const breakdown = calculateBudgetBreakdown(currentTrip);

  const allActivitiesByDay: { [day: number]: { activity: any; stopName: string }[] } = {};
  currentTrip.stops.forEach((stop) => {
    stop.activities.forEach((act) => {
      if (!allActivitiesByDay[act.day_number]) {
        allActivitiesByDay[act.day_number] = [];
      }
      allActivitiesByDay[act.day_number].push({ activity: act, stopName: stop.city_name });
    });
  });

  const sortedDays = Object.keys(allActivitiesByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      {/* Header Cover Card */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src={currentTrip.cover_photo}
          alt={currentTrip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 filter brightness-75"
        />

        <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Itinerary View
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800">
                {currentTrip.stops.length} Destination Cities
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{currentTrip.name}</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{currentTrip.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                {currentTrip.start_date} to {currentTrip.end_date}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <DollarSign className="w-4 h-4" />
                Est. Total: ${breakdown.totalEstimated} (Budget: ${currentTrip.total_budget})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('itinerary-builder')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Builder</span>
            </button>

            <button
              onClick={() => setCurrentTab('shared-itinerary')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode View Toggle */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'timeline'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            <span>Day-by-Day Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('cities')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'cities'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>Grouped by City</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Content Rendering */}
      {viewMode === 'timeline' ? (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-slate-800">
          {sortedDays.length === 0 ? (
            <p className="text-center py-12 text-slate-400 text-xs">No activities scheduled yet. Open the Itinerary Builder to add items.</p>
          ) : (
            sortedDays.map((dayNum) => (
              <div key={dayNum} className="relative pl-10 sm:pl-14 space-y-4">
                <div className="absolute left-1.5 sm:left-3.5 top-0.5 w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-teal-500/40">
                  {dayNum}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-100">Day {dayNum} Overview</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allActivitiesByDay[dayNum].map(({ activity, stopName }) => (
                    <div
                      key={activity.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleActivityStatus(currentTrip.id, activity.stop_id, activity.id)}
                            className="mt-0.5"
                          >
                            {activity.is_completed ? (
                              <CheckCircle2 className="w-5 h-5 text-teal-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600" />
                            )}
                          </button>
                          <div>
                            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                              {stopName} • {activity.category}
                            </span>
                            <h4
                              className={`text-base font-bold ${
                                activity.is_completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {activity.title}
                            </h4>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400 text-sm">${activity.cost}</span>
                      </div>

                      {activity.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">{activity.description}</p>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400">
                        {activity.scheduled_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{activity.scheduled_time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{activity.duration_hours} hrs duration</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {currentTrip.stops.map((stop) => (
            <div key={stop.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <img src={stop.cover_image} alt={stop.city_name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {stop.city_name}, <span className="text-slate-400 font-normal">{stop.country}</span>
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{stop.arrival_date} to {stop.departure_date}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stop.activities.map((act) => (
                  <div key={act.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Day {act.day_number} • {act.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{act.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{act.description}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">${act.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
