"use client";

const PERIODS = [
  { id: 'today', label: 'Today', icon: '📅', api: 'daily' },
  { id: 'yesterday', label: 'Yesterday', icon: '📆', api: 'daily' },
  { id: 'thisweek', label: 'This Week', icon: '🗓️', api: 'weekly' },
  { id: 'lastweek', label: 'Last Week', icon: '📋', api: 'weekly' },
  { id: 'thismonth', label: 'This Month', icon: '🗓', api: 'monthly' },
  { id: 'lastmonth', label: 'Last Month', icon: '📅', api: 'monthly' },
  { id: 'yearly', label: 'This Year', icon: '🎯', api: 'yearly' },
];

export default function PeriodSticky({ period, onChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-orange-200">
      <h3 className="font-bold text-lg text-gray-900 mb-3">Time Period</h3>
      
      <div className="space-y-2">
        {PERIODS.map((p) => {
          const isActive = period === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-orange-50 hover:bg-orange-100 text-gray-900'
              }`}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="font-semibold">{p.label}</span>
              
              {isActive && (
                <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}