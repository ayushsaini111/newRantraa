// components/horoscope/RashiSelector.js
"use client";

const RASHIS = [
  {
    english: "Aries",
    sanskrit: "मेष",
    hindi: "मेष राशि",
    symbol: "♈",
    emoji: "🐏",
    element: "Fire",
    lord: "Mars",
    dates: "Mar 21 - Apr 19"
  },
  {
    english: "Taurus",
    sanskrit: "वृषभ",
    hindi: "वृषभ राशि",
    symbol: "♉",
    emoji: "🐂",
    element: "Earth",
    lord: "Venus",
    dates: "Apr 20 - May 20"
  },
  {
    english: "Gemini",
    sanskrit: "मिथुन",
    hindi: "मिथुन राशि",
    symbol: "♊",
    emoji: "👯",
    element: "Air",
    lord: "Mercury",
    dates: "May 21 - Jun 20"
  },
  {
    english: "Cancer",
    sanskrit: "कर्क",
    hindi: "कर्क राशि",
    symbol: "♋",
    emoji: "🦀",
    element: "Water",
    lord: "Moon",
    dates: "Jun 21 - Jul 22"
  },
  {
    english: "Leo",
    sanskrit: "सिंह",
    hindi: "सिंह राशि",
    symbol: "♌",
    emoji: "🦁",
    element: "Fire",
    lord: "Sun",
    dates: "Jul 23 - Aug 22"
  },
  {
    english: "Virgo",
    sanskrit: "कन्या",
    hindi: "कन्या राशि",
    symbol: "♍",
    emoji: "👧",
    element: "Earth",
    lord: "Mercury",
    dates: "Aug 23 - Sep 22"
  },
  {
    english: "Libra",
    sanskrit: "तुला",
    hindi: "तुला राशि",
    symbol: "♎",
    emoji: "⚖️",
    element: "Air",
    lord: "Venus",
    dates: "Sep 23 - Oct 22"
  },
  {
    english: "Scorpio",
    sanskrit: "वृश्चिक",
    hindi: "वृश्चिक राशि",
    symbol: "♏",
    emoji: "🦂",
    element: "Water",
    lord: "Mars",
    dates: "Oct 23 - Nov 21"
  },
  {
    english: "Sagittarius",
    sanskrit: "धनु",
    hindi: "धनु राशि",
    symbol: "♐",
    emoji: "🏹",
    element: "Fire",
    lord: "Jupiter",
    dates: "Nov 22 - Dec 21"
  },
  {
    english: "Capricorn",
    sanskrit: "मकर",
    hindi: "मकर राशि",
    symbol: "♑",
    emoji: "🐐",
    element: "Earth",
    lord: "Saturn",
    dates: "Dec 22 - Jan 19"
  },
  {
    english: "Aquarius",
    sanskrit: "कुम्भ",
    hindi: "कुम्भ राशि",
    symbol: "♒",
    emoji: "🏺",
    element: "Air",
    lord: "Saturn",
    dates: "Jan 20 - Feb 18"
  },
  {
    english: "Pisces",
    sanskrit: "मीन",
    hindi: "मीन राशि",
    symbol: "♓",
    emoji: "🐟",
    element: "Water",
    lord: "Jupiter",
    dates: "Feb 19 - Mar 20"
  }
];

export default function RashiSelector({ selectedRashi, onSelect }) {
  const getElementColor = (element) => {
    const colors = {
      Fire: "from-red-500 to-orange-500",
      Earth: "from-green-600 to-emerald-600",
      Air: "from-blue-500 to-cyan-500",
      Water: "from-indigo-500 to-purple-500"
    };
    return colors[element] || "from-gray-500 to-gray-600";
  };

  const getElementBorder = (element) => {
    const borders = {
      Fire: "border-red-300 hover:border-red-500",
      Earth: "border-green-300 hover:border-green-500",
      Air: "border-blue-300 hover:border-blue-500",
      Water: "border-indigo-300 hover:border-indigo-500"
    };
    return borders[element] || "border-gray-300";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🌟 Select Your Rashi
        </h2>
        <p className="text-gray-600">Choose your moon sign to view horoscope</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {RASHIS.map((rashi) => {
          const isSelected = selectedRashi?.english === rashi.english;
          
          return (
            <button
              key={rashi.english}
              onClick={() => onSelect(rashi)}
              className={`relative group rounded-xl p-4 border-2 transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-br ${getElementColor(rashi.element)} text-white border-transparent shadow-lg scale-105`
                  : `bg-white hover:bg-gray-50 ${getElementBorder(rashi.element)} hover:shadow-md`
              }`}
            >
              {/* Emoji Icon */}
              <div className="text-4xl mb-2">{rashi.emoji}</div>

              {/* Zodiac Symbol */}
              <div className={`text-2xl mb-1 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {rashi.symbol}
              </div>

              {/* Sanskrit Name */}
              <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {rashi.sanskrit}
              </div>

              {/* English Name */}
              <div className={`text-sm font-medium ${isSelected ? 'text-white/90' : 'text-gray-700'}`}>
                {rashi.english}
              </div>

              {/* Dates */}
          
              {/* Element Badge */}
              <div className={`text-xs mt-2 px-2 py-1 rounded-full ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {rashi.element}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Hover Effect */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-red-400/0 group-hover:from-orange-400/10 group-hover:to-red-400/10 transition-all" />
              )}
            </button>
          );
        })}
      </div>

      {selectedRashi && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected Rashi:</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedRashi.emoji} {selectedRashi.sanskrit} ({selectedRashi.english})
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Ruling Planet:</p>
              <p className="text-lg font-bold text-orange-700">{selectedRashi.lord}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { RASHIS };