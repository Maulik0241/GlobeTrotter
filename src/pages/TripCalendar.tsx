import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrips } from '../context/TripContext';

interface TripCalendarProps {
  setCurrentTab: (tab: string) => void;
}

export const TripCalendar: React.FC<TripCalendarProps> = ({ setCurrentTab }) => {
  const { trips, setSelectedTripId } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  // Generate calendar grid days
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: ({ dayNum: number; dateStr: string } | null)[] = [];

  // Padding cells before day 1
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }

  // Days of the month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({ dayNum: d, dateStr });
  }

  // Sample trip blocks for calendar matching Screen 11 Wireframe
  const tripEvents = [
    { id: 'trip-demo-1', title: 'PARIS TRIP', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30', dates: ['2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07'] },
    { id: 'trip-demo-2', title: 'NYC GETAWAY', color: 'bg-cyan-500/20 text-[#007A87] dark:text-[#00E5FF] border-cyan-500/30', dates: ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-28'] },
    { id: 'trip-demo-3', title: 'JAPAN ADVENTURE', color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30', dates: ['2026-08-16', '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21'] },
  ];

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
          Calendar View
        </h1>
        <p className="text-xs sm:text-sm text-theme-muted mt-1">Full-month calendar timeline overview of scheduled trips and events.</p>
      </div>

      {/* 2. Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 11 Mockup) */}
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
              <option value="All" className="bg-theme-card">Group by: All Months</option>
              <option value="Active" className="bg-theme-card">Group by: Active Trips</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="date" className="bg-theme-card">Sort by: Month Order</option>
              <option value="name" className="bg-theme-card">Sort by: Trip Name</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Main Title Header (Screen 11 Wireframe Match) */}
      <div className="text-center py-2">
        <h2 className="text-2xl sm:text-3xl font-black text-theme-main font-header tracking-tight">
          Calendar View
        </h2>
      </div>

      {/* 4. Full Month Calendar Container (Screen 11 Wireframe Match) */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-theme bg-theme-card shadow-2xl space-y-6 w-full">
        
        {/* Month & Year Navigation Header: ← Month Year → */}
        <div className="flex items-center justify-between max-w-md mx-auto py-2 border-b border-theme">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 rounded-2xl bg-theme-subtle border border-theme hover:brightness-95 text-theme-main transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="text-xl sm:text-2xl font-black text-theme-main font-header">
            {monthNames[month]} {year}
          </h3>

          <button
            onClick={handleNextMonth}
            className="p-2.5 rounded-2xl bg-theme-subtle border border-theme hover:brightness-95 text-theme-main transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Row (SUN MON TUE WED THU FRI SAT) */}
        <div className="grid grid-cols-7 gap-2 text-center font-black text-xs text-theme-muted uppercase tracking-wider font-header pb-2">
          {daysOfWeek.map((dayName) => (
            <div key={dayName} className="py-2">
              {dayName}
            </div>
          ))}
        </div>

        {/* 7-Column Calendar Days Grid (Screen 11 Wireframe Grid Match) */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 w-full">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-28 sm:h-36 rounded-2xl bg-theme-subtle/20 border border-theme/30 opacity-40"
                />
              );
            }

            // Check if any trip event falls on this date
            const matchingEvents = tripEvents.filter((evt) => evt.dates.includes(cell.dateStr));

            return (
              <div
                key={cell.dateStr}
                className="h-28 sm:h-36 p-2 rounded-2xl bg-theme-subtle border border-theme flex flex-col justify-between hover:border-[#007A87] dark:hover:border-[#00E5FF] transition-all shadow-sm group"
              >
                <span className="text-xs font-bold text-theme-main font-header">{cell.dayNum}</span>

                {/* Event Pills inside Day Cell (Screen 11 Wireframe Match) */}
                <div className="space-y-1 overflow-y-auto">
                  {matchingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        setSelectedTripId(trips[0]?.id || 'trip-1');
                        setCurrentTab('itinerary-view');
                      }}
                      className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase border truncate cursor-pointer transition-transform hover:scale-105 shadow-sm ${evt.color}`}
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
