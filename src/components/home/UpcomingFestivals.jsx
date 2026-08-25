"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Calendar, Clock, Sparkles } from "lucide-react";

export default function UpcomingFestivals() {
  const router = useRouter();
  const [festivals, setFestivals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ 
    days: "00", 
    hours: "00", 
    minutes: "00",
    seconds: "00" 
  });
  const [suggestion, setSuggestion] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const currentMonth = useMemo(() => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[new Date().getMonth()];
  }, []);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await fetch("/backend/festivals", { cache: "no-store" });
        const data = await res.json();
        setFestivals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching festivals:", error);
        setFestivals([]);
      }
    }
    fetchFestivals();
  }, []);

  const currentMonthFestivals = useMemo(() => {
    return festivals
      .filter((f) => f.month === currentMonth)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [festivals, currentMonth]);

  const featuredFestival = useMemo(() => {
    const now = new Date();
    const upcomingThisMonth = currentMonthFestivals.filter(
      (f) => new Date(f.startDate) >= now
    );
    
    if (upcomingThisMonth.length > 0) {
      return upcomingThisMonth[0];
    }
    
    return currentMonthFestivals[0] || null;
  }, [currentMonthFestivals]);

  useEffect(() => {
    if (!featuredFestival?.startDate) {
      setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      return;
    }

    const target = new Date(featuredFestival.startDate).getTime();

    function update() {
      const diff = target - Date.now();
      
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [featuredFestival]);

  async function handlePreBook(festival) {
    setBookingLoading(true);
    setSuggestion(null);

    try {
      const res = await fetch(
        `/backend/poojas/search?query=${encodeURIComponent(
          festival.recommendedPujaType || festival.filter
        )}`
      );
      const matches = await res.json();

      if (Array.isArray(matches) && matches.length > 0) {
        router.push(`/checkout?poojaId=${matches[0].id}`);
        return;
      }

      const fallbackRes = await fetch(`/backend/poojas?category=online`);
      const fallback = await fallbackRes.json();

      setSuggestion({
        festival: festival.festivalName,
        poojas: Array.isArray(fallback) ? fallback.slice(0, 3) : [],
      });
    } catch (error) {
      console.error("Error finding pooja for festival:", error);
    } finally {
      setBookingLoading(false);
    }
  }

  if (!featuredFestival) {
    return (
      <section className="w-full bg-gradient-to-b from-primary-main/5 to-background py-s32 sm:py-s48 lg:py-s64 px-s16 sm:px-s24 lg:px-s48">
        <div className="mx-auto max-w-7xl">
          <h2 className="heading-h3 sm:heading-h2 text-main mb-s16 sm:mb-s24">Upcoming Festivals</h2>
          <p className="body-small sm:body-default text-secondary">No festivals scheduled for {currentMonth}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-background py-s32 sm:py-s48 lg:py-s64 px-s16 sm:px-s24 lg:px-s48">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-s32 sm:mb-s48 space-y-s16">
          <h2 className="heading-h3 sm:heading-h2 text-main">Upcoming Festivals</h2>
          <p className="body-small sm:body-default lg:body-large text-secondary max-w-2xl">
            Book auspicious poojas for upcoming Hindu festivals and receive divine blessings at the right muhurat
          </p>
        </div>

        {/* Featured Festival Card */}
        <div className="bg-background rounded-r24 sm:rounded-r32 overflow-hidden mb-s32 sm:mb-s48 border border-primary-main/10 shadow-sm">
          <div className="bg-gradient-to-r from-primary-main to-primary-light p-s24 sm:p-s32 lg:p-s40 text-background">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-s16">
              <div className="w-full sm:w-auto">
                <h3 className="heading-h4 sm:heading-h3 mb-s8">
                  {featuredFestival.festivalName}
                </h3>
                <div className="flex items-center gap-s8 text-background/80">
                  <Calendar className="w-s16 h-s16 shrink-0" />
                  <span className="caption sm:body-small">
                    {new Date(featuredFestival.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handlePreBook(featuredFestival)}
                loading={bookingLoading}
                className="w-full sm:w-auto"
                size="sm"
              >
                Pre-Book Pooja
              </Button>
            </div>
          </div>

          <div className="p-s24 sm:p-s32 lg:p-s40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-s24 sm:gap-s32">
              {/* Countdown Timer */}
              <div className="bg-primary-main/5 rounded-r16 sm:rounded-r24 p-s16 sm:p-s24">
                <div className="flex items-center gap-s8 mb-s16">
                  <Clock className="w-s16 sm:w-s24 h-s16 sm:h-s24 text-primary-main shrink-0" />
                  <h4 className="body-small sm:body-default font-semibold text-main">Time Remaining</h4>
                </div>
                
                <div className="grid grid-cols-4 gap-s8 sm:gap-s16">
                  <CountdownBox value={timeLeft.days} label="Days" />
                  <CountdownBox value={timeLeft.hours} label="Hours" />
                  <CountdownBox value={timeLeft.minutes} label="Mins" />
                  <CountdownBox value={timeLeft.seconds} label="Secs" />
                </div>
              </div>

              {/* Festival Details */}
              <div className="space-y-s16 sm:space-y-s24">
                <div className="bg-accent-main/10 border border-accent-main/20 rounded-r8 sm:rounded-r16 p-s16 sm:p-s24">
                  <p className="caption font-semibold text-accent-main mb-s6">
                    Auspicious Muhurat
                  </p>
                  <p className="caption sm:body-small text-main/80">
                    {featuredFestival.muhurat}
                  </p>
                </div>

                <div>
                  <h5 className="caption sm:body-small font-semibold text-main mb-s8">
                    About the Festival
                  </h5>
                  <p className="caption sm:body-small text-secondary leading-relaxed">
                    {featuredFestival.importantDetails}
                  </p>
                </div>

                <div className="bg-primary-light/10 border border-primary-light/20 rounded-r8 sm:rounded-r16 p-s16 sm:p-s24">
                  <p className="caption font-semibold text-primary-main mb-s6">
                    Benefits of Pooja
                  </p>
                  <p className="caption sm:body-small text-main/80 leading-relaxed">
                    {featuredFestival.laabhOfPooja}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Box */}
        {suggestion && (
          <div className="bg-primary-main/5 border border-primary-main/20 rounded-r16 sm:rounded-r24 p-s16 sm:p-s24 mb-s32 sm:mb-s48">
            <p className="caption sm:body-small text-main mb-s16 sm:mb-s24">
              <strong>{suggestion.festival}</strong>.{" "}
              Here are some related poojas you might be interested in:
            </p>
            <div className="flex flex-wrap gap-s8 sm:gap-s16">
              {suggestion.poojas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/poojas/${p.id}`)}
                  className="bg-background border border-primary-main/20 rounded-r8 px-s16 py-s8 sm:px-s24 sm:py-s8 caption sm:body-small text-primary-main hover:bg-primary-main/10 transition-colors font-medium"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

function CountdownBox({ value, label }) {
  return (
    <div className="bg-background rounded-r8 sm:rounded-r16 shadow-md p-s8 sm:p-s16 text-center border border-primary-main/10">
      <div className="heading-h5 sm:heading-h4 font-bold text-primary-main mb-s6">
        {value}
      </div>
      <div className="text-[10px] sm:text-[11px] font-medium text-secondary uppercase leading-tight">
        {label}
      </div>
    </div>
  );
}