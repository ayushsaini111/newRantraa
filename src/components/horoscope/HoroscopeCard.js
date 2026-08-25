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
    <div className="bg-background rounded-2xl shadow-2xl overflow-hidden border-2 border-secondary-dark">

      {/* Header */}
      <div className="bg-primary-main p-6 text-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{rashi.emoji}</div>
            <div>
              <h2 className="text-3xl font-bold">{rashi.sanskrit}</h2>
              <p className="text-background/80">{rashi.english} {rashi.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-background/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-background/80">Ruling Planet</p>
              <p className="text-lg font-bold">{rashi.lord}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-background/20">
          <div>
            <p className="text-background/80 text-sm">{getPeriodText()}</p>
            <p className="font-semibold">{formatDate(date)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 fill-background text-background" />
            <span className="text-xl font-bold">{horoscope.overallRating}/5</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        {/* General Prediction */}
        <div className="bg-primary-main/5 rounded-xl p-5 border-2 border-primary-main/20">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-primary-main" />
            <h3 className="font-bold text-lg text-main">General Prediction</h3>
          </div>
          <p className="text-secondary leading-relaxed">{horoscope.general}</p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-4">

          <CategoryCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Finance & Wealth"
            content={horoscope.finance}
            rating={horoscope.ratings.finance}
            color="primary"
          />

          <CategoryCard
            icon={<Heart className="w-5 h-5" />}
            title="Love & Relationships"
            content={horoscope.love}
            rating={horoscope.ratings.love}
            color="accent"
          />

          <CategoryCard
            icon={<Briefcase className="w-5 h-5" />}
            title="Career & Business"
            content={horoscope.career}
            rating={horoscope.ratings.career}
            color="light"
          />

          <CategoryCard
            icon={<Activity className="w-5 h-5" />}
            title="Health & Wellness"
            content={horoscope.health}
            rating={horoscope.ratings.health}
            color="red"
          />
        </div>

        {/* Lucky Details */}
        <div className="bg-accent-main/5 rounded-xl p-5 border-2 border-accent-main/20">
          <h3 className="font-bold text-lg text-main mb-4 flex items-center">
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
    primary: {
      bg: 'bg-primary-main/5',
      border: 'border-primary-main/20',
      text: 'text-primary-main',
      star: 'text-primary-main'
    },
    accent: {
      bg: 'bg-accent-main/5',
      border: 'border-accent-main/20',
      text: 'text-accent-main',
      star: 'text-accent-main'
    },
    light: {
      bg: 'bg-primary-light/5',
      border: 'border-primary-light/20',
      text: 'text-primary-light',
      star: 'text-primary-light'
    },
    red: {
      bg: 'bg-red-main/5',
      border: 'border-red-main/20',
      text: 'text-red-main',
      star: 'text-red-main'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-4 border-2 ${colors.border}`}>
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
                  : 'text-secondary-main'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-secondary leading-relaxed">{content}</p>
    </div>
  );
}

function LuckyItem({ label, value, icon }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-secondary mb-1">{label}</p>
      <p className="font-bold text-main">{value}</p>
    </div>
  );
}