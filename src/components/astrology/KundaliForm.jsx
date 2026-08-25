"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import PlaceSearch from "./PlaceSearch";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function KundaliForm({
  onSubmit,
  title = "Birth Details",
  loading = false,
  initialData = null,
  showGender = true,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender || "MALE",
    date: initialData?.date || "",
    time: initialData?.time || "",
    place: initialData?.place || "",
    lat: initialData?.lat || "",
    lng: initialData?.lng || "",
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

    if (showGender && !formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.date) {
      newErrors.date = "Birth date is required";
    }

    if (!formData.time) {
      newErrors.time = "Birth time is required";
    }

    if (
      !formData.place.trim() ||
      formData.lat === "" ||
      formData.lng === ""
    ) {
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

  return (
    <div className="overflow-hidden rounded-xl bg-background shadow-lg border border-primary-main/10">
      <div className="bg-gradient-to-r from-primary-main to-primary-light p-6">
        <h3 className="flex items-center text-xl font-bold text-background">
          <User className="mr-2 h-5 w-5" />
          {title}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Name */}
        <div>
          <label
            htmlFor="kundali-name"
            className="mb-2 block text-sm font-semibold text-main"
          >
            <User className="mr-1 inline h-4 w-4" />
            Full Name *
          </label>

          <input
            id="kundali-name"
            type="text"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            className={`w-full rounded-xl border p-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-light ${
              errors.name
                ? "border-red-main bg-red-main/5"
                : "border-secondary-dark"
            }`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-main">{errors.name}</p>
          )}
        </div>

        {/* Gender - Only show if showGender is true */}
        {showGender && (
          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-main">
              Gender *
            </legend>

            <div className="grid grid-cols-3 gap-3">
              {GENDER_OPTIONS.map((option) => {
                const selected = formData.gender === option.value;

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-medium transition ${
                      selected
                        ? "border-primary-light bg-primary-light/10 text-primary-main ring-1 ring-primary-light"
                        : "border-secondary-dark bg-background text-main hover:bg-secondary-main/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={selected}
                      onChange={(event) =>
                        updateField("gender", event.target.value)
                      }
                      className="sr-only"
                    />

                    {option.label}
                  </label>
                );
              })}
            </div>

            {errors.gender && (
              <p className="mt-1 text-sm text-red-main">{errors.gender}</p>
            )}
          </fieldset>
        )}

        {/* Date and time */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="kundali-date"
              className="mb-2 block text-sm font-semibold text-main"
            >
              <Calendar className="mr-1 inline h-4 w-4" />
              Birth Date *
            </label>

            <input
              id="kundali-date"
              type="date"
              value={formData.date}
              onChange={(event) => updateField("date", event.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full rounded-xl border p-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-light ${
                errors.date
                  ? "border-red-main bg-red-main/5"
                  : "border-secondary-dark"
              }`}
            />

            {errors.date && (
              <p className="mt-1 text-sm text-red-main">{errors.date}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="kundali-time"
              className="mb-2 block text-sm font-semibold text-main"
            >
              <Clock className="mr-1 inline h-4 w-4" />
              Birth Time *
            </label>

            <input
              id="kundali-time"
              type="time"
              value={formData.time}
              onChange={(event) => updateField("time", event.target.value)}
              className={`w-full rounded-xl border p-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-light ${
                errors.time
                  ? "border-red-main bg-red-main/5"
                  : "border-secondary-dark"
              }`}
            />

            {errors.time && (
              <p className="mt-1 text-sm text-red-main">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Birth place */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-main">
            <MapPin className="mr-1 inline h-4 w-4" />
            Birth Place *
          </label>

          <PlaceSearch
            value={formData.place}
            onSelect={handlePlaceSelect}
            error={errors.place}
          />

          {errors.place && (
            <p className="mt-1 text-sm text-red-main">{errors.place}</p>
          )}
        </div>

        {/* Coordinates */}
        {formData.lat !== "" && formData.lng !== "" && (
          <div className="rounded-lg border border-primary-light/30 bg-primary-light/5 p-3">
            <p className="text-sm text-primary-main">
              📍 Coordinates: {Number(formData.lat).toFixed(4)},{" "}
              {Number(formData.lng).toFixed(4)}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-primary-main to-primary-light px-6 py-4 font-semibold text-background transition-all duration-200 hover:scale-[1.02] hover:from-primary-light hover:to-primary-main disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Generating Kundali...
            </span>
          ) : (
            "Generate Kundali"
          )}
        </button>
      </form>
    </div>
  );
}