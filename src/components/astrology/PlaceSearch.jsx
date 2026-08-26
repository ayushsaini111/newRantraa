"use client";
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Loader } from 'lucide-react';

export default function PlaceSearch({ value, onSelect, error }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [position, setPosition] = useState(null); // { top, left, width }
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const updatePosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  // Recompute position whenever the dropdown opens, and keep it pinned
  // to the input on scroll/resize anywhere in the page (capture:true
  // catches scroll events on inner scroll containers too, not just window).
  useLayoutEffect(() => {
    if (!showSuggestions) return;

    updatePosition();

    const handleReposition = () => updatePosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [showSuggestions, suggestions, loading]);

  const searchPlaces = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/backend/places/search?q=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.places) {
        setSuggestions(data.places);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('❌ Place search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchPlaces(newQuery);
    }, 500);
  };

  const handleSelectPlace = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    onSelect(place);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < suggestions.length - 1 ? prev + 1 : 0;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : suggestions.length - 1;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectPlace(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const scrollIntoView = (index) => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index];
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  };

  const dropdownStyle = position
    ? { position: 'fixed', top: position.top, left: position.left, width: position.width, zIndex: 9999 }
    : { display: 'none' };

  const dropdownContent = (
    <>
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={listRef}
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((place, index) => (
            <button
              key={index}
              id={`place-option-${index}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectPlace(place);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-3 text-left focus:outline-none border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
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

      {showSuggestions && !loading && query.length >= 3 && suggestions.length === 0 && (
        <div style={dropdownStyle} className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
          <div className="text-sm">
            <p className="font-medium">No places found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for a major city or different spelling</p>
          </div>
        </div>
      )}

      {loading && query.length >= 3 && (
        <div style={dropdownStyle} className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Searching places...</span>
          </div>
        </div>
      )}
    </>
  );

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
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-activedescendant={highlightedIndex >= 0 ? `place-option-${highlightedIndex}` : undefined}
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

      {mounted && createPortal(dropdownContent, document.body)}
    </div>
  );
}