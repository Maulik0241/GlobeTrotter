import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, Shield, Users, MapPin, Activity, Compass, BarChart2, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const stats = MOCK_ADMIN_STATS;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'users' | 'cities' | 'activity'>('users');

  const [activeTab, setActiveTab] = useState<'manage-users' | 'popular-cities' | 'popular-activities' | 'user-trends'>('user-trends');

  // Tab Explanation text matching Screen 12 Wireframe Right Box
  const tabExplanations = {
    'manage-users': 'Manage User Section: This section is responsible for the managing the users and their actions. This section will allow the admin access to view all the trips made by the user. Also other functionalities are welcome...',
    'popular-cities': 'Popular cities: Lists all the popular cities where the users are visiting based on the current user trends.',
    'popular-activities': 'Popular activities: List all the popular activities that the users are doing based on the current user trend data.',
    'user-trends': 'User trends and analytics: This section will major focus on the providing analysis across various points and give useful information to the user.',
  };

  const pieColors = ['#007A87', '#00E5FF', '#FF7A00', '#22C55E', '#A855F7'];

  const categoryPieData = [
    { name: 'Sightseeing', value: 45 },
    { name: 'Food & Culinary', value: 25 },
    { name: 'Adventure', value: 15 },
    { name: 'Transport & Stay', value: 15 },
  ];

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] border border-[#007A87]/30 dark:border-[#00E5FF]/30 flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
            Admin Panel Insights
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">Platform administration, user management, city trends, and analytics.</p>
        </div>
      </div>

      {/* 2. Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 12 Mockup) */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full bg-theme-card">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bar ..."
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
              <option value="All" className="bg-theme-card">Group by: All Data</option>
              <option value="Active" className="bg-theme-card">Group by: Active Users</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="users" className="bg-theme-card">Sort by: User Count</option>
              <option value="cities" className="bg-theme-card">Sort by: Popular Cities</option>
              <option value="activity" className="bg-theme-card">Sort by: Activity Volume</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Horizontal Navigation Tabs (Screen 12 Wireframe Match) */}
      <div className="flex flex-wrap items-center gap-3 w-full border-b border-theme pb-4">
        <button
          onClick={() => setActiveTab('manage-users')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'manage-users'
              ? 'btn-cta text-slate-950 font-black shadow-lg scale-105'
              : 'bg-theme-subtle border border-theme text-theme-main hover:brightness-95'
          }`}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActiveTab('popular-cities')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'popular-cities'
              ? 'btn-cta text-slate-950 font-black shadow-lg scale-105'
              : 'bg-theme-subtle border border-theme text-theme-main hover:brightness-95'
          }`}
        >
          Popular cities
        </button>

        <button
          onClick={() => setActiveTab('popular-activities')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'popular-activities'
              ? 'btn-cta text-slate-950 font-black shadow-lg scale-105'
              : 'bg-theme-subtle border border-theme text-theme-main hover:brightness-95'
          }`}
        >
          Popular activities
        </button>

        <button
          onClick={() => setActiveTab('user-trends')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'user-trends'
              ? 'btn-cta text-slate-950 font-black shadow-lg scale-105'
              : 'bg-theme-subtle border border-theme text-theme-main hover:brightness-95'
          }`}
        >
          User Trends and analytics
        </button>
      </div>

      {/* 4. Tab Explanation Banner matching Screen 12 Wireframe Right Text Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card shadow-xl space-y-2">
        <p className="text-xs sm:text-sm text-theme-main leading-relaxed font-medium">
          {tabExplanations[activeTab]}
        </p>
      </div>

      {/* 5. Main Analytics Dashboard Canvas (Screen 12 Wireframe Match: Pie Chart, Line Chart, Bar Chart & Stats) */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-theme bg-theme-card shadow-2xl space-y-8 w-full">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-theme-subtle border border-theme space-y-1">
            <div className="flex items-center justify-between text-theme-muted text-xs">
              <span>Total Trips</span>
              <Compass className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            </div>
            <h3 className="text-2xl font-black text-theme-main font-header">{stats.totalTrips.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+24% vs last month</span>
          </div>

          <div className="p-5 rounded-2xl bg-theme-subtle border border-theme space-y-1">
            <div className="flex items-center justify-between text-theme-muted text-xs">
              <span>Active Travelers</span>
              <Users className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <h3 className="text-2xl font-black text-theme-main font-header">{stats.activeUsers.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+18% new signups</span>
          </div>

          <div className="p-5 rounded-2xl bg-theme-subtle border border-theme space-y-1">
            <div className="flex items-center justify-between text-theme-muted text-xs">
              <span>Top Destination</span>
              <MapPin className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-300 font-header">{stats.topCities[0].name}</h3>
            <span className="text-[11px] text-theme-muted font-semibold">{stats.topCities[0].count} itineraries</span>
          </div>

          <div className="p-5 rounded-2xl bg-theme-subtle border border-theme space-y-1">
            <div className="flex items-center justify-between text-theme-muted text-xs">
              <span>System Health</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-header">99.9%</h3>
            <span className="text-[11px] text-theme-muted font-semibold">Cloud sync active</span>
          </div>
        </div>

        {/* Charts Grid matching Screen 12 Wireframe Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pie / Donut Chart Section (Screen 12 Top Right Chart) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-theme-subtle border border-theme space-y-4">
            <h3 className="text-base font-bold text-theme-main font-header flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
              <span>Activity Distribution Breakdown</span>
            </h3>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2 border-t border-theme">
              {categoryPieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-theme-main">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                  <span className="truncate">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart Section: User Trends over time (Screen 12 Middle Line Chart) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-theme-subtle border border-theme space-y-4">
            <h3 className="text-base font-bold text-theme-main font-header flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF5A5F] dark:text-[#FF7A00]" />
              <span>User Adoption & Growth Trends</span>
            </h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorTripsAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6C7E8B" fontSize={12} />
                  <YAxis stroke="#6C7E8B" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
                  <Area type="monotone" dataKey="trips" stroke="#00E5FF" fillOpacity={1} fill="url(#colorTripsAdmin)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Bar Chart Section: Popular Cities & Activities (Screen 12 Bottom Bar Chart) */}
        <div className="p-6 rounded-3xl bg-theme-subtle border border-theme space-y-4">
          <h3 className="text-base font-bold text-theme-main font-header flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-500" />
            <span>Popular Destination Cities Ranking</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topCities}>
                <XAxis dataKey="name" stroke="#6C7E8B" fontSize={11} />
                <YAxis stroke="#6C7E8B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
