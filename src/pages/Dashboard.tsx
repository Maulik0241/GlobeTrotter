import React from 'react';
import { Compass, Plus, MapPin, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { CityCard } from '../components/CityCard';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
  openCreateTripModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab, openCreateTripModal }) => {
  const { trips, cities, setSelectedTripId, calculateBudgetBreakdown } = useTrips();
  const { user } = useAuth();

  const activeTripCount = trips.length;
  const totalBudgetSum = trips.reduce((acc, t) => acc + (t.total_budget || 0), 0);
  const totalStopsCount = trips.reduce((acc, t) => acc + t.stops.length, 0);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Travel Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40 filter brightness-75"
        />

        <div className="relative z-20 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Travel Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Dream, Design & Experience{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Your Next Journey.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome back{user ? `, ${user.full_name}` : ''}! Plan multi-city trips, organize day-by-day itineraries, manage estimated budgets, and share your adventures seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={openCreateTripModal}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-teal-500/25 active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Plan New Trip</span>
            </button>

            <button
              onClick={() => setCurrentTab('cities')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <Compass className="w-5 h-5 text-teal-400" />
              <span>Explore Cities</span>
            </button>
          </div>
        </div>
      </section>

      {/* Summary Highlight Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">My Active Trips</p>
            <h3 className="text-2xl font-black text-white">{activeTripCount} Expeditions</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Travel Budget</p>
            <h3 className="text-2xl font-black text-emerald-400">${totalBudgetSum.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Destinations Included</p>
            <h3 className="text-2xl font-black text-white">{totalStopsCount} City Stops</h3>
          </div>
        </div>
      </section>

      {/* Recent Trips Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Your Current & Upcoming Trips</h2>
            <p className="text-xs text-slate-400">Quickly jump back into editing or viewing your itineraries</p>
          </div>
          <button
            onClick={() => setCurrentTab('my-trips')}
            className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>View All Trips</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const breakdown = calculateBudgetBreakdown(trip);
            return (
              <div
                key={trip.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-teal-300 border border-slate-700">
                    {trip.stops.length} Cities
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{trip.start_date} to {trip.end_date}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  {/* Budget summary line */}
                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Est. Cost / Budget</span>
                      <span className="font-bold text-slate-200">${breakdown.totalEstimated} / ${trip.total_budget}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Daily Avg</span>
                      <span className="font-bold text-teal-400">${breakdown.dailyAverage}/day</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-view');
                      }}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-builder');
                      }}
                      className="py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-semibold text-center transition-colors"
                    >
                      Builder
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('trip-budget');
                      }}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors"
                    >
                      Budget
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Destinations */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Popular Travel Destinations</h2>
            <p className="text-xs text-slate-400">Discover trending global cities with cost indices and activities</p>
          </div>
          <button
            onClick={() => setCurrentTab('cities')}
            className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.slice(0, 4).map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onAddToTrip={() => {
                openCreateTripModal();
              }}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
