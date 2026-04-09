import { useState, useEffect, useRef, useCallback } from 'react';

// useWebSocket encapsulates the full WebSocket lifecycle:
// open → message → close/error → cleanup
// This keeps components free of WebSocket boilerplate.
export function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'open' | 'closed' | 'error'
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus('open');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const text = data.system ? `[system] ${data.message}` : `${data.sender}: ${data.message}`;
      // Use function form to avoid stale closure over messages
      setMessages(prev => [...prev, { id: Date.now(), text }]);
    };

    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('closed');

    // Cleanup: close connection when component unmounts
    return () => ws.close();
  }, [url]);

  // useCallback gives a stable reference so consumers can safely put send in dependency arrays
  const send = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, status, send, clearMessages };
}
