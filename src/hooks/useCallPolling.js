// frontend/src/hooks/useCallPolling.js

import { useEffect, useRef } from "react";

export function useCallPolling(requestedCalls, userId, onIncomingCall) {
  const pollingRef = useRef(null);

  useEffect(() => {
    const callIds = Object.values(requestedCalls);
    
    if (callIds.length === 0) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    console.log("🔄 Starting call polling for:", callIds);

    // Poll every 2 seconds
    pollingRef.current = setInterval(async () => {
      for (const callId of callIds) {
        try {
          const res = await fetch(`https://astro-nine-beige.vercel.app/call/status?callId=${callId}`, {
            headers: {
              "x-user-id": userId || "",
            },
          });
          
          if (!res.ok) {
            console.error("Poll failed:", res.status);
            continue;
          }

          const data = await res.json();
          console.log("📊 Poll result:", data);

          // Pandit accepted!
          if (data.status === "RINGING" && data.userToken) {
            console.log("✅ Call accepted (via polling)!");
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            
            onIncomingCall({
              id: data.callId,
              channelName: data.channelName,
              token: data.userToken,
              uid: data.userUid,
              appId: data.appId,
              pandit: data.pandit,
              isFreeCall: data.isFreeCall,
              planSecondsLeft: data.planSecondsLeft,
            });
            
            break;
          }

          // Call failed/rejected
          if (data.status === "FAILED" || data.status === "COMPLETED") {
            console.log("❌ Call ended:", data.status);
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            break;
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }
    }, 2000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [requestedCalls, userId, onIncomingCall]);
}