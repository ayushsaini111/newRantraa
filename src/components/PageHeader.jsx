'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, CreditCard, HelpCircle, LogOut, X,
  Calendar, Phone, Star, Settings, ChevronRight,
  Check, AlertCircle, Edit2
} from "lucide-react";

function calcCompletion(user) {
  const fields = [
    { label: "Username",  done: !!user?.username },
    { label: "Phone",     done: !!user?.phone },
    { label: "Email",     done: !!user?.email },
    { label: "Birthday",  done: !!user?.dob },
    { label: "Gender",    done: !!user?.gender },
    { label: "Address",   done: !!user?.address },
  ];
  const done = fields.filter(f => f.done).length;
  return { fields, percent: Math.round((done / fields.length) * 100) };
}

function PageHeader({
  title, subtitle,
  notificationClassName = "",
  profileClassName = "",
  className = "",
  showNotification = true,
  showProfile = true,
}) {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [showSidebar, setShowSidebar]   = useState(false);
  const [activeTab, setActiveTab]       = useState("menu"); // "menu" | "profile"
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState("");
  const [saveSuccess, setSaveSuccess]   = useState(false);

  // Editable fields
  const [form, setForm] = useState({
    username: "", dob: "", gender: "", address: "", phone: "",
  });

  const user = session?.user ?? null;
  const isLoading = status === "loading";
  const isLoggedIn = !!user;
  const resolvedImage = user?.image ?? user?.profilePic ?? null;
  const resolvedName  = user?.username ?? user?.name ?? null;
  const resolvedRole  = user?.role ?? "user";
  const initials      = (resolvedName ?? "U").slice(0, 1).toUpperCase();
  const { fields, percent } = calcCompletion(user);

  // Pre-fill form when sidebar opens
  useEffect(() => {
    if (showSidebar && user) {
      setForm({
        username: user.username ?? "",
        dob:      user.dob ? user.dob.slice(0, 10) : "",
        gender:   user.gender   ?? "",
        address:  user.address  ?? "",
        phone:    user.phone    ?? "",
      });
      setSaveError("");
      setSaveSuccess(false);
    }
  }, [showSidebar, user]);

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Failed to save"); return; }
      await updateSession(); // refresh NextAuth session
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setSaveError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }



  return (
    <>
      <div className={`flex text-center justify-center items-center  pt-s64 pb-s16 px-s16 md:px-s32 ${className}`}>
        <div>
          <h1 className="heading-h1 text-main">{title}</h1>
          {subtitle && <p className="body-default text-secondary">{subtitle}</p>}
        </div>

       
      </div>

      
    </>
  );
}

export default PageHeader;