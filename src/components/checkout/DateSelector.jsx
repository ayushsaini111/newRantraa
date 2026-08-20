// src/components/checkout/DateSelector.jsx
"use client";

import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function DateSelector({ selectedDate, onSelectDate }) {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, []);
function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
  async function fetchAvailability() {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);

      const startDateStr = toLocalDateString(today);   // ✅
const endDateStr = toLocalDateString(endDate);   // ✅

      const res = await fetch(
        `/backend/admins/calendar/availability?startDate=${startDateStr}&endDate=${endDateStr}`
      );
      const data = await res.json();

      if (data.success) {
        const availabilityMap = {};
        data.availability.forEach((item) => {
          // ✅ Properly format date key
      const dateKey = toLocalDateString(new Date(item.date));   // ✅
          availabilityMap[dateKey] = {
            isAvailable: item.isAvailable,
            timeSlots: item.timeSlots
          };
        });
        setAvailability(availabilityMap);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  }

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

const formatDate = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()],
    full: toLocalDateString(date),  // ✅ fixed
  };
};

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={20} className="text-primary-main" />
        <h3 className="font-semibold text-lg">Select Date</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {dates.map((date, index) => {
            const formatted = formatDate(date);
            const isSelected = selectedDate === formatted.full;
            const dayAvailability = availability[formatted.full];
            
            // ✅ Check if date is explicitly blocked
            const isDateBlocked = dayAvailability?.isAvailable === false;
            
            // ✅ Check if all time slots are disabled
            const allSlotsDisabled = dayAvailability?.timeSlots &&
              Object.values(dayAvailability.timeSlots).every(v => v === false);
            
            const isDisabled = isDateBlocked || allSlotsDisabled;

            return (
              <button
                key={index}
                onClick={() => !isDisabled && onSelectDate(formatted.full)}
                disabled={isDisabled}
                className={`
                  flex-shrink-0 w-20 p-3 rounded-xl border-2 transition-all
                  ${isDisabled
                    ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "border-primary-main bg-primary-light"
                    : "border-gray-200 hover:border-primary-main/50"
                  }
                `}
              >
                <div className="text-center">
                  <p className={`text-xs mb-1 ${
                    isDisabled ? "text-gray-400" :
                    isSelected ? "text-primary-main" : "text-secondary"
                  }`}>
                    {formatted.day}
                  </p>
                  <p className={`text-2xl font-bold mb-1 ${
                    isDisabled ? "text-gray-400" :
                    isSelected ? "text-primary-main" : "text-main"
                  }`}>
                    {formatted.date}
                  </p>
                  <p className={`text-xs ${
                    isDisabled ? "text-gray-400" :
                    isSelected ? "text-primary-main" : "text-secondary"
                  }`}>
                    {formatted.month}
                  </p>
                  {isDisabled && (
                    <p className="text-xs text-red-500 mt-1">N/A</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}