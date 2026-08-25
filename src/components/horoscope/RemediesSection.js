"use client";

import { Sparkles } from 'lucide-react';

export default function RemediesSection({ remedies, luckyDetails }) {
  return (
    <div className="bg-background rounded-2xl shadow-2xl overflow-hidden border-2 border-secondary-dark">

      {/* Header */}
      <div className="bg-primary-main p-6 text-background">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">🕉️ Vedic Remedies</h2>
            <p className="text-background/80">Enhance positive energies with these traditional remedies</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Remedies List */}
          <div>
            <h3 className="font-bold text-lg text-main mb-4 flex items-center">
              <span className="text-2xl mr-2">📿</span>
              Recommended Practices
            </h3>
            <div className="space-y-3">
              {remedies.map((remedy, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-primary-main/5 rounded-xl border border-primary-main/20"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-main text-background rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-secondary flex-1">{remedy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Tips */}
          <div>
            <h3 className="font-bold text-lg text-main mb-4 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Additional Guidance
            </h3>

            <div className="space-y-4">
              <TipCard
                icon="🌅"
                title="Best Time for Important Tasks"
                content={luckyDetails.time}
                color="primary"
              />

              <TipCard
                icon="🧘"
                title="Meditation Direction"
                content={`Face ${luckyDetails.direction} during meditation for enhanced benefits`}
                color="light"
              />

              <TipCard
                icon="💎"
                title="Gemstone Recommendation"
                content={luckyDetails.gemstone || "Consult an astrologer for personalized gemstone"}
                color="accent"
              />

              <TipCard
                icon="🙏"
                title="Mantra for Today"
                content={luckyDetails.mantra || "Om Namah Shivaya"}
                color="primary"
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-accent-main/5 border-2 border-accent-main/20 rounded-xl">
          <p className="text-sm text-main text-center">
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
    primary: 'bg-primary-main/5 border-primary-main/20',
    light: 'bg-primary-light/5 border-primary-light/20',
    accent: 'bg-accent-main/5 border-accent-main/20',
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-main text-sm">{title}</h4>
      </div>
      <p className="text-sm text-secondary">{content}</p>
    </div>
  );
}