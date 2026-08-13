"use client";

import { Heart, AlertTriangle, CheckCircle2, Star, Sparkles, TrendingUp } from "lucide-react";

function verdictColor(total) {
  if (total >= 32) return {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-200",
    text: "text-green-700",
    accent: "from-green-500 to-emerald-600"
  };
  if (total >= 24) return {
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-200", 
    text: "text-blue-700",
    accent: "from-blue-500 to-cyan-600"
  };
  if (total >= 18) return {
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    border: "border-yellow-200",
    text: "text-yellow-700", 
    accent: "from-yellow-500 to-amber-600"
  };
  return {
    bg: "bg-gradient-to-br from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-700",
    accent: "from-red-500 to-rose-600"
  };
}

function getVerdictIcon(total) {
  if (total >= 32) return <Star className="h-6 w-6" />;
  if (total >= 24) return <CheckCircle2 className="h-6 w-6" />;
  if (total >= 18) return <TrendingUp className="h-6 w-6" />;
  return <AlertTriangle className="h-6 w-6" />;
}

function getVerdictEmoji(total) {
  if (total >= 32) return "🌟";
  if (total >= 24) return "💙";
  if (total >= 18) return "⚡";
  return "⚠️";
}

export default function MatchResult({ match }) {
  if (!match) return null;

  const { boy, girl, kootas, total, maxTotal, verdict, doshas } = match;
  const percentage = Math.round((total / maxTotal) * 100);
  const colors = verdictColor(total);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-8 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="absolute top-4 left-4">
            <Sparkles className="h-6 w-6 opacity-30" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Sparkles className="h-8 w-8 opacity-20" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <Heart className="h-8 w-8 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Guna Milan Compatibility</h2>
            <div className="flex items-center justify-center space-x-3 text-lg">
              <span className="font-semibold">{boy.name}</span>
              <Heart className="h-5 w-5 text-pink-200 animate-pulse" />
              <span className="font-semibold">{girl.name}</span>
            </div>
          </div>
        </div>

        {/* Moon Signs Section */}
        <div className="grid gap-6 p-8 sm:grid-cols-2">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">🌙</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              {boy.name}'s Moon Sign
            </p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900">{boy.rashi}</p>
              <p className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                {boy.nakshatra}
              </p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-3 group-hover:bg-pink-200 transition-colors">
              <span className="text-2xl">🌙</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              {girl.name}'s Moon Sign
            </p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900">{girl.rashi}</p>
              <p className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                {girl.nakshatra}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score Section */}
      <section className={`rounded-2xl border-2 p-8 text-center relative overflow-hidden ${colors.border} ${colors.bg} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center justify-center space-x-2 mb-2">
            <span className={`${colors.text}`}>{getVerdictIcon(total)}</span>
            <span className="text-3xl">{getVerdictEmoji(total)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-center space-x-1">
              <span className={`text-6xl font-extrabold ${colors.text}`}>{total}</span>
              <span className={`text-2xl font-bold ${colors.text} opacity-70`}>/ {maxTotal}</span>
            </div>
            
            {/* Progress ring or bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full bg-gradient-to-r ${colors.accent} transition-all duration-1000 ease-out rounded-full relative`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className={`mt-2 text-lg font-semibold ${colors.text} opacity-80`}>
                {percentage}% Compatibility
              </p>
            </div>
          </div>
          
          <div className="inline-block">
            <p className={`text-xl font-bold ${colors.text} bg-white/30 px-6 py-2 rounded-full border border-white/20`}>
              {verdict}
            </p>
          </div>
        </div>
      </section>

      {/* Dosha Warning */}
      {(doshas.nadi || doshas.bhakoot) && (
        <section className="animate-in slide-in-from-bottom duration-500">
          <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-red-800">
                    {doshas.nadi && doshas.bhakoot
                      ? "Multiple Doshas Detected"
                      : doshas.nadi
                      ? "Nadi Dosha Detected" 
                      : "Bhakoot Dosha Detected"}
                  </h3>
                  <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    Important
                  </span>
                </div>
                <p className="text-red-700 text-sm leading-relaxed">
                  {doshas.nadi && doshas.bhakoot
                    ? "Both Nadi and Bhakoot doshas are present in this match."
                    : doshas.nadi 
                    ? "Nadi dosha indicates potential health and progeny concerns."
                    : "Bhakoot dosha may affect financial stability and mutual understanding."
                  } We strongly recommend consulting a qualified astrologer for detailed analysis and potential remedies.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Koota Breakdown */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Koota-wise Analysis</h3>
              <p className="text-sm text-gray-600">Detailed breakdown of all compatibility factors</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {kootas.map((koota, index) => (
            <div 
              key={koota.name} 
              className="p-6 hover:bg-gray-50/50 transition-colors duration-200 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {koota.name}
                    </h4>
                    
                    {koota.dosha && (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        Dosha
                      </span>
                    )}
                    
                    {!koota.dosha && koota.score === koota.max && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Perfect
                      </span>
                    )}
                    
                    {!koota.dosha && koota.score > 0 && koota.score < koota.max && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Good
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {koota.description}
                  </p>
                </div>

                <div className="w-32 flex-shrink-0 space-y-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {koota.score} / {koota.max}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round((koota.score / koota.max) * 100)}%
                    </p>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${
                        koota.dosha 
                          ? 'bg-gradient-to-r from-red-400 to-red-500' 
                          : koota.score === koota.max
                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ 
                        width: `${(koota.score / koota.max) * 100}%`,
                        animationDelay: `${index * 150}ms`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Footer */}
      <section className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">About This Analysis</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                This compatibility score follows the traditional Ashtakoot (36-point) Guna Milan system based on Moon sign and nakshatra positions. While this provides valuable insights into basic compatibility, a complete astrological assessment should include analysis of both complete birth charts by a qualified astrologer.
              </p>
            </div>
          </div>
        </div>

        {(doshas.nadi || doshas.bhakoot) && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Recommendation:</strong> Given the presence of doshas, we strongly advise consulting with an experienced astrologer for detailed analysis and potential remedial measures.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}