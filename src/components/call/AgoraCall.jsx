// frontend/src/components/call/AgoraCall.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAgora } from "@/hooks/useAgora";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const FREE_CALL_SECONDS = 5;

export default function AgoraCall({ callData, callerInfo, onEnd, forceEnd }) {
  const { data: session } = useSession();

  const {
    joined,
    remoteJoined,
    remoteLeft,
    muted,
    ready,
    error,
    joinCall,
    leaveCall,
    toggleMute,
  } = useAgora();

  const [duration, setDuration] = useState(0);
  const [ending, setEnding] = useState(false);
  const [status, setStatus] = useState("connecting");
  const [warning, setWarning] = useState(null);

  const timerRef = useRef(null);
  const joinedRef = useRef(false);
  const callStartRef = useRef(null);
  const endingRef = useRef(false);
  const wasConnectedRef = useRef(false);

  const router = useRouter();

  // ─── Auth headers ─────────────────────────────────────────────────────────────
  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "x-user-id": session?.user?.id || "",
      "x-user-email": session?.user?.email || "",
      "x-user-name": session?.user?.name || "",
    };
  }, [session]);

  // ─── End call ─────────────────────────────────────────────────────────────────
  const handleEnd = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    setEnding(true);
    setStatus("ending");

    clearInterval(timerRef.current);

    const exactDuration = callStartRef.current
      ? Math.floor((Date.now() - callStartRef.current) / 1000)
      : 0;

    console.log("📞 Ending call:", { callId: callData.callId, duration: exactDuration });

    try {
      await leaveCall();
    } catch (e) {
      console.error("Leave Agora error:", e);
    }

    try {
      const res = await fetch("https://astro-nine-beige.vercel.app/call/end", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ callId: callData.callId, clientDuration: exactDuration }),
      });
      if (!res.ok) console.error("End call API failed:", res.status);
    } catch (e) {
      console.error("End call API error:", e);
    }

    onEnd();
  }, [callData, leaveCall, onEnd, getHeaders]);

  // ─── Force end (SSE signal from server) ──────────────────────────────────────
  useEffect(() => {
    if (forceEnd && !endingRef.current) handleEnd();
  }, [forceEnd, handleEnd]);

  // ─── Join Agora once SDK is ready ────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !callData || joinedRef.current) return;
    joinedRef.current = true;
    console.log("🎯 Joining Agora call:", callData);
    joinCall({
      appId: callData.appId,
      token: callData.token,
      channelName: callData.channelName,
      uid: callData.uid,
    });
  }, [ready, callData, joinCall]);

  // ─── Remote joined → start timer ─────────────────────────────────────────────
  useEffect(() => {
    if (!remoteJoined || !callData?.callId) return;
    wasConnectedRef.current = true;
    setStatus("connected");

    console.log("✅ Remote joined, starting timer");

    // Mark call as ongoing
    fetch("https://astro-nine-beige.vercel.app/call/mark-ongoing", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ callId: callData.callId }),
    }).catch((err) => console.error("Failed to mark call ongoing:", err));

    // Fetch server start time
    fetch(`https://astro-nine-beige.vercel.app/call/status?callId=${callData.callId}`, { headers: getHeaders() })
      .then((r) => r.json())
      .then((serverData) => {
        const serverStart = serverData.startTime
          ? new Date(serverData.startTime).getTime()
          : Date.now();

        callStartRef.current = serverStart;
        setDuration(Math.floor((Date.now() - serverStart) / 1000));

        // Update timer every 500ms
        timerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - callStartRef.current) / 1000);
          setDuration(elapsed);

          // ✅ Show warning when free call ends (UI only - backend handles deduction)
          if (callData.isFreeCall && elapsed === FREE_CALL_SECONDS) {
            setWarning("free_call_ended");
            setTimeout(() => setWarning(null), 3000);
          }
        }, 500);
      })
      .catch((e) => {
        console.error("Call status fetch failed:", e);
        callStartRef.current = Date.now();
        setDuration(0);
        timerRef.current = setInterval(() => {
          setDuration(Math.floor((Date.now() - callStartRef.current) / 1000));
        }, 500);
      });

    return () => clearInterval(timerRef.current);
  }, [remoteJoined, callData, getHeaders]);

  // ─── Heartbeat - detect server-side call end ─────────────────────────────────
  useEffect(() => {
    if (!callData?.callId || !remoteJoined) return;

    const heartbeat = setInterval(async () => {
      try {
        const res = await fetch("https://astro-nine-beige.vercel.app/call/heartbeat", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ callId: callData.callId }),
        });

        if (res.status === 410) {
          console.log("💔 Call ended on server (heartbeat)");
          clearInterval(heartbeat);
          if (!endingRef.current) {
            setWarning("call_ended_server");
            setTimeout(() => handleEnd(), 1000);
          }
        }
      } catch (err) {
        console.error("Heartbeat failed:", err);
      }
    }, 5000);

    return () => clearInterval(heartbeat);
  }, [callData, remoteJoined, handleEnd, getHeaders]);

  // ─── Remote left ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!remoteLeft || endingRef.current) return;
    console.log("📵 Remote left");
    setWarning("call_cancelled");
    setTimeout(() => handleEnd(), 1500);
  }, [remoteLeft, handleEnd]);

  // ─── Waiting status ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (joined && !remoteJoined && !wasConnectedRef.current) setStatus("waiting");
  }, [joined, remoteJoined]);

  // ─── No-answer timeout (60 s) ─────────────────────────────────────────────────
  useEffect(() => {
    if (!joined || remoteJoined) return;
    const timeout = setTimeout(() => {
      if (!wasConnectedRef.current) {
        console.log("⏰ No answer timeout");
        setWarning("no_answer");
        setTimeout(() => handleEnd(), 2000);
      }
    }, 60000);
    return () => clearTimeout(timeout);
  }, [joined, remoteJoined, handleEnd]);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function formatTime(s) {
    return `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  }

  const name = callerInfo?.name ?? callerInfo?.username ?? "Connected";
  const initials = name.slice(0, 2).toUpperCase();
  const speciality = callerInfo?.speciality ?? "";

  const statusText = {
    connecting: "Connecting...",
    waiting: "Waiting for other side...",
    connected: "Connected",
    ending: "Ending call...",
  }[status];

  const statusColor = status === "connected" ? "#34d399" : "#94a3b8";

  const warningText = {
    free_call_ended: "🎁 Free 5s over. Using plan now...",
    no_answer: "📵 No answer. Ending call...",
    call_cancelled: "📵 Call ended by other side",
    call_ended_server: "📵 Call ended",
  }[warning];

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(180deg, #0f172a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 32px 48px",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Status label */}
      <p
        style={{
          color: statusColor,
          fontSize: 12,
          letterSpacing: 3,
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {statusText}
      </p>

      {/* Warning banner */}
      {warning && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 24,
            right: 24,
            background: warning === "free_call_ended" ? "#064e3b" : "#7f1d1d",
            border: `1px solid ${warning === "free_call_ended" ? "#34d399" : "#ef4444"}`,
            borderRadius: 12,
            padding: "12px 16px",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {warningText}
        </div>
      )}

      {/* Free call countdown */}
      {callData?.isFreeCall && remoteJoined && duration < FREE_CALL_SECONDS && !warning && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 24,
            right: 24,
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: 12,
            padding: "10px 16px",
            color: "#34d399",
            fontSize: 13,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          🎁 Free call: {Math.max(0, FREE_CALL_SECONDS - duration)}s remaining
        </div>
      )}

      {/* Avatar + name + timer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          {joined && (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  background: "rgba(52,211,153,0.1)",
                  animation: "pulse1 2s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  background: "rgba(52,211,153,0.15)",
                  animation: "pulse1 2s ease-in-out infinite",
                  animationDelay: "0.5s",
                }}
              />
            </>
          )}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #065f46, #047857)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 700,
              color: "#ecfdf5",
              position: "relative",
              zIndex: 1,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: `3px solid ${
                remoteJoined ? "rgba(52,211,153,0.5)" : "rgba(52,211,153,0.2)"
              }`,
              transition: "border 0.5s",
            }}
          >
            {initials}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 600, margin: 0 }}>{name}</p>
          {speciality && <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{speciality}</p>}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "8px 24px",
          }}
        >
          <p
            style={{
              color: remoteJoined ? "#f1f5f9" : "#475569",
              fontSize: 22,
              fontFamily: "monospace",
              letterSpacing: 4,
              margin: 0,
            }}
          >
            {remoteJoined ? formatTime(duration) : "--:--"}
          </p>
        </div>

        {/* Voice activity bars */}
        {remoteJoined && !muted && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 32 }}>
            {[0.3, 0.6, 1, 0.7, 0.4, 0.8, 0.5, 1, 0.6, 0.3].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  borderRadius: 4,
                  background: "#34d399",
                  height: `${h * 100}%`,
                  animation: "bar 1s ease-in-out infinite alternate",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {muted && (
          <p style={{ color: "#ef4444", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
            Muted
          </p>
        )}
        {error && <p style={{ color: "#ef4444", fontSize: 13 }}>Error: {error}</p>}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
        {/* Mute */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button
            onClick={toggleMute}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: muted ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.15)",
              background: muted ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 24,
            }}
          >
            {muted ? "🔇" : "🎤"}
          </button>
          <span style={{ color: "#64748b", fontSize: 12 }}>{muted ? "Unmute" : "Mute"}</span>
        </div>

        {/* End call */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleEnd}
            disabled={ending}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "none",
              background: ending ? "#7f1d1d" : "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: ending ? "not-allowed" : "pointer",
              fontSize: 32,
              boxShadow: "0 8px 32px rgba(239,68,68,0.4)",
              transform: "rotate(135deg)",
            }}
          >
            📞
          </button>
          <span style={{ color: "#64748b", fontSize: 12 }}>{ending ? "Ending..." : "End Call"}</span>
        </div>

        {/* Speaker (UI only) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 24,
            }}
          >
            🔊
          </button>
          <span style={{ color: "#64748b", fontSize: 12 }}>Speaker</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse1 {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes bar {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}