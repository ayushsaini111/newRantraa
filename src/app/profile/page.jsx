// frontend/src/app/profile/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, Trash2, ChevronRight, LogOut, User, MapPin, Shield, Mail, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";

function Avatar({ image, name, size = "lg", onClick, uploading }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const sizeClass = size === "lg" ? "w-32 h-32 text-3xl" : "w-10 h-10 text-sm";

  return (
    <div
      className={`relative ${sizeClass} rounded-full cursor-pointer group`}
      onClick={onClick}
    >
      {image ? (
        <Image 
          src={image} 
          alt={name || "Profile"} 
          width={128}
          height={128}
          className="w-full h-full rounded-full object-cover ring-4 ring-primary/20"
          unoptimized={image.includes('googleusercontent.com')}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold ring-4 ring-primary/20">
          {initials}
        </div>
      )}
      {size === "lg" && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          {uploading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera size={24} className="text-white" />
              <span className="text-xs text-white font-medium">Change Photo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-secondary-main rounded-r24 border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/50">
        <div className="p-2 bg-primary/10 rounded-r12">
          <Icon size={20} className="text-primary" />
        </div>
        <h2 className="body-default font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, options, readOnly, icon: Icon, required }) {
  return (
    <div className="space-y-2">
      <label className="caption font-medium text-text-secondary flex items-center gap-1">
        {label}
        {required && <span className="text-red-main">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon size={18} />
          </div>
        )}
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-r16 border border-border bg-background ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 body-small transition-all`}
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
            className={`w-full rounded-r16 border border-border bg-background ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 body-small transition-all ${readOnly ? "opacity-60 cursor-not-allowed bg-background/50" : ""}`}
          />
        )}
      </div>
    </div>
  );
}

function DeleteModal({ open, onConfirm, onClose, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-secondary-main rounded-r24 p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={32} className="text-red-main" />
        </div>
        <h3 className="heading-h5 text-center mb-2">Delete Account?</h3>
        <p className="body-small text-text-secondary text-center leading-relaxed">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} disabled={loading} className="flex-1 rounded-r16 border-2 border-border py-3 body-small font-medium hover:bg-background transition-colors disabled:opacity-50">
            Cancel
          </button>
          <Button onClick={onConfirm} loading={loading} className="flex-1 !bg-red-500 hover:!bg-red-600">
            Delete Forever
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileRef = useRef();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Helper to build headers with user info
  function getAuthHeaders(isFormData = false) {
    const headers = {};
    if (session?.user) {
      headers['x-user-id'] = session.user.id;
      headers['x-user-email'] = session.user.email || '';
      headers['x-user-name'] = session.user.name || '';
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://astro-nine-beige.vercel.app/user/profile", {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        console.log("Profile data:", data);
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          gender: data.gender || "",
          houseNo: data.houseNo || "",
          address: data.address || "",
          landmark: data.landmark || "",
          pinCode: data.pinCode || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  async function handleImageClick() {
    fileRef.current?.click();
  }

  // ✅ Handle image upload
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

      const res = await fetch("https://astro-nine-beige.vercel.app/user/profile", {
        method: "PUT",
        headers: getAuthHeaders(true), // FormData - no Content-Type
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      setProfile((p) => ({ ...p, image: data.user.image }));
      await update({ image: data.user.image });
      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  // ✅ Handle save
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

      const res = await fetch("https://astro-nine-beige.vercel.app/user/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanedForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setSuccess("Profile updated successfully!");
      await update({ name: form.name });

      // Refresh profile data
      const refreshRes = await fetch("https://astro-nine-beige.vercel.app/user/profile", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const updatedProfile = await refreshRes.json();

      setProfile(updatedProfile);
      setForm((f) => ({
        ...f,
        phone: updatedProfile.phone || "",
      }));

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  // ✅ Handle delete
  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("https://astro-nine-beige.vercel.app/user/delete", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="caption text-text-secondary">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const profileImage = profile.image || session?.user?.image;

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        {/* Header */}
        <div className="bg-secondary-main border-b border-border px-6 py-5 sticky top-0 z-10 backdrop-blur-lg bg-secondary-main/95">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="text-text-secondary hover:text-text-primary transition-colors p-2 -ml-2 rounded-r12 hover:bg-background"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <h1 className="heading-h5">My Profile</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 py-6">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Avatar
              image={profileImage}
              name={profile.name}
              uploading={uploading}
              onClick={handleImageClick}
            />
            <div className="text-center">
              <p className="heading-h5 mb-1">{profile.name || "Guest User"}</p>
              <div className="flex flex-col gap-1 items-center">
                {profile.email && (
                  <div className="flex items-center gap-2 caption text-text-secondary">
                    <Mail size={14} />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 caption text-text-secondary">
                    <Phone size={14} />
                    <span>+91 {profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-r16 p-4 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <p className="caption text-red-main flex-1">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-r16 p-4 flex items-start gap-3">
              <span className="text-lg">✓</span>
              <p className="caption text-green-600 dark:text-green-500 flex-1">{success}</p>
            </div>
          )}

          {/* Personal Info */}
          <SectionCard title="Personal Information" icon={User}>
            <div className="space-y-5">
              <Field 
                label="Full Name" 
                value={form.name} 
                onChange={set("name")} 
                placeholder="Enter your full name"
                icon={User}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  readOnly={false}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field 
                  label="Date of Birth" 
                  value={form.dob} 
                  onChange={set("dob")} 
                  type="date" 
                />
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
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field 
                  label="House/Flat No." 
                  value={form.houseNo} 
                  onChange={set("houseNo")} 
                  placeholder="Building, House no."
                />
                <Field 
                  label="PIN Code" 
                  value={form.pinCode} 
                  onChange={set("pinCode")} 
                  placeholder="6-digit PIN code" 
                  type="text"
                />
              </div>
              <Field 
                label="Address" 
                value={form.address} 
                onChange={set("address")} 
                placeholder="Area, Street, Sector, Village"
              />
              <Field 
                label="Landmark" 
                value={form.landmark} 
                onChange={set("landmark")} 
                placeholder="Nearby landmark (optional)"
              />
            </div>
          </SectionCard>

          {/* Save */}
          <Button 
            loading={saving} 
            onClick={handleSave} 
            className="w-full !py-4 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            💾 Save Changes
          </Button>

          {/* Account Actions */}
          <SectionCard title="Account Settings" icon={Shield}>
            <div className="space-y-3">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-between px-4 py-4 rounded-r16 hover:bg-background transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-r12 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                    <LogOut size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="body-small font-medium">Sign Out</span>
                </div>
                <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center justify-between px-4 py-4 rounded-r16 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-r12 group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors">
                    <Trash2 size={18} className="text-red-main" />
                  </div>
                  <span className="body-small font-medium text-red-main">Delete Account</span>
                </div>
                <ChevronRight size={18} className="text-red-main group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <DeleteModal
        open={showDelete}
        onConfirm={handleDelete}
        onClose={() => setShowDelete(false)}
        loading={deleting}
      />
    </>
  );
}