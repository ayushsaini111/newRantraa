// frontend/src/hooks/useSSE.js
import { useEffect, useRef } from "react";

export function useSSE(url, handlers) {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!url) return;

    let mounted = true;
    let reconnectAttempts = 0;

    function connect() {
      if (!mounted) return;

      console.log("🔌 Connecting SSE:", url);

      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log("✅ SSE connected");
        reconnectAttempts = 0;
      };

      es.onerror = () => {
        console.error("❌ SSE error");
        es.close();

        if (mounted && reconnectAttempts < 10) { // ✅ Max 10 attempts
          reconnectAttempts++;
          const delay = Math.min(3000 * reconnectAttempts, 30000);
          console.log(`🔄 Reconnecting in ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      Object.entries(handlersRef.current).forEach(([event, handler]) => {
        es.addEventListener(event, (e) => {
          try {
            const data = JSON.parse(e.data);
            console.log(`📨 SSE: ${event}`, data);
            handler(data);
          } catch (err) {
            console.error(`Parse SSE ${event} error:`, err);
          }
        });
      });
    }

    connect();

    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [url]);
}