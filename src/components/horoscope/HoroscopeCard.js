// components/horoscope/HoroscopeCard.js
"use client";

import { Star, TrendingUp, Heart, Briefcase, Activity } from 'lucide-react';

export default function HoroscopeCard({ rashi, horoscope, period, date }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPeriodText = () => {
    const texts = {
      daily: 'Daily Horoscope',
      weekly: 'Weekly Horoscope',
      monthly: 'Monthly Horoscope',
      yearly: 'Yearly Horoscope'
    };
    return texts[period] || 'Horoscope';
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{rashi.emoji}</div>
            <div>
              <h2 className="text-3xl font-bold">{rashi.sanskrit}</h2>
              <p className="text-orange-100">{rashi.english} {rashi.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-orange-100">Ruling Planet</p>
              <p className="text-lg font-bold">{rashi.lord}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-orange-400/30">
          <div>
            <p className="text-orange-100 text-sm">{getPeriodText()}</p>
            <p className="font-semibold">{formatDate(date)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            <span className="text-xl font-bold">{horoscope.overallRating}/5</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        
        {/* General Prediction */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-200">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-lg text-gray-900">General Prediction</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{horoscope.general}</p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Finance */}
          <CategoryCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Finance & Wealth"
            content={horoscope.finance}
            rating={horoscope.ratings.finance}
            color="green"
          />

          {/* Love */}
          <CategoryCard
            icon={<Heart className="w-5 h-5" />}
            title="Love & Relationships"
            content={horoscope.love}
            rating={horoscope.ratings.love}
            color="pink"
          />

          {/* Career */}
          <CategoryCard
            icon={<Briefcase className="w-5 h-5" />}
            title="Career & Business"
            content={horoscope.career}
            rating={horoscope.ratings.career}
            color="blue"
          />

          {/* Health */}
          <CategoryCard
            icon={<Activity className="w-5 h-5" />}
            title="Health & Wellness"
            content={horoscope.health}
            rating={horoscope.ratings.health}
            color="red"
          />
        </div>

        {/* Lucky Details */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🍀</span>
            Lucky Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LuckyItem label="Color" value={horoscope.luckyDetails.color} icon="🎨" />
            <LuckyItem label="Number" value={horoscope.luckyDetails.number} icon="🔢" />
            <LuckyItem label="Time" value={horoscope.luckyDetails.time} icon="⏰" />
            <LuckyItem label="Direction" value={horoscope.luckyDetails.direction} icon="🧭" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ icon, title, content, rating, color }) {
  const colorClasses = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
      star: 'text-green-500'
    },
    pink: {
      bg: 'from-pink-50 to-rose-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      star: 'text-pink-500'
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      star: 'text-blue-500'
    },
    red: {
      bg: 'from-red-50 to-orange-50',
      border: 'border-red-200',
      text: 'text-red-700',
      star: 'text-red-500'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 border-2 ${colors.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center space-x-2 ${colors.text}`}>
          {icon}
          <h4 className="font-bold text-sm">{title}</h4>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < rating
                  ? `fill-current ${colors.star}`
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}

function LuckyItem({ label, value, icon }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}