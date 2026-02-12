import { useState, useEffect, useDebugValue } from 'react';

// Custom hook that uses useDebugValue for better DevTools experience
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // useDebugValue shows this label in React DevTools
  // Makes debugging easier by showing readable status
  useDebugValue(isOnline ? 'Online' : 'Offline');

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Custom hook with formatted debug value
export function useUser(userId: number) {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // useDebugValue with formatter function (only called when DevTools is open)
  useDebugValue(user, (u) =>
    u ? `User: ${u.name} (ID: ${u.id})` : 'No user loaded'
  );

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ id: userId, name: `User ${userId}` });
      setLoading(false);
    }, 1000);
  }, [userId]);

  return { user, loading };
}
