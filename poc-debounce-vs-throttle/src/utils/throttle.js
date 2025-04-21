// Throttle implementation with detailed explanation
export default function throttle(fn, limit) {
  let lastCall = 0;

  // Return a new function that wraps the original one
  return (...args) => {
    const now = Date.now();

    // Only call the function if enough time has passed since the last call
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}
