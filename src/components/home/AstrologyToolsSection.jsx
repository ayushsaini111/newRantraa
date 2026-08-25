"use client";

import { useState, useCallback, useMemo,useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, TrendingUp, Briefcase, Activity, Loader2, Star, MapPin, Calendar, Clock, User } from "lucide-react";
import PlaceSearch from "@/components/astrology/PlaceSearch";

// EXACT KUNDALI FORM - COMPACT VERSION FOR HOME
const KundaliFormCompact = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "MALE",
    date: "",
    time: "",
    place: "",
    lat: "",
    lng: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.date) {
      newErrors.date = "Birth date is required";
    }

    if (!formData.time) {
      newErrors.time = "Birth time is required";
    }

    if (!formData.place.trim() || formData.lat === "" || formData.lng === "") {
      newErrors.place = "Please select a valid birth place";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      });
    } catch (error) {
      console.error("Kundali form error:", error);
    }
  };

  const handlePlaceSelect = (place) => {
    setFormData((current) => ({
      ...current,
      place: place.display_name,
      lat: place.lat,
      lng: place.lng,
    }));
    setErrors((current) => ({
      ...current,
      place: "",
    }));
  };

  const GENDER_OPTIONS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  return (
   // ============================================================
// KUNDALI GENERATOR FORM (compact form body)
// ============================================================
<div className="h-full flex flex-col bg-background">
  <div className="flex h-[45px] items-center justify-center border-b border-secondary-dark bg-primary-light/20 text-[20px] font-medium text-main">
    Kundali Generator
  </div>

  <form onSubmit={handleSubmit} className="flex flex-col justify-between space-y-s56 p-4 mt-s24 overflow-auto">
    {/* Name */}
   <div className="space-y-s16">
     <div>
      <label className="mb-2 block text-xs font-semibold text-main">
        <User className="mr-1 inline h-3 w-3" />
        Full Name *
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Enter your full name"
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:border-transparent focus:ring-1 focus:ring-primary-light ${
          errors.name ? "border-red-main bg-red-main/5" : "border-secondary-dark"
        }`}
      />
      {errors.name && <p className="mt-1 text-xs text-red-main">{errors.name}</p>}
    </div>

    {/* Gender */}
    <div>
      <label className="mb-2 block text-xs font-semibold text-main">Gender *</label>
      <div className="grid grid-cols-3 gap-2">
        {GENDER_OPTIONS.map((option) => {
          const selected = formData.gender === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-2 py-2 text-center text-xs font-medium transition ${
                selected
                  ? "border-primary-light text-primary-light ring-1 ring-primary-light"
                  : "border-secondary-dark bg-background text-main hover:bg-secondary-main/30"
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={selected}
                onChange={(e) => updateField("gender", e.target.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>

    {/* Date and Time */}
    <div className="grid gap-2 grid-cols-2">
      <div>
        <label className="mb-2 block text-xs font-semibold text-main">
          <Calendar className="mr-1 inline h-3 w-3" />
          Birth Date *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => updateField("date", e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-light ${
            errors.date ? "border-red-main bg-red-main/5" : "border-secondary-dark"
          }`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-main">{errors.date}</p>}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-main">
          <Clock className="mr-1 inline h-3 w-3" />
          Birth Time *
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => updateField("time", e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-light ${
            errors.time ? "border-red-main bg-red-main/5" : "border-secondary-dark"
          }`}
        />
        {errors.time && <p className="mt-1 text-xs text-red-main">{errors.time}</p>}
      </div>
    </div>

    {/* Birth Place */}
    <div>
      <label className="mb-1 block text-xs font-semibold text-main">
        <MapPin className="mr-1 inline h-3 w-3" />
        Birth Place *
      </label>
      <PlaceSearch
        value={formData.place}
        onSelect={handlePlaceSelect}
        error={errors.place}
      />
      {errors.place && <p className="mt-1 text-xs text-red-main">{errors.place}</p>}
    </div>
   </div>

    {/* Coordinates */}
    {formData.lat !== "" && formData.lng !== "" && (
      <div className="rounded-lg border border-primary-light/30 bg-primary-light/5 p-2">
        <p className="text-xs text-primary-main">
          📍 {Number(formData.lat).toFixed(2)}, {Number(formData.lng).toFixed(2)}
        </p>
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-primary-main hover:bg-primary-light px-4 py-3 text-sm font-semibold text-background transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
          Generating...
        </span>
      ) : (
        "Generate Kundali"
      )}
    </button>
  </form>
</div>
  );
};

const HoroscopeMini = () => {
  const router = useRouter();
  const [selectedRashi, setSelectedRashi] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);

  const periods = useMemo(() => [
    { key: 'daily', label: 'Today', icon: '📅' },
    { key: 'weekly', label: 'This Week', icon: '🗓️' },
    { key: 'monthly', label: 'This Month', icon: '📆' },
    { key: 'yearly', label: 'This Year', icon: '🎯' },
  ], []);

  // Rashi gradient colors cycled ONLY across global tokens
  const rashis = useMemo(() => [
    { name: "Aries", key: "aries", emoji: "♈", color: "from-primary-main to-primary-light" },
    { name: "Taurus", key: "taurus", emoji: "♉", color: "from-primary-light to-accent-main" },
    { name: "Gemini", key: "gemini", emoji: "♊", color: "from-accent-main to-primary-main" },
    { name: "Cancer", key: "cancer", emoji: "♋", color: "from-primary-main to-primary-light" },
    { name: "Leo", key: "leo", emoji: "♌", color: "from-primary-light to-accent-main" },
    { name: "Virgo", key: "virgo", emoji: "♍", color: "from-accent-main to-primary-main" },
    { name: "Libra", key: "libra", emoji: "♎", color: "from-primary-main to-primary-light" },
    { name: "Scorpio", key: "scorpio", emoji: "♏", color: "from-primary-light to-accent-main" },
    { name: "Sagittarius", key: "sagittarius", emoji: "♐", color: "from-accent-main to-primary-main" },
    { name: "Capricorn", key: "capricorn", emoji: "♑", color: "from-primary-main to-primary-light" },
    { name: "Aquarius", key: "aquarius", emoji: "♒", color: "from-primary-light to-accent-main" },
    { name: "Pisces", key: "pisces", emoji: "♓", color: "from-accent-main to-primary-main" },
  ], []);

  const fetchHoroscope = useCallback(async (rashi, period) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        rashi: rashi.key,
        date: new Date().toISOString().split('T')[0],
      });

      const response = await fetch(`/backend/horoscope/${period}?${params}`);
      const data = await response.json();

      if (data.success) {
        setHoroscope(data.horoscope);
      }
    } catch (err) {
      console.error('Failed to fetch horoscope:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRashiClick = useCallback((rashi) => {
    setSelectedRashi(rashi);
    fetchHoroscope(rashi, selectedPeriod);
  }, [fetchHoroscope, selectedPeriod]);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    if (selectedRashi) {
      fetchHoroscope(selectedRashi, period);
    }
  }, [selectedRashi, fetchHoroscope]);

  const viewDetailedHoroscope = useCallback(() => {
    if (selectedRashi) {
      router.push(`/astrology/horoscope?rashi=${selectedRashi.key}`);
    }
  }, [selectedRashi, router]);

  // ✅ Auto-select first rashi (Aries) on mount
  useEffect(() => {
    const firstRashi = rashis[0];
    setSelectedRashi(firstRashi);
    fetchHoroscope(firstRashi, selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex h-[45px] items-center px-6 text-[22px] font-medium justify-center text-main bg-primary-light/20 border-b border-secondary-dark">
        Horoscope
      </div>

      {/* Period Selector */}
      <div className="grid grid-cols-4 border-b border-secondary-dark bg-secondary-main/20">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => handlePeriodChange(period.key)}
            className={`py-2 px-2 text-[10px] font-medium transition-all border-r last:border-r-0 border-secondary-dark/50 ${
              selectedPeriod === period.key
                ? "bg-primary-main text-background"
                : "text-main hover:bg-secondary-main/40"
            }`}
          >
            <div className="text-sm md:text-lg mb-0.5">{period.icon}</div>
            {period.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Zodiac Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-s8 sm:p-s16 border-b  border-secondary-dark">
        {rashis.map((rashi) => (
          <button
            key={rashi.key}
            onClick={() => handleRashiClick(rashi)}
            className={`group relative p-3 rounded-lg border-2 transition-all ${
              selectedRashi?.key === rashi.key
                ? `bg-gradient-to-br ${rashi.color} text-background border-transparent shadow-lg scale-105`
                : "border-secondary-dark hover:border-primary-light/50 hover:shadow-md bg-background"
            }`}
          >
            <div className="text-xl md:text-2xl mb-1">{rashi.emoji}</div>
            <div className={`text-[9px] font-medium ${
              selectedRashi?.key === rashi.key ? "text-background" : "text-main"
            }`}>
              {rashi.name.toUpperCase()}
            </div>

            {selectedRashi?.key === rashi.key && (
              <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow">
                <Star className="w-3 h-3 text-accent-main fill-accent-main" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Horoscope Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-primary-main animate-spin" />
          </div>
        ) : selectedRashi && horoscope ? (
          <div className="p-5 space-y-2">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedRashi.color} text-background p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedRashi.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold">{selectedRashi.name}</h3>
                    <p className="text-xs text-background/80">
                      {periods.find(p => p.key === selectedPeriod)?.label} Prediction
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-background/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-background" />
                  <span className="font-bold">{horoscope.overallRating}/5</span>
                </div>
              </div>
            </div>

            {/* General */}
            <div className="bg-secondary-main/20 p-4 rounded-lg border border-secondary-dark">
              <p className="text-sm text-main leading-relaxed line-clamp-3">
                {horoscope.general}
              </p>
            </div>

            {/* Lucky Details */}
            <div className="bg-secondary-main/20 p-2 rounded-lg border border-secondary-dark">
              <h4 className="text-xs font-bold text-main mb-2 flex items-center gap-1">
                <span>🍀</span> Lucky Details
              </h4>
              <div className="flex gap-2 text-xs">
                <div>
                  <span className="text-secondary">Color:</span>{" "}
                  <span className="font-medium text-main">{horoscope.luckyDetails.color}</span>
                </div>
                <div>
                  <span className="text-secondary">Number:</span>{" "}
                  <span className="font-medium text-main">{horoscope.luckyDetails.number}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary">Time:</span>{" "}
                  <span className="font-medium text-main">{horoscope.luckyDetails.time}</span>
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={viewDetailedHoroscope}
              className="w-full bg-primary-main text-background py-3 px-4 rounded-lg font-medium hover:bg-primary-light transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              View Detailed Horoscope
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Star className="w-12 h-12 text-secondary-main mb-3" />
            <p className="text-sm text-secondary">Select your zodiac sign to view horoscope</p>
          </div>
        )}
      </div>
    </div>
  );
};

// EXACT KUNDALI MATCHING FORM
const KundaliMatchingMini = () => {
  const router = useRouter();
  const [boyData, setBoyData] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
    lat: "",
    lng: "",
  });
  const [girlData, setGirlData] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
    lat: "",
    lng: "",
  });
  const [errors, setErrors] = useState({ boy: {}, girl: {} });
  const [loading, setLoading] = useState(false);

  const updateBoyField = (field, value) => {
    setBoyData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, boy: { ...current.boy, [field]: "" } }));
  };

  const updateGirlField = (field, value) => {
    setGirlData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, girl: { ...current.girl, [field]: "" } }));
  };

  const handleBoyPlaceSelect = (place) => {
    setBoyData((current) => ({
      ...current,
      place: place.display_name,
      lat: place.lat,
      lng: place.lng,
    }));
    setErrors((current) => ({ ...current, boy: { ...current.boy, place: "" } }));
  };

  const handleGirlPlaceSelect = (place) => {
    setGirlData((current) => ({
      ...current,
      place: place.display_name,
      lat: place.lat,
      lng: place.lng,
    }));
    setErrors((current) => ({ ...current, girl: { ...current.girl, place: "" } }));
  };

  const validate = () => {
    const newErrors = { boy: {}, girl: {} };

    // Validate Boy
    if (!boyData.name.trim()) newErrors.boy.name = "Required";
    if (!boyData.date) newErrors.boy.date = "Required";
    if (!boyData.time) newErrors.boy.time = "Required";
    if (!boyData.place.trim() || boyData.lat === "" || boyData.lng === "") {
      newErrors.boy.place = "Required";
    }

    // Validate Girl
    if (!girlData.name.trim()) newErrors.girl.name = "Required";
    if (!girlData.date) newErrors.girl.date = "Required";
    if (!girlData.time) newErrors.girl.time = "Required";
    if (!girlData.place.trim() || girlData.lat === "" || girlData.lng === "") {
      newErrors.girl.place = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors.boy).length === 0 && Object.keys(newErrors.girl).length === 0;
  };

  const handleMatch = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) {
        alert("Please fill all required fields for both partners");
        return;
      }

      setLoading(true);

      const params = new URLSearchParams({
        boyName: boyData.name,
        boyDate: boyData.date,
        boyTime: boyData.time,
        boyPlace: boyData.place,
        boyLat: boyData.lat,
        boyLng: boyData.lng,
        girlName: girlData.name,
        girlDate: girlData.date,
        girlTime: girlData.time,
        girlPlace: girlData.place,
        girlLat: girlData.lat,
        girlLng: girlData.lng,
        autoMatch: "true",
      });

      router.push(`/astrology/kundali-matching?${params.toString()}`);
    },
    [boyData, girlData, router]
  );

  return (
    <form onSubmit={handleMatch} className="h-full flex flex-col bg-background">
      <div className="flex h-[55px] items-center justify-center border-b border-secondary-dark text-[24px] font-medium text-main bg-primary-light/20">
        Kundali Matching
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-6 pt-s64  px-s24 md:px-s56 pb-s32 overflow-auto">
        {/* Boy's Form */}
        <div className="space-y-3">
          <div className="flex h-[40px] items-center justify-center border-b-2 border-primary-main/30 text-[16px] font-medium text-primary-main bg-primary-main/5 rounded-t-xl">
             Boy's Details
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-main">
                <User className="mr-1 inline h-3 w-3" />
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={boyData.name}
                onChange={(e) => updateBoyField("name", e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${
                  errors.boy.name ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-main">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={boyData.date}
                  onChange={(e) => updateBoyField("date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${
                    errors.boy.date ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-main">
                  <Clock className="mr-1 inline h-3 w-3" />
                  Birth Time *
                </label>
                <input
                  type="time"
                  value={boyData.time}
                  onChange={(e) => updateBoyField("time", e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${
                    errors.boy.time ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-main">
                <MapPin className="mr-1 inline h-3 w-3" />
                Birth Place *
              </label>
              <PlaceSearch
                value={boyData.place}
                onSelect={handleBoyPlaceSelect}
                error={errors.boy.place}
              />
            </div>

            {boyData.lat !== "" && boyData.lng !== "" && (
              <div className="rounded-lg border border-primary-light/30 bg-primary-light/5 p-2">
                <p className="text-xs text-primary-main">
                  📍 {Number(boyData.lat).toFixed(2)}, {Number(boyData.lng).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Girl's Form */}
        <div className="space-y-3">
          <div className="flex h-[40px] items-center justify-center border-b-2 border-accent-main/30 text-[16px] font-medium text-accent-main bg-accent-main/5 rounded-t-xl">
             Girl's Details
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-main">
                <User className="mr-1 inline h-3 w-3" />
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={girlData.name}
                onChange={(e) => updateGirlField("name", e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-accent-main focus:border-transparent ${
                  errors.girl.name ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-main">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={girlData.date}
                  onChange={(e) => updateGirlField("date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-accent-main focus:border-transparent ${
                    errors.girl.date ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-main">
                  <Clock className="mr-1 inline h-3 w-3" />
                  Birth Time *
                </label>
                <input
                  type="time"
                  value={girlData.time}
                  onChange={(e) => updateGirlField("time", e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-accent-main focus:border-transparent ${
                    errors.girl.time ? "border-red-main bg-red-main/5" : "border-secondary-dark"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-main">
                <MapPin className="mr-1 inline h-3 w-3" />
                Birth Place *
              </label>
              <PlaceSearch
                value={girlData.place}
                onSelect={handleGirlPlaceSelect}
                error={errors.girl.place}
              />
            </div>

            {girlData.lat !== "" && girlData.lng !== "" && (
              <div className="rounded-lg border border-accent-main/30 bg-accent-main/5 p-2">
                <p className="text-xs text-accent-main">
                  📍 {Number(girlData.lat).toFixed(2)}, {Number(girlData.lng).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-end pb-6 px-4 border-t border-secondary-dark pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-main text-background px-10 py-3 text-base font-medium rounded-xl hover:bg-primary-light transition-all shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 fill-background" />
              Check Compatibility
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// KUNDALI GENERATOR WITH NAVIGATION
const KundaliMiniForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (formData) => {
      setLoading(true);

      const params = new URLSearchParams({
        name: formData.name,
        gender: formData.gender,
        date: formData.date,
        time: formData.time,
        place: formData.place,
        lat: formData.lat.toString(),
        lng: formData.lng.toString(),
        autoGenerate: "true",
      });

      router.push(`/astrology/kundali-making?${params.toString()}`);
    },
    [router]
  );

  return <KundaliFormCompact onSubmit={handleSubmit} loading={loading} />;
};

// Main Component
export default function AstrologyTools() {
  
  return (
    <section>
      <div className="mx-auto max-w-7xl px-s16">
        {/* Title */}
        <div className="mb-12 flex flex-col justify-start">
          <h2 className="heading-h3 mb-3">Astrology Tools</h2>
          <p className="text-secondary text-lg">
            Discover your cosmic destiny with our advanced astrology services
          </p>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr] mb-8">
          {/* Kundali */}
          <div className=" overflow-hidden rounded-2xl border border-secondary-dark bg-background shadow-sm hover:shadow-md transition-shadow">
            <KundaliMiniForm />
          </div>

          {/* Horoscope */}
          <div className=" overflow-hidden rounded-2xl border border-secondary-dark bg-background shadow-sm hover:shadow-md transition-shadow">
            <HoroscopeMini />
          </div>
        </div>

        {/* Kundali Matching */}
        <div className=" mt-s104 overflow-hidden rounded-2xl border border-secondary-dark bg-background shadow-sm hover:shadow-md transition-shadow">
          <KundaliMatchingMini />
        </div>
      </div>
    </section>
  );
}