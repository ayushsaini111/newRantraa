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
      <section className="w-full bg-gradient-to-b from-primary-main/5 to-background py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="heading-h2 text-main mb-4">Upcoming Festivals</h2>
          <p className="text-secondary">No festivals scheduled for {currentMonth}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-background py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-s16">
          <h2 className="heading-h2 text-main">Upcoming Festivals</h2>
          <p className="text-secondary text-lg max-w-2xl">
            Book auspicious poojas for upcoming Hindu festivals and receive divine blessings at the right muhurat
          </p>
        </div>

        {/* Featured Festival Card */}
        <div className="bg-background rounded-3xl overflow-hidden mb-12 border border-primary-main/10 shadow-sm">
          <div className="bg-gradient-to-r from-primary-main to-primary-light p-8 text-background">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {featuredFestival.festivalName}
                </h3>
                <div className="flex items-center gap-2 text-background/80">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
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
              >
                Pre-Book Pooja
              </Button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Countdown Timer */}
              <div className="bg-primary-main/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary-main" />
                  <h4 className="font-semibold text-main">Time Remaining</h4>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <CountdownBox value={timeLeft.days} label="Days" />
                  <CountdownBox value={timeLeft.hours} label="Hours" />
                  <CountdownBox value={timeLeft.minutes} label="Mins" />
                  <CountdownBox value={timeLeft.seconds} label="Secs" />
                </div>
              </div>

              {/* Festival Details */}
              <div className="space-y-4">
                <div className="bg-accent-main/10 border border-accent-main/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-accent-main mb-1">
                    Auspicious Muhurat
                  </p>
                  <p className="text-sm text-main/80">
                    {featuredFestival.muhurat}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-main mb-2">
                    About the Festival
                  </h5>
                  <p className="text-sm text-secondary leading-relaxed">
                    {featuredFestival.importantDetails}
                  </p>
                </div>

                <div className="bg-primary-light/10 border border-primary-light/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-primary-main mb-1">
                    Benefits of Pooja
                  </p>
                  <p className="text-sm text-main/80 leading-relaxed">
                    {featuredFestival.laabhOfPooja}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Box */}
        {suggestion && (
          <div className="bg-primary-main/5 border border-primary-main/20 rounded-2xl p-6 mb-12">
            <p className="text-sm text-main mb-4">
              <strong>{suggestion.festival}</strong>.{" "}
              Here are some related poojas you might be interested in:
            </p>
            <div className="flex flex-wrap gap-3">
              {suggestion.poojas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/poojas/${p.id}`)}
                  className="bg-background border border-primary-main/20 rounded-lg px-4 py-2 text-sm text-primary-main hover:bg-primary-main/10 transition-colors font-medium"
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
    <div className="bg-background rounded-xl shadow-md p-3 text-center border border-primary-main/10">
      <div className="text-2xl font-bold text-primary-main mb-1">
        {value}
      </div>
      <div className="text-[10px] font-medium text-secondary uppercase">
        {label}
      </div>
    </div>
  );
}