// frontend/src/components/Pandits/PanditsClient.jsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useSSE } from "@/hooks/useSSE"; // ✅ Use SSE instead of polling
import PanditsGrid from "./PanditsGrid";

const AgoraCall = dynamic(() => import("@/components/call/AgoraCall"), { ssr: false });

function PanditsClient({ pandits = [], userId }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || userId;

  const [loadingId, setLoadingId] = useState(null);
  const [requestedCalls, setRequestedCalls] = useState({});
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCallData, setActiveCallData] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const ringtoneRef = useRef(null);

  // Headers
  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "x-user-id": currentUserId || "",
    "x-user-email": session?.user?.email || "",
    "x-user-name": session?.user?.name || "",
  }), [currentUserId, session]);

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

  // ✅ SSE events (NO POLLING)
  useSSE(currentUserId ? `/backend/events?userId=${currentUserId}` : null, {
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

  // Request call
  async function handleRequestCall(pandit) {
    if (!currentUserId) {
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
        alert(data.error || "Failed to request call");
        return;
      }

      setRequestedCalls((prev) => ({ ...prev, [pandit.id]: data.callId }));
    } catch (e) {
      console.error("Request call error:", e);
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
    <>
      <PanditsGrid
        sectionTitle="All Pandits"
        pandits={pandits}
        requestedCalls={requestedCalls}
        loadingId={loadingId}
        onRequestCall={handleRequestCall}
        userId={currentUserId}
      />

      {/* Waiting banner */}
      {Object.keys(requestedCalls).length > 0 && !incomingCall && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary-main text-white px-s24 py-s16 flex items-center gap-s16 z-50">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            🙏
          </div>
          <div className="flex-1">
            <p className="body-small font-semibold">Waiting for expert...</p>
            <p className="caption opacity-80">You'll get a call shortly</p>
          </div>
          <button onClick={() => setRequestedCalls({})} className="caption underline">
            Cancel
          </button>
        </div>
      )}

      {/* Incoming call overlay */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-between px-s24 py-s64">
          <div className="text-center">
            <p className="caption text-zinc-400 uppercase mb-s24">Incoming Call</p>
            
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-4xl shadow-2xl mx-auto mb-s32">
              {incomingCall.pandit?.name?.slice(0, 2).toUpperCase() ?? "PA"}
            </div>

            <h2 className="heading-h3 text-white mb-s8">
              {incomingCall.pandit?.name ?? "Pandit"}
            </h2>
            <p className="body-small text-zinc-400">
              {incomingCall.pandit?.speciality ?? "Astrologer"}
            </p>
          </div>

          <div className="flex gap-s80">
            <button
              onClick={handleReject}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl"
            >
              ✕
            </button>

            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-xl disabled:opacity-60"
            >
              ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PanditsClient;