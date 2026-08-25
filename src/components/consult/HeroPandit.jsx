// frontend/src/components/consult/ConsultClient.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSSE } from "@/hooks/useSSE";
import { useCallPolling } from "@/hooks/useCallPolling";
import CallExpertsSection from "@/components/consult/CallExpertsSection";
import Link from "next/link";



const AgoraCall = dynamic(() => import("@/components/call/AgoraCall"), { ssr: false });

export default function ConsultClient({ pandits, userId: propUserId }) {
  const { data: session } = useSession();
  const userId = session?.user?.id || propUserId;
  const router = useRouter();

  const [loadingId, setLoadingId] = useState(null);
  const [requestedCalls, setRequestedCalls] = useState({});
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCallData, setActiveCallData] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const ringtoneRef = useRef(null);

  // Headers
  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "x-user-id": userId || "",
    "x-user-email": session?.user?.email || "",
    "x-user-name": session?.user?.name || "",
  }), [userId, session]);

  // Setup ringtone
  useEffect(() => {
    const audio = new Audio("/ringtone.mp3");
    audio.loop = true;
    ringtoneRef.current = audio;
    return () => audio.pause();
  }, []);

  // Handle incoming call
  const handleIncomingCall = useCallback((callData) => {
    setIncomingCall(callData);
    setRequestedCalls({});
    ringtoneRef.current?.play().catch(() => {});
  }, []);

  // SSE events
  useSSE(userId ? `/backend/events?userId=${userId}` : null, {
    "call-ringing": handleIncomingCall,
    "call-accepted": (data) => {
      ringtoneRef.current?.pause();
      setIncomingCall(null);
      setRequestedCalls({});
      setActiveCallData(data);
    },
    "call-ended": () => {
      ringtoneRef.current?.pause();
      setIncomingCall(null);
      setRequestedCalls({});
      setActiveCallData(null);
    },
  });

  // Polling fallback
  useCallPolling(requestedCalls, userId, handleIncomingCall);

  // Request call
  async function handleRequestCall(pandit) {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    setLoadingId(pandit.id);

    try {
      const res = await fetch("/backend/call/initiate", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ panditId: pandit.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NO_BALANCE") {
          // ✅ Save return URL before redirecting
          sessionStorage.setItem("returnUrl", "/consult");
          router.push("/plans");
          return;
        }
        if (data.error === "DAILY_LIMIT_REACHED") {
          alert("⏰ " + data.message);
          return;
        }
        if (data.error === "INCOMPLETE_PROFILE") {
          alert("Please complete your profile first");
          router.push("/profile");
          return;
        }
        alert(data.error || "Failed to request call");
        return;
      }

      setRequestedCalls((prev) => ({ ...prev, [pandit.id]: data.callId }));
    } catch (e) {
      console.error("Initiate call error:", e);
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  // Accept call
  async function handleAccept() {
    if (!incomingCall || accepting) return;
    setAccepting(true);
    ringtoneRef.current?.pause();

    try {
      const res = await fetch("/backend/call/accept", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ callId: incomingCall.id }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to connect");
        return;
      }

      setActiveCallData({ ...data, pandit: incomingCall.pandit });
      setIncomingCall(null);
    } catch {
      alert("Something went wrong");
    } finally {
      setAccepting(false);
    }
  }

  // Reject call
  async function handleReject() {
    if (!incomingCall) return;
    ringtoneRef.current?.pause();
    
    const callId = incomingCall.id;
    setIncomingCall(null);

    await fetch("/backend/call/reject", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ callId }),
    });
  }

  // Active call screen
  if (activeCallData) {
    return (
      <AgoraCall
        callData={activeCallData}
        callerInfo={activeCallData?.pandit}
        onEnd={() => {
          setActiveCallData(null);
          setIncomingCall(null);
          setRequestedCalls({});
        }}
      />
    );
  }


   return (
  <main className=" bg-background pt-s56">
    <div className="mx-auto max-w-7xl px-s16 py-s40 sm:px-s24 lg:px-s32">

      {/* Header */}
      <div className="mb-s40 flex items-start justify-between gap-s24">
        <h1 className="heading-h2 text-main">
          Talk to Verified Vedic
          <br />
          Pandits
        </h1>
 <Link
            href="/pandits"
            className="
              hidden
              shrink-0
              pt-s8
              body-small
              font-medium
              text-primary-main
              
              hover:text-primary-main/50
              sm:block
            "
          >
            View All Pandits
          </Link>
      </div>

      {/* Maximum 6 Pandits */}
    <div className="mx-auto max-w-3xl">
        <CallExpertsSection
        pandits={pandits.slice(0, 6)}
        requestedCalls={requestedCalls}
        loadingId={loadingId}
        onRequestCall={handleRequestCall}
        userId={userId}
      />
    </div>
    </div>

    {/* Waiting Banner */}
    {Object.keys(requestedCalls).length > 0 && !incomingCall && (
      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          items-center
          gap-s16
          bg-primary-main
          px-s24
          py-s16
          text-white
          shadow-lg
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white/20
          "
        >
          🙏
        </div>

        <div className="flex-1">
          <p className="body-small font-semibold">
            Waiting for expert...
          </p>

          <p className="caption opacity-80">
            You'll get a call shortly
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRequestedCalls({})}
          className="caption underline opacity-80 hover:opacity-100"
        >
          Cancel
        </button>
      </div>
    )}

    {/* Incoming Call */}
    {incomingCall && (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-zinc-900 to-black px-s24 py-s64">

        <div className="text-center">
          <p className="caption mb-s24 uppercase tracking-widest text-zinc-400">
            Incoming Call
          </p>

          <div className="relative mx-auto mb-s32 h-32 w-32">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />

            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-4xl font-bold text-white shadow-2xl">
              {incomingCall?.pandit?.name
                ?.slice(0, 2)
                .toUpperCase() ?? "PA"}
            </div>
          </div>

          <h2 className="heading-h3 mb-s8 text-white">
            {incomingCall?.pandit?.name ?? "Pandit"}
          </h2>

          <p className="body-small text-zinc-400">
            {Array.isArray(incomingCall?.pandit?.speciality)
              ? incomingCall.pandit.speciality.join(" & ")
              : incomingCall?.pandit?.speciality ?? "Astrologer"}
          </p>
        </div>

        <div className="flex items-center gap-s80">

          {/* Decline */}
          <div className="flex flex-col items-center gap-s8">
            <button
              type="button"
              onClick={handleReject}
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-red-500
                shadow-xl
                transition-all
                hover:bg-red-600
                active:scale-95
              "
            >
              <svg
                className="h-9 w-9 text-white"
                style={{ transform: "rotate(135deg)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
            </button>

            <p className="caption text-zinc-400">
              Decline
            </p>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-s8">
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-emerald-500
                shadow-xl
                transition-all
                hover:bg-emerald-600
                active:scale-95
                disabled:opacity-60
              "
            >
              <svg
                className="h-9 w-9 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
            </button>

            <p className="caption text-zinc-400">
              {accepting ? "Connecting..." : "Accept"}
            </p>
          </div>

        </div>
      </div>
    )}
  </main>
);
 
}