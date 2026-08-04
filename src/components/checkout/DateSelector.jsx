"use client";

import { Calendar } from "lucide-react";

export default function DateSelector({ selectedDate, onSelectDate }) {
  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toISOString().split("T")[0],
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={20} className="text-primary-main" />
        <h3 className="font-semibold text-lg">Select Date</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {dates.map((date, index) => {
          const formatted = formatDate(date);
          const isSelected = selectedDate === formatted.full;

          return (
            <button
              key={index}
              onClick={() => onSelectDate(formatted.full)}
              className={`
                flex-shrink-0 w-20 p-3 rounded-xl border-2 transition-all
                ${
                  isSelected
                    ? "border-primary-main bg-primary-light"
                    : "border-gray-200 hover:border-primary-main/50"
                }
              `}
            >
              <div className="text-center">
                <p
                  className={`text-xs mb-1 ${
                    isSelected ? "text-primary-main" : "text-secondary"
                  }`}
                >
                  {formatted.day}
                </p>
                <p
                  className={`text-2xl font-bold mb-1 ${
                    isSelected ? "text-primary-main" : "text-main"
                  }`}
                >
                  {formatted.date}
                </p>
                <p
                  className={`text-xs ${
                    isSelected ? "text-primary-main" : "text-secondary"
                  }`}
                >
                  {formatted.month}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}