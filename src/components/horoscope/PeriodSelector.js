"use client";

import { Calendar } from 'lucide-react';

const PERIODS = [
  { value: 'daily', label: 'Daily', icon: '📅', description: 'Today\'s forecast' },
  { value: 'weekly', label: 'Weekly', icon: '🗓️', description: 'This week' },
  { value: 'monthly', label: 'Monthly', icon: '📆', description: 'This month' },
  { value: 'yearly', label: 'Yearly', icon: '🎯', description: 'This year' }
];

const TIME_SELECTIONS = [
  { id: 'today', label: 'Today', period: 'daily', offset: 0 },
  { id: 'yesterday', label: 'Yesterday', period: 'daily', offset: -1 },
  { id: 'thisweek', label: 'This Week', period: 'weekly', offset: 0 },
  { id: 'lastweek', label: 'Last Week', period: 'weekly', offset: -1 },
  { id: 'thismonth', label: 'This Month', period: 'monthly', offset: 0 },
  { id: 'lastmonth', label: 'Last Month', period: 'monthly', offset: -1 },
  { id: 'thisyear', label: 'This Year', period: 'yearly', offset: 0 },
];

export default function PeriodSelector({ period, setPeriod, selectedDate, setSelectedDate }) {
  const handleTimeSelect = (selection) => {
    setPeriod(selection.period);
    
    const date = new Date();
    
    if (selection.period === 'daily') {
      date.setDate(date.getDate() + selection.offset);
    } else if (selection.period === 'weekly') {
      date.setDate(date.getDate() + (selection.offset * 7));
    } else if (selection.period === 'monthly') {
      date.setMonth(date.getMonth() + selection.offset);
    } else if (selection.period === 'yearly') {
      date.setFullYear(date.getFullYear() + selection.offset);
    }
    
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Determine which time selection is active
  const getActiveSelection = () => {
    const today = new Date().toISOString().split('T')[0];
    const selected = new Date(selectedDate);
    const now = new Date();

    if (period === 'daily') {
      if (selectedDate === today) return 'today';
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (selectedDate === yesterday.toISOString().split('T')[0]) return 'yesterday';
    } else if (period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(weekStart.getDate() - 7);
      
      if (selected >= weekStart) return 'thisweek';
      if (selected >= lastWeekStart) return 'lastweek';
    } else if (period === 'monthly') {
      if (selected.getMonth() === now.getMonth() && selected.getFullYear() === now.getFullYear()) {
        return 'thismonth';
      }
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      if (selected.getMonth() === lastMonth.getMonth() && selected.getFullYear() === lastMonth.getFullYear()) {
        return 'lastmonth';
      }
    } else if (period === 'yearly') {
      if (selected.getFullYear() === now.getFullYear()) return 'thisyear';
    }
    
    return null;
  };

  const activeSelection = getActiveSelection();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        
        {/* Period Buttons */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600" />
            Select Time Period
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
            {PERIODS.map((p) => {
              const isSelected = period === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-transparent shadow-lg scale-105'
                      : 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {p.label}
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {p.description}
                  </div>

                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Time Selection */}
        <div className="lg:w-80">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Quick Select
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {TIME_SELECTIONS.map((selection) => {
              const isActive = activeSelection === selection.id;
              return (
                <button
                  key={selection.id}
                  onClick={() => handleTimeSelect(selection)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                  }`}
                >
                  {selection.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            Select from predefined time periods
          </p>
        </div>
      </div>
    </div>
  );
}