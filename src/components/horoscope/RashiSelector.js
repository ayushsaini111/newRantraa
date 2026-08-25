"use client";

const RASHIS = [
  { english: "Aries", sanskrit: "मेष", hindi: "मेष राशि", symbol: "♈", emoji: "🐏", element: "Fire", lord: "Mars", dates: "Mar 21 - Apr 19" },
  { english: "Taurus", sanskrit: "वृषभ", hindi: "वृषभ राशि", symbol: "♉", emoji: "🐂", element: "Earth", lord: "Venus", dates: "Apr 20 - May 20" },
  { english: "Gemini", sanskrit: "मिथुन", hindi: "मिथुन राशि", symbol: "♊", emoji: "👯", element: "Air", lord: "Mercury", dates: "May 21 - Jun 20" },
  { english: "Cancer", sanskrit: "कर्क", hindi: "कर्क राशि", symbol: "♋", emoji: "🦀", element: "Water", lord: "Moon", dates: "Jun 21 - Jul 22" },
  { english: "Leo", sanskrit: "सिंह", hindi: "सिंह राशि", symbol: "♌", emoji: "🦁", element: "Fire", lord: "Sun", dates: "Jul 23 - Aug 22" },
  { english: "Virgo", sanskrit: "कन्या", hindi: "कन्या राशि", symbol: "♍", emoji: "👧", element: "Earth", lord: "Mercury", dates: "Aug 23 - Sep 22" },
  { english: "Libra", sanskrit: "तुला", hindi: "तुला राशि", symbol: "♎", emoji: "⚖️", element: "Air", lord: "Venus", dates: "Sep 23 - Oct 22" },
  { english: "Scorpio", sanskrit: "वृश्चिक", hindi: "वृश्चिक राशि", symbol: "♏", emoji: "🦂", element: "Water", lord: "Mars", dates: "Oct 23 - Nov 21" },
  { english: "Sagittarius", sanskrit: "धनु", hindi: "धनु राशि", symbol: "♐", emoji: "🏹", element: "Fire", lord: "Jupiter", dates: "Nov 22 - Dec 21" },
  { english: "Capricorn", sanskrit: "मकर", hindi: "मकर राशि", symbol: "♑", emoji: "🐐", element: "Earth", lord: "Saturn", dates: "Dec 22 - Jan 19" },
  { english: "Aquarius", sanskrit: "कुम्भ", hindi: "कुम्भ राशि", symbol: "♒", emoji: "🏺", element: "Air", lord: "Saturn", dates: "Jan 20 - Feb 18" },
  { english: "Pisces", sanskrit: "मीन", hindi: "मीन राशि", symbol: "♓", emoji: "🐟", element: "Water", lord: "Jupiter", dates: "Feb 19 - Mar 20" }
];

export default function RashiSelector({ selectedRashi, onSelect }) {
  const getElementColor = (element) => {
    const colors = {
      Fire: "from-primary-main to-primary-light",
      Earth: "from-accent-main to-primary-main",
      Air: "from-primary-light to-accent-main",
      Water: "from-primary-main to-accent-main",
    };
    return colors[element] || "from-secondary-dark to-secondary-main";
  };

  const getElementBorder = (element) => {
    const borders = {
      Fire: "border-primary-main/30 hover:border-primary-main",
      Earth: "border-accent-main/30 hover:border-accent-main",
      Air: "border-primary-light/30 hover:border-primary-light",
      Water: "border-primary-main/30 hover:border-primary-main",
    };
    return borders[element] || "border-secondary-dark";
  };

  return (
    <div className="bg-background rounded-2xl shadow-xl p-6 border-2 border-secondary-dark">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-main mb-2">
          🌟 Select Your Rashi
        </h2>
        <p className="text-secondary">Choose your moon sign to view horoscope</p>
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
                  ? `bg-gradient-to-br ${getElementColor(rashi.element)} text-background border-transparent shadow-lg scale-105`
                  : `bg-background hover:bg-secondary-main/20 ${getElementBorder(rashi.element)} hover:shadow-md`
              }`}
            >
              {/* Emoji Icon */}
              <div className="text-4xl mb-2">{rashi.emoji}</div>

              {/* Zodiac Symbol */}
              <div className={`text-2xl mb-1 ${isSelected ? 'text-background' : 'text-main'}`}>
                {rashi.symbol}
              </div>

              {/* Sanskrit Name */}
              <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-background' : 'text-main'}`}>
                {rashi.sanskrit}
              </div>

              {/* English Name */}
              <div className={`text-sm font-medium ${isSelected ? 'text-background/90' : 'text-secondary'}`}>
                {rashi.english}
              </div>

              {/* Element Badge */}
              <div className={`text-xs mt-2 px-2 py-1 rounded-full ${
                isSelected
                  ? 'bg-background/20 text-background'
                  : 'bg-secondary-main/30 text-secondary'
              }`}>
                {rashi.element}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-lg">
                  <svg className="w-5 h-5 text-primary-main" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Hover Effect */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-main/0 to-accent-main/0 group-hover:from-primary-main/5 group-hover:to-accent-main/5 transition-all" />
              )}
            </button>
          );
        })}
      </div>

      {selectedRashi && (
        <div className="mt-6 p-4 bg-primary-main/5 rounded-xl border border-primary-main/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Selected Rashi:</p>
              <p className="text-lg font-bold text-main">
                {selectedRashi.emoji} {selectedRashi.sanskrit} ({selectedRashi.english})
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary">Ruling Planet:</p>
              <p className="text-lg font-bold text-primary-main">{selectedRashi.lord}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { RASHIS };