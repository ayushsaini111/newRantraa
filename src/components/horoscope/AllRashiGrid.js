// components/horoscope/AllRashiGrid.js
"use client";
import { useState, useEffect } from 'react';

const RASHIS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const CATEGORIES = [
  { key: 'general', label: '🌟 General' },
  { key: 'finance', label: '💰 Finance' },
  { key: 'love', label: '❤️ Love' },
  { key: 'career', label: '💼 Career' },
  { key: 'health', label: '🏥 Health' }
];

export default function AllRashiGrid() {
  const [horoscopes, setHoroscopes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch('/api/horoscope/generate')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHoroscopes(data.horoscopes);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading today's horoscopes...</p>;
  if (!horoscopes) return <p>Failed to load.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {RASHIS.map(name => {
        const h = horoscopes[name];
        const isOpen = expanded === name;
        return (
          <div key={name} className="bg-white rounded-xl shadow p-5 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{name}</h3>
              <button
                onClick={() => setExpanded(isOpen ? null : name)}
                className="text-xs text-orange-600 font-medium"
              >
                {isOpen ? 'Show less' : 'Show all'}
              </button>
            </div>

            <p className="text-sm text-gray-700">{h?.general}</p>

            {isOpen && (
              <div className="mt-3 space-y-2 border-t pt-3">
                {CATEGORIES.filter(c => c.key !== 'general').map(c => (
                  <div key={c.key}>
                    <p className="text-xs font-semibold text-gray-500">{c.label}</p>
                    <p className="text-sm text-gray-700">{h?.[c.key]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}