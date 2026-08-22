import React from 'react';
import { Compass, Plus, MapPin, Calendar, DollarSign, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
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
    <div className="w-full space-y-12 pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 p-8 sm:p-12 md:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
          alt="GlobeTrotter Travel Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-45 filter brightness-75 scale-105"
        />

        <div className="relative z-20 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Travel Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            Dream, Design & Experience{' '}
            <span className="text-gradient-teal block mt-2">
              Your Next Global Adventure.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Welcome back{user ? `, ${user.full_name}` : ''}! Effortlessly plan multi-city journeys, organize day-by-day itineraries, track budgets automatically, and collaborate with travelers worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={openCreateTripModal}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-teal-500/30 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Plan New Trip</span>
            </button>

            <button
              onClick={() => setCurrentTab('cities')}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-100 font-bold text-sm border border-slate-700/80 transition-all hover:border-slate-600"
            >
              <Compass className="w-5 h-5 text-teal-400" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric Highlight Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div className="glass-card rounded-3xl p-6 flex items-center gap-4 shadow-xl border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">My Active Trips</p>
            <h3 className="text-3xl font-black text-white mt-0.5">{activeTripCount} Expeditions</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-4 shadow-xl border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Travel Budget</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-0.5">${totalBudgetSum.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-4 shadow-xl border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Destinations Included</p>
            <h3 className="text-3xl font-black text-white mt-0.5">{totalStopsCount} City Stops</h3>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex items-center gap-4 shadow-xl border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Itinerary Score</p>
            <h3 className="text-3xl font-black text-teal-300 mt-0.5">98.5% Optimized</h3>
          </div>
        </div>
      </section>

      {/* Your Upcoming Trips Section */}
      <section className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Your Current & Upcoming Trips</h2>
            <p className="text-xs text-slate-400 mt-1">Quickly access, edit, or customize your day-by-day itineraries</p>
          </div>
          <button
            onClick={() => setCurrentTab('my-trips')}
            className="flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors self-start sm:self-auto"
          >
            <span>View All Trips</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {trips.map((trip) => {
            const breakdown = calculateBudgetBreakdown(trip);
            return (
              <div
                key={trip.id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-800/80 hover:border-slate-700"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-teal-300 border border-slate-700">
                    {trip.stops.length} Cities
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{trip.start_date} ~ {trip.end_date}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Est. Spend / Budget</span>
                      <span className="font-bold text-slate-200">${breakdown.totalEstimated} / ${trip.total_budget}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Daily Avg</span>
                      <span className="font-bold text-teal-400">${breakdown.dailyAverage}/day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-view');
                      }}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-builder');
                      }}
                      className="py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-bold text-center transition-colors"
                    >
                      Builder
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('trip-budget');
                      }}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center transition-colors"
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

      {/* Recommended Popular Destinations Section */}
      <section className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Popular Global Destinations</h2>
            <p className="text-xs text-slate-400 mt-1">Discover trending cities with cost indices, activity guides, and ratings</p>
          </div>
          <button
            onClick={() => setCurrentTab('cities')}
            className="flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
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
