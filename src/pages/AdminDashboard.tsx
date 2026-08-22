import React from 'react';
import { Shield, TrendingUp, Users, MapPin, Compass, BarChart2, Activity } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const stats = MOCK_ADMIN_STATS;

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-100">GlobeTrotter Platform Admin Insights</h1>
          <p className="text-xs text-slate-400">Track platform usage, user adoption trends, and popular destination metrics</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Trips Created</span>
            <Compass className="w-4 h-4 text-teal-400" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats.totalTrips.toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-400 font-semibold">+24% vs last month</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Platform Travelers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats.activeUsers.toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-400 font-semibold">+18% new signups</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Top Destination</span>
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-3xl font-black text-purple-300">{stats.topCities[0].name}</h3>
          <span className="text-[11px] text-slate-400 font-semibold">{stats.topCities[0].count} itinerary bookings</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-emerald-400">99.9%</h3>
          <span className="text-[11px] text-slate-400 font-semibold">Supabase sync active</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Adoption Growth Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span>Monthly Trip & User Adoption Growth</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyGrowth}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="trips" stroke="#14B8A6" fillOpacity={1} fill="url(#colorTrips)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Destination Cities Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-400" />
            <span>Most Popular Destination Cities</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topCities}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
