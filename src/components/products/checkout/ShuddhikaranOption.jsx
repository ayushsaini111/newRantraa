// src/components/products/checkout/ShuddhikaranOption.jsx
"use client";

import { Sparkles, Check } from "lucide-react";

const SHUDDHIKARAN_PRICE = 199;

export default function ShuddhikaranOption({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-start gap-s16 p-s16 rounded-r16 border text-left transition-colors ${
        checked
          ? "border-primary-main bg-primary-main/5"
          : "border-secondary-dark bg-background hover:border-primary-light"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-r8 flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
          checked ? "bg-primary-main border-primary-main" : "border-secondary-dark"
        }`}
      >
        {checked && <Check size={14} className="text-background" strokeWidth={3} />}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-s8 mb-s4">
          <Sparkles size={16} className="text-primary-main" />
          <p className="body-default font-semibold text-main">Add Shuddhikaran (Purification)</p>
        </div>
        <p className="body-small text-secondary">
          Get your product energized and purified by our Pandit Ji before delivery — includes Vedic mantras and ritual cleansing.
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="body-default font-semibold text-primary-main">+₹{SHUDDHIKARAN_PRICE}</p>
      </div>
    </button>
  );
}

export { SHUDDHIKARAN_PRICE };