// src/components/checkout/TimeSlotSelector.jsx
"use client";

import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

const TIME_SLOTS = [
  { id: 1, value: "8-12", label: "Morning Slot", time: "8:00 AM - 12:00 PM" },
  { id: 2, value: "12-15", label: "Afternoon Slot", time: "12:00 PM - 3:00 PM" },
  { id: 3, value: "15-19", label: "Evening Slot", time: "3:00 PM - 7:00 PM" },
  { id: 4, value: "19-22", label: "Night Slot", time: "7:00 PM - 10:00 PM" },
];

export default function TimeSlotSelector({ selectedSlot, onSelectSlot, selectedDate }) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchSlotAvailability();
    } else {
      setAvailability(null);
    }
  }, [selectedDate]);

  async function fetchSlotAvailability() {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const res = await fetch(`/backend/admins/calendar/availability?date=${selectedDate}`);
      const data = await res.json();

      if (data.success && data.availability.length > 0) {
        const item = data.availability[0];
        setAvailability({
          isAvailable: item.isAvailable,
          timeSlots: item.timeSlots
        });
      } else {
        // No restrictions, all slots available
        setAvailability({
          isAvailable: true,
          timeSlots: {
            "8-12": true,
            "12-15": true,
            "15-19": true,
            "19-22": true,
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch slot availability:", error);
      setAvailability({
        isAvailable: true,
        timeSlots: {
          "8-12": true,
          "12-15": true,
          "15-19": true,
          "19-22": true,
        }
      });
    } finally {
      setLoading(false);
    }
  }

  if (!selectedDate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-primary-main" />
          <h3 className="font-semibold text-lg">Select Time Slot</h3>
        </div>
        <p className="text-sm text-secondary italic">Please select a date first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-primary-main" />
        <h3 className="font-semibold text-lg">Select Time Slot</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.value;
            // ✅ Check availability properly
            const slotAvailable = availability?.timeSlots?.[slot.value] ?? true;
            const isDisabled = !slotAvailable;

            return (
              <button
                key={slot.id}
                onClick={() => !isDisabled && onSelectSlot(slot.value)}
                disabled={isDisabled}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${isDisabled
                    ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "border-primary-main bg-primary-light"
                    : "border-gray-200 hover:border-primary-main/50"
                  }
                `}
              >
                <p className={`font-semibold mb-1 ${
                  isDisabled ? "text-gray-400" :
                  isSelected ? "text-primary-main" : "text-main"
                }`}>
                  {slot.label}
                  {isDisabled && <span className="ml-2 text-xs text-red-500">(Unavailable)</span>}
                </p>
                <p className={`text-sm ${
                  isDisabled ? "text-gray-400" :
                  isSelected ? "text-primary-main/80" : "text-secondary"
                }`}>
                  {slot.time}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}