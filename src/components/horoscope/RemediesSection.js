// components/horoscope/RemediesSection.js
"use client";

import { Sparkles } from 'lucide-react';

export default function RemediesSection({ remedies, luckyDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">🕉️ Vedic Remedies</h2>
            <p className="text-purple-100">Enhance positive energies with these traditional remedies</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Remedies List */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📿</span>
              Recommended Practices
            </h3>
            <div className="space-y-3">
              {remedies.map((remedy, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{remedy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Tips */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Additional Guidance
            </h3>
            
            <div className="space-y-4">
              <TipCard
                icon="🌅"
                title="Best Time for Important Tasks"
                content={luckyDetails.time}
                color="orange"
              />
              
              <TipCard
                icon="🧘"
                title="Meditation Direction"
                content={`Face ${luckyDetails.direction} during meditation for enhanced benefits`}
                color="purple"
              />
              
              <TipCard
                icon="💎"
                title="Gemstone Recommendation"
                content={luckyDetails.gemstone || "Consult an astrologer for personalized gemstone"}
                color="blue"
              />

              <TipCard
                icon="🙏"
                title="Mantra for Today"
                content={luckyDetails.mantra || "Om Namah Shivaya"}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Note:</strong> These remedies are based on Vedic astrology principles. 
            For personalized guidance, consult a qualified astrologer.
          </p>
        </div>
      </div>
    </div>
  );
}

function TipCard({ icon, title, content, color }) {
  const colorClasses = {
    orange: 'from-orange-50 to-red-50 border-orange-200',
    purple: 'from-purple-50 to-indigo-50 border-purple-200',
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200'
  };

  return (
    <div className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl border-2`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
      </div>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  );
}