"use client";

import { Sparkles } from 'lucide-react';

export default function RemediesCard({ remedies, luckyDetails, mantra, gemstone }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
          <div>
            <h2 className="text-lg md:text-2xl font-bold">🕉️ Vedic Remedies</h2>
            <p className="text-purple-100 text-sm">Enhance positive energies</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        
        {/* Remedies List */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">📿</span>
            Recommended Practices
          </h3>
          <div className="space-y-2">
            {remedies.map((remedy, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
              >
                <div className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{remedy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sacred Items */}
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Mantra */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🙏</span>
              <h4 className="font-bold text-gray-900">Sacred Mantra</h4>
            </div>
            <p className="text-sm text-gray-700">{mantra || luckyDetails?.mantra || "Om Namah Shivaya"}</p>
          </div>

          {/* Gemstone */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <h4 className="font-bold text-gray-900">Gemstone</h4>
            </div>
            <p className="text-sm text-gray-700">{gemstone || luckyDetails?.gemstone || "Yellow Sapphire"}</p>
          </div>

          {/* Best Time */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⏰</span>
              <h4 className="font-bold text-gray-900">Best Time</h4>
            </div>
            <p className="text-sm text-gray-700">{luckyDetails?.time || "6:00 AM - 8:00 AM"}</p>
          </div>

          {/* Direction */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧭</span>
              <h4 className="font-bold text-gray-900">Direction</h4>
            </div>
            <p className="text-sm text-gray-700">Face {luckyDetails?.direction || "East"} during meditation</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ <strong>Note:</strong> Based on Vedic principles. Consult an astrologer for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}