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
  showGender = true, // New prop to control gender field visibility
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender || "MALE", // Default to MALE
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

    // Only validate gender if it's shown
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
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h3 className="flex items-center text-xl font-bold text-white">
          <User className="mr-2 h-5 w-5" />
          {title}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Name */}
        <div>
          <label
            htmlFor="kundali-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
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
            className={`w-full rounded-xl border p-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Gender - Only show if showGender is true */}
        {showGender && (
          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-gray-700">
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
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
              <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
            )}
          </fieldset>
        )}

        {/* Date and time */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="kundali-date"
              className="mb-2 block text-sm font-semibold text-gray-700"
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
              className={`w-full rounded-xl border p-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                errors.date
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />

            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="kundali-time"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              <Clock className="mr-1 inline h-4 w-4" />
              Birth Time *
            </label>

            <input
              id="kundali-time"
              type="time"
              value={formData.time}
              onChange={(event) => updateField("time", event.target.value)}
              className={`w-full rounded-xl border p-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                errors.time
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />

            {errors.time && (
              <p className="mt-1 text-sm text-red-500">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Birth place */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <MapPin className="mr-1 inline h-4 w-4" />
            Birth Place *
          </label>

          <PlaceSearch
            value={formData.place}
            onSelect={handlePlaceSelect}
            error={errors.place}
          />

          {errors.place && (
            <p className="mt-1 text-sm text-red-500">{errors.place}</p>
          )}
        </div>

        {/* Coordinates */}
        {formData.lat !== "" && formData.lng !== "" && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-700">
              📍 Coordinates: {Number(formData.lat).toFixed(4)},{" "}
              {Number(formData.lng).toFixed(4)}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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