"use client";

import { useState } from "react";
import { Moon, Sparkles, Star, Sun, ChevronDown } from "lucide-react";

const HOUSE_POSITIONS = {
  1: { x: 300, y: 150 }, 2: { x: 170, y: 78 }, 3: { x: 78, y: 170 },
  4: { x: 150, y: 300 }, 5: { x: 78, y: 430 }, 6: { x: 170, y: 522 },
  7: { x: 300, y: 450 }, 8: { x: 430, y: 522 }, 9: { x: 522, y: 430 },
  10: { x: 450, y: 300 }, 11: { x: 522, y: 170 }, 12: { x: 430, y: 78 },
};

const PLANET_ABBREVIATIONS = {
  sun: "Su", moon: "Mo", mars: "Ma", mercury: "Me", jupiter: "Ju",
  venus: "Ve", saturn: "Sa", rahu: "Ra", ketu: "Ke",
};

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const RELATION_STYLES = {
  Exalted: "bg-emerald-100 text-emerald-700",
  Own: "bg-amber-100 text-amber-800",
  Friendly: "bg-blue-100 text-blue-700",
  Neutral: "bg-gray-100 text-gray-600",
  Enemy: "bg-orange-100 text-orange-700",
  Debilitated: "bg-red-100 text-red-700",
};

function getGenderLabel(gender) {
  return { MALE: "Male", FEMALE: "Female", OTHER: "Other" }[gender] || gender || "—";
}

function getNakshatraName(value) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value.name || value.nakshatra || "—";
}

function getSignNumber(house) {
  if (house?.signNumber) return house.signNumber;
  if (!house?.sign) return "—";
  const index = SIGN_NAMES.findIndex((s) => s.toLowerCase() === house.sign.toLowerCase());
  return index >= 0 ? index + 1 : "—";
}

function getPlanetLabel(planet) {
  const planetName = String(planet?.name || "").toLowerCase();
  const shortName = PLANET_ABBREVIATIONS[planetName] || planetName.slice(0, 2).toUpperCase();
  return `${shortName}${planet?.isRetrograde ? "℞" : ""}`;
}

// Traditional North Indian diamond chart — fixed house positions, Rashi number badge per cell.
function NorthIndianChart({ houses = [], label }) {
  const houseMap = new Map(houses.map((h) => [Number(h.number), h]));

  return (
    <div className="mx-auto w-full max-w-md">
      <svg viewBox="0 0 600 600" role="img" aria-label={`${label} birth chart`} className="h-auto w-full">
        <rect x="20" y="20" width="560" height="560" rx="2" fill="#fffdf7" stroke="#7c2d12" strokeWidth="4" />
        <path d="M300 20 L580 300 L300 580 L20 300 Z" fill="none" stroke="#7c2d12" strokeWidth="2.5" />
        <path d="M20 20 L300 300 L580 20" fill="none" stroke="#7c2d12" strokeWidth="2.5" />
        <path d="M20 580 L300 300 L580 580" fill="none" stroke="#7c2d12" strokeWidth="2.5" />

        {Object.entries(HOUSE_POSITIONS).map(([houseNumber, position]) => {
          const house = houseMap.get(Number(houseNumber));
          const signNumber = getSignNumber(house);
          const isLagna = Number(houseNumber) === 1;
          const planetLabels = (house?.planets || []).map(getPlanetLabel);
          const firstLine = planetLabels.slice(0, 3).join("  ");
          const secondLine = planetLabels.slice(3, 6).join("  ");
          const extraCount = Math.max(planetLabels.length - 6, 0);

          return (
            <g key={houseNumber}>
              <title>
                House {houseNumber} — {house?.sign || "Unknown"} (Rashi {signNumber})
                {planetLabels.length ? ` — ${planetLabels.join(", ")}` : " — Empty"}
              </title>
              <text x={position.x} y={position.y - 38} textAnchor="middle" fill={isLagna ? "#b45309" : "#78716c"} fontSize={isLagna ? "20" : "16"} fontWeight="800">
                {signNumber}
              </text>
              {isLagna && (
                <text x={position.x} y={position.y - 58} textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="700" letterSpacing="1">
                  LAGNA
                </text>
              )}
              <text x={position.x} y={position.y - 4} textAnchor="middle" fill="#991b1b" fontSize="17" fontWeight="700">
                {firstLine}
              </text>
              {secondLine && (
                <text x={position.x} y={position.y + 18} textAnchor="middle" fill="#991b1b" fontSize="16" fontWeight="700">
                  {secondLine}
                </text>
              )}
              {extraCount > 0 && (
                <text x={position.x} y={position.y + 38} textAnchor="middle" fill="#78716c" fontSize="11">
                  +{extraCount} more
                </text>
              )}
            </g>
          );
        })}

        <text x="300" y="305" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700" opacity="0.5">
          ॐ
        </text>
      </svg>
      <p className="mt-2 text-center text-sm font-semibold text-orange-900">{label}</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-lg">
      <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
        <h3 className="text-lg font-bold text-orange-950">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-orange-700/70">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function DashaTable({ dasha }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!dasha?.periods?.length) return null;

  return (
    <div>
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
        <span className="font-semibold text-amber-900">Balance of Dasha at Birth: </span>
        <span className="text-amber-800">{dasha.balanceLabel}</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {dasha.periods.map((period, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={`${period.lord}-${period.startDate}`} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-orange-50"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold capitalize text-gray-900">{period.lord}</span>
                  {period.isBalance && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      current balance
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-3 text-sm text-gray-500">
                  {period.startDate} → {period.endDate}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 gap-2 bg-orange-50/50 px-4 py-3 sm:grid-cols-3">
                  {period.antardashas.map((sub) => (
                    <div key={`${sub.lord}-${sub.startDate}`} className="rounded-md bg-white px-3 py-2 text-xs shadow-sm">
                      <p className="font-semibold capitalize text-gray-800">{sub.lord}</p>
                      <p className="text-gray-500">{sub.startDate} → {sub.endDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-400">Tap a Mahadasha row to view its Antardasha (sub-period) breakdown.</p>
    </div>
  );
}

function KarakaTable({ karakas }) {
  if (!karakas) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-700">Sthir Karaka (Fixed)</p>
        <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
          <tbody className="divide-y divide-gray-100">
            {karakas.sthir.map((row) => (
              <tr key={row.karaka} className="odd:bg-white even:bg-orange-50/40">
                <td className="px-3 py-2 font-medium text-gray-700">{row.karaka}</td>
                <td className="px-3 py-2 capitalize text-gray-600">{row.planet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-700">Chara Karaka (Based on Degree)</p>
        <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
          <tbody className="divide-y divide-gray-100">
            {karakas.chara.map((row) => (
              <tr key={row.karaka} className="odd:bg-white even:bg-orange-50/40">
                <td className="px-3 py-2 font-medium text-gray-700">{row.karaka}</td>
                <td className="px-3 py-2 capitalize text-gray-600">{row.planet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AvasthaTable({ avasthas }) {
  if (!avasthas?.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead className="bg-orange-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Planet</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Jagrat (State)</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Baladi (Age)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {avasthas.map((row) => (
            <tr key={row.planet} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-medium capitalize text-gray-800">{row.planet}</td>
              <td className="px-3 py-2 text-gray-600">{row.jagrat}</td>
              <td className="px-3 py-2 text-gray-600">{row.baladi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KundaliChart({ kundali }) {
  if (!kundali) return null;

  const personalDetails = kundali.personalDetails || {};
  const ascendant = kundali.ascendant || {};
  const planets = kundali.planets || {};
  const houses = kundali.houses || [];
  const navamsa = kundali.navamsa || {};
  const nakshatras = kundali.nakshatras || {};
  const moonNakshatra = getNakshatraName(nakshatras.moon) || getNakshatraName(planets.moon?.nakshatra);

  return (
    <div className="space-y-6">
      {/* Personal details header */}
      <section className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 p-6 text-white">
          <h2 className="text-2xl font-bold">ॐ Janam Kundali</h2>
          <p className="mt-1 text-orange-100">Birth chart of {personalDetails.name || "Unknown"}</p>
        </div>
        <div className="grid gap-4 p-6 text-sm sm:grid-cols-2">
          <Detail label="Name" value={personalDetails.name} />
          <Detail label="Gender" value={getGenderLabel(personalDetails.gender)} />
          <Detail label="Birth Date" value={personalDetails.date} />
          <Detail label="Birth Time" value={personalDetails.time} />
          <div className="sm:col-span-2">
            <Detail label="Birth Place" value={personalDetails.place} />
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={<Sparkles className="h-6 w-6" />} title="Lagna" value={`${ascendant.sign || "—"} ${ascendant.degree !== undefined ? `${ascendant.degree}°${ascendant.minute ?? 0}'` : ""}`} color="orange" />
        <SummaryCard icon={<Moon className="h-6 w-6" />} title="Moon Sign" value={`${planets.moon?.sign || "—"} ${planets.moon?.degree !== undefined ? `${planets.moon.degree}°${planets.moon.minute ?? 0}'` : ""}`} color="blue" />
        <SummaryCard icon={<Sun className="h-6 w-6" />} title="Sun Sign" value={`${planets.sun?.sign || "—"} ${planets.sun?.degree !== undefined ? `${planets.sun.degree}°${planets.sun.minute ?? 0}'` : ""}`} color="yellow" />
        <SummaryCard icon={<Star className="h-6 w-6" />} title="Nakshatra" value={`${moonNakshatra}${planets.moon?.nakshatra?.pada ? ` Pada ${planets.moon.nakshatra.pada}` : ""}`} color="purple" />
      </section>

      {/* Lagna + Navamsa charts side by side */}
      <SectionCard title="Birth Charts" subtitle="Whole Sign houses — Lahiri Ayanamsa">
        <div className="grid gap-8 sm:grid-cols-2">
          {houses.length === 12 ? (
            <NorthIndianChart houses={houses} label="Lagna Chart (D1)" />
          ) : (
            <ChartFallback expected={12} received={houses.length} />
          )}
          {navamsa.houses?.length === 12 ? (
            <NorthIndianChart houses={navamsa.houses} label="Navamsa Chart (D9)" />
          ) : (
            <ChartFallback expected={12} received={navamsa.houses?.length || 0} />
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          <span>Su: Sun</span><span>Mo: Moon</span><span>Ma: Mars</span><span>Me: Mercury</span>
          <span>Ju: Jupiter</span><span>Ve: Venus</span><span>Sa: Saturn</span><span>Ra: Rahu</span>
          <span>Ke: Ketu</span><span>℞: Retrograde</span><span>Numbers show Rashi (sign)</span>
        </div>
      </SectionCard>

      {/* Planetary positions */}
      <SectionCard title="Planetary Positions" subtitle="Sign, degree, nakshatra & dignity for each graha">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Planet</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Motion</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rashi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Longitude</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nakshatra</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Pada</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Relation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(planets).map(([planetName, planet]) => (
                <tr key={planetName} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium capitalize">
                    <span className="mr-2 text-xl">{planet.symbol || ""}</span>
                    {planetName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-col gap-1">
                      <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${planet.isRetrograde ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {planet.isRetrograde ? "Retrograde" : "Direct"}
                      </span>
                      {planet.isCombust && (
                        <span className="w-fit rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                          Combust
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">{planet.sign || "—"}</td>
                  <td className="px-4 py-3">
                    {planet.degree ?? "—"}°{planet.minute !== undefined ? ` ${planet.minute}'` : ""}
                    {planet.second !== undefined ? ` ${planet.second}"` : ""}
                  </td>
                  <td className="px-4 py-3">{getNakshatraName(planet.nakshatra)}</td>
                  <td className="px-4 py-3">{planet.nakshatra?.pada ?? "—"}</td>
                  <td className="px-4 py-3">
                    {planet.relation ? (
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${RELATION_STYLES[planet.relation] || "bg-gray-100 text-gray-600"}`}>
                        {planet.relation}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Vimshottari Dasha */}
      <SectionCard title="Vimshottari Dasha" subtitle="120-year planetary period cycle, based on Moon's Nakshatra">
        <DashaTable dasha={kundali.dasha} />
      </SectionCard>

      {/* Karakas */}
      <SectionCard title="Jaimini Karakas" subtitle="Significators derived from natural and degree-based rules">
        <KarakaTable karakas={kundali.karakas} />
      </SectionCard>

      {/* Avasthas */}
      <SectionCard title="Avastha" subtitle="Planetary state — age (Baladi) and waking state (Jagrat)">
        <AvasthaTable avasthas={kundali.avasthas} />
      </SectionCard>

      {/* Footer meta */}
      <section className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
        <div className="flex flex-wrap justify-between gap-2">
          <span>Source: {kundali.source || "Astrology calculator"}</span>
          <span>Ayanamsa: {kundali.ayanamsa?.name || "Lahiri"} ({kundali.ayanamsa?.value}°)</span>
          <span>House system: {kundali.houseSystem || "—"}</span>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function SummaryCard({ icon, title, value, color }) {
  const styles = {
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[color]}`}>
      <div className="mb-3">{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide opacity-75">{title}</p>
      <p className="mt-1 text-lg font-bold">{value || "—"}</p>
    </div>
  );
}

function ChartFallback({ expected, received }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-800">
      Chart data incomplete. Expected {expected} houses but received {received}.
    </div>
  );
}