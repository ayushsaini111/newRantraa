"use client";

import { Clock } from "lucide-react";
import { TIME_SLOTS } from "@/lib/timeSlot";

export default function TimeSlotSelector({ selectedSlot, onSelectSlot }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-primary-main" />
        <h3 className="font-semibold text-lg">Select Time Slot</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot.value;

          return (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot.value)}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-primary-main bg-primary-light"
                    : "border-gray-200 hover:border-primary-main/50"
                }
              `}
            >
              <p
                className={`font-semibold mb-1 ${
                  isSelected ? "text-primary-main" : "text-main"
                }`}
              >
                {slot.label}
              </p>
              <p
                className={`text-sm ${
                  isSelected ? "text-primary-main/80" : "text-secondary"
                }`}
              >
                {slot.time}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}