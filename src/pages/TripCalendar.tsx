import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface TripCalendarProps {
  setCurrentTab: (tab: string) => void;
}

export const TripCalendar: React.FC<TripCalendarProps> = ({ setCurrentTab }) => {
  const { currentTrip } = useTrips();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  if (!currentTrip) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200">No Trip Selected</h3>
        <button onClick={() => setCurrentTab('my-trips')} className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
          Select Trip
        </button>
      </div>
    );
  }

  const start = new Date(currentTrip.start_date);
  const end = new Date(currentTrip.end_date);
  const totalDays = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);

  const dayActivities: any[] = [];
  currentTrip.stops.forEach((stop) => {
    stop.activities.forEach((act) => {
      if (act.day_number === selectedDayNumber) {
        dayActivities.push({ ...act, cityName: stop.city_name });
      }
    });
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Trip Calendar & Daily Flow</h1>
          <p className="text-xs text-slate-400">Day-by-day visual timeline for {currentTrip.name}</p>
        </div>

        <button
          onClick={() => setCurrentTab('itinerary-builder')}
          className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs self-start sm:self-auto"
        >
          Open Builder
        </button>
      </div>

      {/* Day Selector Ribbon */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl overflow-x-auto flex items-center gap-2 shadow-xl">
        {dayNumbers.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDayNumber(d)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedDayNumber === d
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20 scale-105'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* Selected Day Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-400" />
            <span>Day {selectedDayNumber} Schedule</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{dayActivities.length} Planned Events</span>
        </div>

        {dayActivities.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No events scheduled for Day {selectedDayNumber} yet.</p>
            <button
              onClick={() => setCurrentTab('itinerary-builder')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
            >
              Add Activity to Day {selectedDayNumber}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dayActivities.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span>{act.scheduled_time || '10:00'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-teal-300">
                        {act.cityName}
                      </span>
                      <span className="text-[10px] text-slate-400">• {act.category}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100">{act.title}</h4>
                    <p className="text-xs text-slate-400">{act.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 block">${act.cost}</span>
                  <span className="text-[11px] text-slate-500">{act.duration_hours} hrs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
