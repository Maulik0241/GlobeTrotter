import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, PieChart as PieIcon, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Calendar, Compass } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface TripBudgetProps {
  setCurrentTab: (tab: string) => void;
}

export const TripBudget: React.FC<TripBudgetProps> = ({ setCurrentTab }) => {
  const { currentTrip, calculateBudgetBreakdown } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'cost' | 'name'>('cost');

  if (!currentTrip) {
    return (
      <div className="w-full text-center py-20 glass-panel rounded-3xl space-y-4 border border-theme bg-theme-card">
        <h3 className="text-xl font-bold text-theme-main font-header">No Trip Selected</h3>
        <p className="text-xs text-theme-muted">Select an active trip from your collection to view financial analytics.</p>
        <button
          onClick={() => setCurrentTab('my-trips')}
          className="btn-cta px-6 py-3 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
        >
          Explore My Trips
        </button>
      </div>
    );
  }

  const breakdown = calculateBudgetBreakdown(currentTrip);
  const totalEstimated = breakdown.totalEstimated;
  const isOverbudget = breakdown.isOverBudget;
  const variance = Math.abs(currentTrip.total_budget - totalEstimated);
  const totalDays = Math.max(1, currentTrip.stops.length * 3);
  const dailyAverage = Math.round(totalEstimated / totalDays);

  const pieData = [
    { name: 'Transport', value: breakdown.transport, color: '#00E5FF' },
    { name: 'Accommodation / Stay', value: breakdown.stay, color: '#007A87' },
    { name: 'Tours & Activities', value: breakdown.activities, color: '#A855F7' },
    { name: 'Food & Meals', value: breakdown.meals, color: '#FF7A00' },
  ].filter((item) => item.value > 0);

  const barData = currentTrip.stops
    .map((stop) => {
      const stopCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);
      return {
        name: stop.city_name,
        cost: stopCost || 120,
      };
    })
    .filter((stop) => stop.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
            Trip Budget & Cost Analytics
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Financial summary and category breakdown for <span className="font-bold text-[#007A87] dark:text-[#00E5FF]">{currentTrip.name}</span>
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('itinerary-builder')}
          className="px-5 py-3 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-theme-main text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Compass className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
          <span>Back to Builder</span>
        </button>
      </div>

      {/* 2. Top Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full bg-theme-card">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search city expenses..."
            className="w-full pl-11 pr-4 py-2.5 bg-theme-subtle border border-theme rounded-2xl text-theme-main placeholder:text-theme-muted text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
          />
        </div>

        {/* Action Controls: Group by | Filter | Sort by */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <Filter className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] ml-2" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-theme-card">Group by: All Cities</option>
              <option value="Overbudget" className="bg-theme-card">Group by: Overbudget Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="cost" className="bg-theme-card">Sort by: Highest Expense</option>
              <option value="name" className="bg-theme-card">Sort by: City Name</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Budget Alert Banner */}
      {isOverbudget ? (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-start gap-4 shadow-xl">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-black font-header">Budget Cap Limit Warning</h4>
            <p className="text-xs mt-1 leading-relaxed text-theme-main">
              Your estimated expense of <span className="font-bold text-rose-500">${totalEstimated}</span> exceeds your target budget cap of <span className="font-bold text-[#007A87] dark:text-[#00E5FF]">${currentTrip.total_budget}</span> by <span className="font-bold text-rose-500">${variance}</span>. Consider adjusting activities or stay choices.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start gap-4 shadow-xl">
          <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-black font-header">Trip Budget On Track!</h4>
            <p className="text-xs mt-1 leading-relaxed text-theme-main">
              You are currently <span className="font-bold text-emerald-600 dark:text-emerald-400">${variance}</span> under your total target budget cap of <span className="font-bold text-[#007A87] dark:text-[#00E5FF]">${currentTrip.total_budget}</span>.
            </p>
          </div>
        </div>
      )}

      {/* 4. Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Target Budget</span>
            <DollarSign className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
          </div>
          <h3 className="text-3xl font-black text-theme-main font-header">${currentTrip.total_budget}</h3>
          <span className="text-[11px] text-theme-muted font-semibold">User Target Limit</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Estimated Total Spend</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className={`text-3xl font-black font-header ${isOverbudget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ${totalEstimated}
          </h3>
          <span className="text-[11px] text-theme-muted font-semibold">Total Planned Activities</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Avg Daily Spend</span>
            <Calendar className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00]" />
          </div>
          <h3 className="text-3xl font-black text-[#007A87] dark:text-[#00E5FF] font-header">${dailyAverage}/day</h3>
          <span className="text-[11px] text-theme-muted font-semibold">Across {totalDays} total days</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Remaining Buffer</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-header">${breakdown.remaining}</h3>
          <span className="text-[11px] text-theme-muted font-semibold">Safe spending margin</span>
        </div>
      </div>

      {/* 5. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Pie / Donut Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-theme-main font-header flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Cost Breakdown by Category</span>
          </h3>

          <div className="h-64 flex items-center justify-center">
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
                  contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-theme text-xs font-semibold">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-theme-main">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="font-extrabold text-theme-main ml-2">${item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Comparison Bar Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-theme-main font-header flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF5A5F] dark:text-[#FF7A00]" />
            <span>Cost Breakdown by Destination City</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#6C7E8B" fontSize={12} />
                <YAxis stroke="#6C7E8B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
                <Bar dataKey="cost" fill="#007A87" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
