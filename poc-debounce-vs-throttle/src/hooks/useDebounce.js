import { useState, useEffect } from 'react';

// useDebounce returns a delayed copy of the value.
// The returned value only updates after the user has stopped changing it for `delay` ms.
// Prevents expensive operations (API calls, filtering) from running on every keystroke.
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cancel the previous timer if value changes before the delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
