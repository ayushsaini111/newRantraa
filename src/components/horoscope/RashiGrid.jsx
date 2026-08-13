"use client";

const RASHIS = [
  { name: "Aries", emoji: "🐏", symbol: "♈", element: "fire" },
  { name: "Taurus", emoji: "🐂", symbol: "♉", element: "earth" },
  { name: "Gemini", emoji: "👯", symbol: "♊", element: "air" },
  { name: "Cancer", emoji: "🦀", symbol: "♋", element: "water" },
  { name: "Leo", emoji: "🦁", symbol: "♌", element: "fire" },
  { name: "Virgo", emoji: "👧", symbol: "♍", element: "earth" },
  { name: "Libra", emoji: "⚖️", symbol: "♎", element: "air" },
  { name: "Scorpio", emoji: "🦂", symbol: "♏", element: "water" },
  { name: "Sagittarius", emoji: "🏹", symbol: "♐", element: "fire" },
  { name: "Capricorn", emoji: "🐐", symbol: "♑", element: "earth" },
  { name: "Aquarius", emoji: "🏺", symbol: "♒", element: "air" },
  { name: "Pisces", emoji: "🐟", symbol: "♓", element: "water" },
];

const COLORS = {
  fire: "from-red-500 to-orange-500",
  earth: "from-green-600 to-emerald-600",
  air: "from-blue-500 to-cyan-500",
  water: "from-indigo-500 to-purple-500",
};

export default function RashiGrid({ selected, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-2 border-orange-200">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
        Select Your Rashi
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {RASHIS.map((r) => {
          const isSelected = selected === r.name;
          return (
            <button
              key={r.name}
              onClick={() => onSelect(r.name)}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${COLORS[r.element]} text-white border-transparent scale-105 shadow-lg`
                  : 'bg-white border-orange-200 hover:border-orange-400 hover:scale-105'
              }`}
            >
              <div className="text-3xl mb-1">{r.emoji}</div>
              <div className={`text-lg ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {r.symbol}
              </div>
              <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                {r.name}
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
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
  );
}