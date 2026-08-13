import { Suspense } from 'react';
import HoroscopeContent from './HoroscopeContent';

export const metadata = {
  title: 'Daily Horoscope | AI-Powered Vedic Astrology',
  description: 'Get your daily, weekly, monthly, and yearly horoscope predictions based on Vedic astrology',
};

export default function HoroscopePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HoroscopeContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen mt-[90px] bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading horoscope...</p>
          </div>
        </div>
      </div>
    </div>
  );
}