"use client";
import RemediesCard from './RemediesCard';
import { Star, TrendingUp, Heart, Briefcase, Activity } from 'lucide-react';

export default function HoroscopeDisplay({ rashi, period, data, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{rashi}</h2>
              <p className="text-orange-100">{period}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              <span className="text-2xl font-bold">{data.overallRating}/5</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* General */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-orange-200">
            <h3 className="font-bold text-lg mb-2">General Prediction</h3>
            <p className="text-gray-700">{data.general}</p>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-4">
            <CategoryCard icon={<TrendingUp className="w-5 h-5" />} title="Finance" text={data.finance} rating={data.ratings.finance} color="green" />
            <CategoryCard icon={<Heart className="w-5 h-5" />} title="Love" text={data.love} rating={data.ratings.love} color="pink" />
            <CategoryCard icon={<Briefcase className="w-5 h-5" />} title="Career" text={data.career} rating={data.ratings.career} color="blue" />
            <CategoryCard icon={<Activity className="w-5 h-5" />} title="Health" text={data.health} rating={data.ratings.health} color="red" />
          </div>

          {/* Lucky Details - Keep this */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <h3 className="font-bold mb-3">🍀 Lucky Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <LuckyItem label="Color" value={data.luckyDetails.color} />
              <LuckyItem label="Number" value={data.luckyDetails.number} />
              <LuckyItem label="Time" value={data.luckyDetails.time} />
              <LuckyItem label="Direction" value={data.luckyDetails.direction} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ADD REMEDIES CARD HERE - SEPARATE CARD */}
      <RemediesCard 
        remedies={data.remedies} 
        luckyDetails={data.luckyDetails}
        mantra={data.luckyDetails?.mantra}
        gemstone={data.luckyDetails?.gemstone}
      />
    </div>
  );
}

function CategoryCard({ icon, title, text, rating, color }) {
  const colors = {
    green: 'from-green-50 to-emerald-50 border-green-200 text-green-700',
    pink: 'from-pink-50 to-rose-50 border-pink-200 text-pink-700',
    blue: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-700',
    red: 'from-red-50 to-orange-50 border-red-200 text-red-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 border-2`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-bold">{title}</h4>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

function LuckyItem({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}