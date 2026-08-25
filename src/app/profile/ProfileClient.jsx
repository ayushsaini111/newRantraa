// frontend/src/app/profile/ProfileClient.jsx
"use client";

import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Camera, Trash2, ChevronLeft, LogOut, User, MapPin, Shield,
  Mail, Phone, AlertCircle, CheckCircle2, Save,
} from "lucide-react";
import Button from "@/components/ui/Button";

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ image, name, size = "lg", onClick, uploading }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const sizeClass = size === "lg" ? "w-28 h-28 sm:w-32 sm:h-32 text-2xl sm:text-3xl" : "w-10 h-10 text-sm";

  return (
    <div className={`relative ${sizeClass} rounded-full cursor-pointer group shrink-0`} onClick={onClick}>
      {image ? (
        <Image
          src={image}
          alt={name || "Profile"}
          width={128}
          height={128}
          className="w-full h-full rounded-full object-cover ring-4 ring-primary-main/20"
          unoptimized={image.includes("googleusercontent.com")}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-primary-main flex items-center justify-center text-background font-semibold ring-4 ring-primary-main/20">
          {initials}
        </div>
      )}
      {size === "lg" && (
        <div className="absolute inset-0 rounded-full bg-main/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera size={22} className="text-background" />
              <span className="caption text-background font-medium">Change Photo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section Card ────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-primary-light/5 rounded-r24 border border-secondary-dark p-s16 sm:p-s24 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-s16 mb-s16 sm:mb-s24 pb-s16 border-b border-secondary-dark">
        <div className="p-s8 bg-primary-main/10 rounded-r8">
          <Icon size={18} className="text-primary-main" />
        </div>
        <h2 className="body-default font-semibold text-main">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text", placeholder, options, readOnly, icon: Icon, required }) {
  return (
    <div className="space-y-s8">
      <label className="caption font-medium text-secondary flex items-center gap-1">
        {label}
        {required && <span className="text-red-main">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            <Icon size={17} />
          </div>
        )}
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-r16 border border-secondary-dark bg-background ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-main/15 body-small transition-all`}
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={readOnly}
            className={`w-full rounded-r16 border border-secondary-dark bg-background ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-main/15 body-small transition-all ${
              readOnly ? "opacity-60 cursor-not-allowed bg-secondary-main/10" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
}

// ─── Delete Modal ────────────────────────────────────────────────────────────

function DeleteModal({ open, onConfirm, onClose, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main/60 backdrop-blur-sm p-s16">
      <div className="bg-background rounded-r24 p-s32 w-full max-w-md shadow-2xl">
        <div className="w-16 h-16 bg-red-main/10 rounded-full flex items-center justify-center mx-auto mb-s16">
          <Trash2 size={28} className="text-red-main" />
        </div>
        <h3 className="heading-h5 text-main text-center mb-s8">Delete Account?</h3>
        <p className="body-small text-secondary text-center leading-relaxed">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="flex gap-s16 mt-s32">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-r16 border-2 border-secondary-dark py-s16 body-small font-medium text-main hover:bg-secondary-main/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <Button onClick={onConfirm} loading={loading} className="flex-1 !bg-red-main hover:!bg-red-dark">
            Delete Forever
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProfileClient({ session: serverSession, initialProfile }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileRef = useRef();

  // ✅ Pre-hydrated with server-fetched data — no loading state needed at all
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState({
    name: initialProfile.name || "",
    email: initialProfile.email || "",
    phone: initialProfile.phone || "",
    dob: initialProfile.dob ? initialProfile.dob.split("T")[0] : "",
    gender: initialProfile.gender || "",
    houseNo: initialProfile.houseNo || "",
    address: initialProfile.address || "",
    landmark: initialProfile.landmark || "",
    pinCode: initialProfile.pinCode || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = session?.user || serverSession?.user;

  function getAuthHeaders(isFormData = false) {
    const headers = {};
    if (currentUser) {
      headers["x-user-id"] = currentUser.id;
      headers["x-user-email"] = currentUser.email || "";
      headers["x-user-name"] = currentUser.name || "";
    }
    if (!isFormData) headers["Content-Type"] = "application/json";
    return headers;
  }

  function handleImageClick() {
    fileRef.current?.click();
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });

      const res = await fetch("/backend/user/profile", {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setProfile((p) => ({ ...p, image: data.user.image }));
      await update({ image: data.user.image });
      setSuccess("Profile photo updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name?.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.email?.trim() && !form.phone?.trim()) {
      setError("Either email or phone number is required.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const cleanedForm = {
        ...form,
        phone: form.phone ? form.phone.replace(/\s/g, "") : form.phone,
      };

      const res = await fetch("/backend/user/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanedForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccess("Profile updated successfully");
      await update({ name: form.name });

      // Refresh profile data silently
      const refreshRes = await fetch("/backend/user/profile", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const updatedProfile = await refreshRes.json();

      setProfile(updatedProfile);
      setForm((f) => ({ ...f, phone: updatedProfile.phone || "" }));

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/backend/user/delete", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to delete account");

      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      setError("Failed to delete account");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  function set(key) {
    return (val) => setForm((f) => ({ ...f, [key]: val }));
  }

  const profileImage = profile.image || currentUser?.image;

  return (
    <>
      <div className="min-h-screen mt-s80 bg-background pb-s64">
        {/* Header */}
        <div className="bg-secondary-main/20 border-b border-secondary-dark px-s16 sm:px-s24 py-s16 sm:py-s24 sticky top-0 z-10 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-s16">
            <button
              onClick={() => router.back()}
              className="text-secondary hover:text-main transition-colors p-s8 -ml-s8 rounded-r8 hover:bg-background"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="heading-h5 text-main">My Profile</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-s16 pt-s24 sm:pt-s32 space-y-s16 sm:space-y-s24">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-s16 py-s16">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <Avatar image={profileImage} name={profile.name} uploading={uploading} onClick={handleImageClick} />
            <div className="text-center">
              <p className="heading-h5 text-main mb-s6">{profile.name || "Guest User"}</p>
              <div className="flex flex-col gap-s6 items-center">
                {profile.email && (
                  <div className="flex items-center gap-s8 caption text-secondary">
                    <Mail size={13} />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-s8 caption text-secondary">
                    <Phone size={13} />
                    <span>+91 {profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="bg-red-main/10 border border-red-main/20 rounded-r16 p-s16 flex items-start gap-s16">
              <AlertCircle size={18} className="text-red-main shrink-0 mt-0.5" />
              <p className="caption text-red-main flex-1">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-primary-main/10 border border-primary-main/20 rounded-r16 p-s16 flex items-start gap-s16">
              <CheckCircle2 size={18} className="text-primary-main shrink-0 mt-0.5" />
              <p className="caption text-primary-main flex-1">{success}</p>
            </div>
          )}

          {/* Personal Info */}
          <SectionCard title="Personal Information" icon={User}>
            <div className="space-y-s16 sm:space-y-s20">
              <Field
                label="Full Name"
                value={form.name}
                onChange={set("name")}
                placeholder="Enter your full name"
                icon={User}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-s16">
                <Field
                  label="Email Address"
                  value={form.email}
                  onChange={profile.provider === "PHONE" ? set("email") : undefined}
                  placeholder="your.email@example.com"
                  type="email"
                  icon={Mail}
                  readOnly={profile.provider === "GOOGLE"}
                />
                <Field
                  label="Phone Number"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="10-digit phone number"
                  type="tel"
                  icon={Phone}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-s16">
                <Field label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" />
                <Field
                  label="Gender"
                  value={form.gender}
                  onChange={set("gender")}
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
              </div>
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Address Details" icon={MapPin}>
            <div className="space-y-s16 sm:space-y-s20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-s16">
                <Field label="House/Flat No." value={form.houseNo} onChange={set("houseNo")} placeholder="Building, House no." />
                <Field label="PIN Code" value={form.pinCode} onChange={set("pinCode")} placeholder="6-digit PIN code" />
              </div>
              <Field label="Address" value={form.address} onChange={set("address")} placeholder="Area, Street, Sector, Village" />
              <Field label="Landmark" value={form.landmark} onChange={set("landmark")} placeholder="Nearby landmark (optional)" />
            </div>
          </SectionCard>

          {/* Save */}
          <Button
            loading={saving}
            onClick={handleSave}
            className="w-full !py-s16 body-default font-semibold flex items-center justify-center gap-s8"
          >
            <Save size={18} />
            Save Changes
          </Button>

          {/* Account Actions */}
          <SectionCard title="Account Settings" icon={Shield}>
            <div className="space-y-s8">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-between px-s16 py-s16 rounded-r16 hover:bg-secondary-main/20 transition-colors group"
              >
                <div className="flex items-center gap-s16">
                  <div className="p-s8 bg-primary-main/10 rounded-r8 group-hover:bg-primary-main/20 transition-colors">
                    <LogOut size={17} className="text-primary-main" />
                  </div>
                  <span className="body-small font-medium text-main">Sign Out</span>
                </div>
                <ChevronLeft size={17} className="rotate-180 text-secondary group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center justify-between px-s16 py-s16 rounded-r16 hover:bg-red-main/5 transition-colors group"
              >
                <div className="flex items-center gap-s16">
                  <div className="p-s8 bg-red-main/10 rounded-r8 group-hover:bg-red-main/20 transition-colors">
                    <Trash2 size={17} className="text-red-main" />
                  </div>
                  <span className="body-small font-medium text-red-main">Delete Account</span>
                </div>
                <ChevronLeft size={17} className="rotate-180 text-red-main group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <DeleteModal open={showDelete} onConfirm={handleDelete} onClose={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}