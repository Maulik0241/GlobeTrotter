import React from 'react';
import { PieChart as PieIcon, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface TripBudgetProps {
  setCurrentTab: (tab: string) => void;
}

export const TripBudget: React.FC<TripBudgetProps> = ({ setCurrentTab }) => {
  const { currentTrip, calculateBudgetBreakdown } = useTrips();

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

  const breakdown = calculateBudgetBreakdown(currentTrip);
  const isOverbudget = breakdown.totalEstimated > currentTrip.total_budget;
  const variance = Math.abs(currentTrip.total_budget - breakdown.totalEstimated);

  const pieData = [
    { name: 'Transport', value: breakdown.transport, color: '#06B6D4' },
    { name: 'Accommodation / Stay', value: breakdown.stay, color: '#3B82F6' },
    { name: 'Tours & Activities', value: breakdown.activities, color: '#A855F7' },
    { name: 'Food & Meals', value: breakdown.meals, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  const barData = currentTrip.stops.map((stop) => {
    const totalCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);
    return {
      name: stop.city_name,
      cost: totalCost || stop.activities.length * 50,
    };
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Trip Budget & Cost Analytics</h1>
          <p className="text-xs text-slate-400">Financial summary for {currentTrip.name}</p>
        </div>

        <button
          onClick={() => setCurrentTab('itinerary-builder')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto"
        >
          Back to Builder
        </button>
      </div>

      {/* Overbudget Warning Alert */}
      {isOverbudget ? (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4 shadow-xl">
          <AlertTriangle className="w-6 h-6 shrink-0 text-rose-400" />
          <div>
            <h4 className="text-sm font-bold text-rose-200">Budget Limit Warning</h4>
            <p className="text-xs mt-0.5 leading-relaxed">
              Your estimated expense of <span className="font-bold">${breakdown.totalEstimated}</span> exceeds your target budget cap of <span className="font-bold">${currentTrip.total_budget}</span> by <span className="font-bold">${variance}</span>. Consider adjusting activity choices or accommodation estimates.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 shadow-xl">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200">Trip Budget On Track!</h4>
            <p className="text-xs mt-0.5 leading-relaxed">
              You are currently <span className="font-bold">${variance}</span> under your total target budget. Great financial discipline!
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Target Budget</span>
          <h3 className="text-2xl font-black text-white">${currentTrip.total_budget}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Estimated Total Spend</span>
          <h3 className={`text-2xl font-black ${isOverbudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${breakdown.totalEstimated}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Average Spend / Day</span>
          <h3 className="text-2xl font-black text-teal-400">${breakdown.dailyAverage}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Overbudget Warning Days</span>
          <h3 className="text-2xl font-black text-amber-400">{breakdown.overbudgetDays.length} Days</h3>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-teal-400" />
            <span>Cost Category Distribution</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="font-bold text-white">${item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Comparison Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Cost by City Destination</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="cost" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
