"use client";
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';

export default function PlaceSearch({ value, onSelect, error }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const searchPlaces = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      console.log(`🔍 Searching for: "${searchQuery}"`);
      
      // FIXED: Use correct API endpoint
      const response = await fetch(`/backend/places/search?q=${encodeURIComponent(searchQuery)}`);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📝 Response data:', data);
      
      if (data.success && data.places) {
        setSuggestions(data.places);
        setShowSuggestions(true);
        console.log(`✅ Found ${data.places.length} places`);
      } else {
        setSuggestions([]);
        console.log('❌ No places found or error:', data.error);
      }
    } catch (error) {
      console.error('❌ Place search error:', error);
      setSuggestions([]);
      
      // Show user-friendly error
      if (error.message.includes('500')) {
        console.error('Server error - check API endpoint');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);
    
    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(newQuery);
    }, 500); // Increased debounce to 500ms
  };

  const handleSelectPlace = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelect(place);
    console.log('✅ Selected place:', place.display_name);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for your birth city... (e.g., Mumbai, Delhi)"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectPlace(place)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {place.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && !loading && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
          <div className="text-sm">
            <p className="font-medium">No places found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for a major city or different spelling</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Searching places...</span>
          </div>
        </div>
      )}
    </div>
  );
}