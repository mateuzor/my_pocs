import { useState, useEffect, useRef, useCallback } from 'react';

// Reconnection with exponential backoff:
// Each failed attempt waits longer before retrying: 1s, 2s, 4s, 8s... up to 30s.
// Avoids hammering the server when it is down.
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30_000;
const MAX_RETRIES = 6;

export function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const wsRef = useRef(null);
  const retryTimerRef = useRef(null);
  // Track if the hook is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    setStatus('connecting');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setStatus('open');
      setRetryCount(0); // reset counter on successful connection
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
      const data = JSON.parse(event.data);
      const text = data.system ? `[system] ${data.message}` : `${data.sender}: ${data.message}`;
      setMessages(prev => [...prev, { id: Date.now(), text }]);
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setStatus('error');
    };

    ws.onclose = (event) => {
      if (!mountedRef.current) return;
      setStatus('closed');
      // Code 1000 = intentional normal close — do not reconnect
      if (event.code === 1000) return;

      setRetryCount(prev => {
        if (prev >= MAX_RETRIES) return prev;
        // Exponential backoff: delay doubles on each retry
        const delay = Math.min(BASE_DELAY_MS * 2 ** prev, MAX_DELAY_MS);
        retryTimerRef.current = setTimeout(connect, delay);
        return prev + 1;
      });
    };
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearTimeout(retryTimerRef.current);
      wsRef.current?.close(1000); // intentional close — suppresses auto-reconnect
    };
  }, [connect]);

  const send = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, status, retryCount, send, clearMessages };
}
