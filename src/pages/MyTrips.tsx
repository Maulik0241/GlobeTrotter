import React, { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Share2, Trash2, Edit3, Eye, LayoutGrid, List, Compass } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface MyTripsProps {
  setCurrentTab: (tab: string) => void;
  openCreateTripModal: () => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({ setCurrentTab, openCreateTripModal }) => {
  const { trips, setSelectedTripId, deleteTrip, calculateBudgetBreakdown } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredTrips = trips.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.stops.some((s) => s.city_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full space-y-8 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100">My Expeditions & Trips</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, organize, and customize your travel plans</p>
        </div>

        <button
          onClick={openCreateTripModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-teal-500/25 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Search & Layout toggle bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-3xl shadow-lg border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trips, cities, descriptions..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'grid' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'table' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Trip List Render */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
            <Compass className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-200">No Trips Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first personalized multi-city trip now!'}
          </p>
          <button
            onClick={openCreateTripModal}
            className="px-6 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors"
          >
            Plan Trip
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredTrips.map((trip) => {
            const breakdown = calculateBudgetBreakdown(trip);
            return (
              <div
                key={trip.id}
                className="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-teal-300 border border-slate-700">
                      {trip.stops.length} Cities
                    </span>
                    {trip.is_public && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Public Share
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-950/70 hover:bg-rose-500 text-slate-400 hover:text-white transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{trip.start_date} ~ {trip.end_date}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {trip.stops.map((stop) => (
                      <span
                        key={stop.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 text-slate-300 border border-slate-800 flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-teal-400" />
                        <span>{stop.city_name}</span>
                      </span>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Est. Cost / Budget</span>
                      <span className="font-bold text-slate-200">${breakdown.totalEstimated} / ${trip.total_budget}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Share Code</span>
                      <span className="font-mono text-teal-400 font-bold">{trip.share_code}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-view');
                      }}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('itinerary-builder');
                      }}
                      className="py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Builder</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentTab('shared-itinerary');
                      }}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-xl w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Trip Name</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Cities</th>
                  <th className="px-6 py-4">Budget / Est.</th>
                  <th className="px-6 py-4">Share Code</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTrips.map((trip) => {
                  const breakdown = calculateBudgetBreakdown(trip);
                  return (
                    <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-3">
                        <img src={trip.cover_photo} alt={trip.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-sm">{trip.name}</span>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">{trip.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {trip.start_date} ~ {trip.end_date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-slate-950 text-teal-300 border border-slate-800 font-bold">
                          {trip.stops.length} Cities
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        ${breakdown.totalEstimated} / <span className="text-emerald-400">${trip.total_budget}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-teal-400 font-bold">{trip.share_code}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTripId(trip.id);
                            setCurrentTab('itinerary-view');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTripId(trip.id);
                            setCurrentTab('itinerary-builder');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-bold text-xs"
                        >
                          Builder
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
