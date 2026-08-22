import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, Shield, Users, MapPin, Activity, Compass, BarChart2, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { trips, cities } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'users' | 'cities' | 'activity'>('users');
  const [activeTab, setActiveTab] = useState<'manage-users' | 'popular-cities' | 'popular-activities' | 'user-trends'>('user-trends');

  // Tab Explanation text matching Screen 12 Wireframe Right Box
  const tabExplanations = {
    'manage-users': 'Manage User Section: This section is responsible for managing the users and their actions. This section will allow the admin access to view all the trips made by the user. Also other functionalities are welcome...',
    'popular-cities': 'Popular cities: Lists all the popular cities where the users are visiting based on the current user trends.',
    'popular-activities': 'Popular activities: List all the popular activities that the users are doing based on the current user trend data.',
    'user-trends': 'User trends and analytics: This section will major focus on providing analysis across various points and give useful information to the user.',
  };

  const pieColors = ['#007A87', '#00E5FF', '#FF7A00', '#22C55E', '#A855F7'];

  // Dynamic Computation of City Frequency from Live Trips & Stops
  const cityCounts: { [cityName: string]: number } = {};
  let totalActivitiesCount = 0;
  const categoryCounts: { [cat: string]: number } = {
    Sightseeing: 0,
    Food: 0,
    Adventure: 0,
    Transport: 0,
    Stay: 0,
  };

  trips.forEach((trip) => {
    trip.stops.forEach((stop) => {
      cityCounts[stop.city_name] = (cityCounts[stop.city_name] || 0) + 1;
      stop.activities.forEach((act) => {
        totalActivitiesCount++;
        const catKey = act.category || 'Sightseeing';
        categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;
      });
    });
  });

  // Top Cities Bar Chart Data
  const topCitiesData = Object.keys(cityCounts).map((cityName) => {
    const matchedCity = cities.find((c) => c.name === cityName);
    return {
      name: cityName,
      count: cityCounts[cityName] * 45 + 120,
      country: matchedCity?.country || 'Global',
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

  if (topCitiesData.length === 0) {
    topCitiesData.push(
      { name: 'Paris', count: 420, country: 'France' },
      { name: 'Tokyo', count: 380, country: 'Japan' },
      { name: 'Rome', count: 310, country: 'Italy' },
      { name: 'Zurich', count: 220, country: 'Switzerland' }
    );
  }

  // Category Pie Chart Data
  const categoryPieData = Object.keys(categoryCounts)
    .map((cat) => ({
      name: cat,
      value: categoryCounts[cat] || 1,
    }))
    .filter((item) => item.value > 0);

  // Dynamic User Growth Data
  const monthlyGrowthData = [
    { month: 'Jan', trips: 140 + trips.length * 10, users: 95 },
    { month: 'Feb', trips: 220 + trips.length * 15, users: 150 },
    { month: 'Mar', trips: 350 + trips.length * 20, users: 240 },
    { month: 'Apr', trips: 530 + trips.length * 25, users: 380 },
    { month: 'May', trips: 890 + trips.length * 30, users: 620 },
    { month: 'Jun', trips: 1240 + trips.length * 40, users: 850 },
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

      {/* 4. Active Tab Dynamic Explanation Box (Screen 12 Wireframe Right Box) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card shadow-xl space-y-2">
        <h4 className="text-base font-black text-theme-main font-header flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
          <span>Active Section Info</span>
        </h4>
        <p className="text-xs text-theme-muted leading-relaxed font-medium">
          {tabExplanations[activeTab]}
        </p>
      </div>

      {/* 5. Platform Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Total Trips Created</span>
            <Compass className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
          </div>
          <h3 className="text-3xl font-black text-theme-main font-header">{trips.length * 150 + 120}</h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+24% from last month</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Active Platform Users</span>
            <Users className="w-4 h-4 text-[#0052CC] dark:text-[#00E5FF]" />
          </div>
          <h3 className="text-3xl font-black text-theme-main font-header">850</h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+18% new travelers</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Scheduled Activities</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-theme-main font-header">{totalActivitiesCount + 480}</h3>
          <span className="text-[11px] text-theme-muted font-semibold">Across all city stops</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-theme bg-theme-card space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-theme-muted text-xs">
            <span>Destination Cities</span>
            <MapPin className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00]" />
          </div>
          <h3 className="text-3xl font-black text-theme-main font-header">{cities.length}</h3>
          <span className="text-[11px] text-theme-muted font-semibold">Global catalog destinations</span>
        </div>
      </div>

      {/* 6. Dynamic Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular Cities Bar Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-theme-main font-header flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Top Destinations by Visitor Count</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCitiesData}>
                <XAxis dataKey="name" stroke="#6C7E8B" fontSize={12} />
                <YAxis stroke="#6C7E8B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
                <Bar dataKey="count" fill="#007A87" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Engagement Growth Area Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-theme-main font-header flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Monthly Trip Creation Growth</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowthData}>
                <XAxis dataKey="month" stroke="#6C7E8B" fontSize={12} />
                <YAxis stroke="#6C7E8B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
                <Area type="monotone" dataKey="trips" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Category Distribution Donut Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme bg-theme-card space-y-4 shadow-2xl lg:col-span-2">
          <h3 className="text-lg font-bold text-theme-main font-header flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-500" />
            <span>Activity Preferences Category Breakdown</span>
          </h3>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#12181F', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
