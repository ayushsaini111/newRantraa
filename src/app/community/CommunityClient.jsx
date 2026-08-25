"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CommunityClient({
  userId,
  userEmail,
  userName,
  initialPhone,
  initialJoined,
}) {
  const [joined, setJoined] = useState(initialJoined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const handleJoin = async () => {
    setSaving(true);
    setError(false);

    try {
      const res = await fetch("/backend/user/community", {
        method: "POST",
        headers: {
          "x-user-id": userId,
          "x-user-email": userEmail ?? "",
          "x-user-name": userName ?? "",
        },
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setJoined(!!data.joined); // trust the server response, not an optimistic guess
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="relative mt-s80 overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="
          absolute -top-[45px] left-1/2 h-[70px] w-[120%]
          -translate-x-1/2 rounded-[50%] blur-[8px]
        "
      />

      <div
        className="
          relative z-10 mx-auto flex max-w-7xl
          flex-col items-center justify-center px-s16 py-s48
          text-center lg:py-s80
        "
      >
        <p className="heading-h5 font-medium text-main">Limited Time Offer</p>

        <h2 className="mt-s16 heading-h3 text-main">
          Join Community for Free*
        </h2>

        <p className="mt-s16 body-default text-secondary max-w-lg">
          Connect with fellow devotees, get early access to live poojas, and
          receive festival reminders straight on WhatsApp.
        </p>

        <div className="mt-s32 grid grid-cols-1 gap-s24 sm:grid-cols-3 max-w-3xl">
          <div className="flex flex-col items-center gap-s8">
            <p className="heading-h6 text-main">Live Katha</p>
            <p className="body-small text-secondary">
              Join weekly live sessions with our pandits.
            </p>
          </div>
          <div className="flex flex-col items-center gap-s8">
            <p className="heading-h6 text-main">Festival Reminders</p>
            <p className="body-small text-secondary">
              Never miss an auspicious date or muhurat.
            </p>
          </div>
          <div className="flex flex-col items-center gap-s8">
            <p className="heading-h6 text-main">Exclusive Offers</p>
            <p className="body-small text-secondary">
              Community-only discounts on bookings.
            </p>
          </div>
        </div>

        <div className="mt-s32">
          {initialPhone && !joined && (
            <div className="flex flex-col items-center gap-s8">
              <Button size="sm" onClick={handleJoin} disabled={saving}>
                {saving ? "Joining…" : "Join"}
              </Button>
              {error && (
                <p className="caption text-red-main">
                  Couldn&apos;t save — try again.
                </p>
              )}
            </div>
          )}

          {initialPhone && joined && (
            <p className="body-default text-main">Joined ✓</p>
          )}

          {!initialPhone && (
            <>
              <p className="body-default text-secondary max-w-md mb-s16">
                Add your phone number to your profile so we can reach you on
                WhatsApp.
              </p>
              <Link href="/profile?redirect=/community">
                <Button size="sm">Add phone number</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}