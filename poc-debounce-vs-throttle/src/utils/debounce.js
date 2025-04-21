// Debounce implementation with detailed explanation
export default function debounce(fn, delay) {
  let timeout;

  // Return a new function that wraps the original one
  return (...args) => {
    // Clear the previous timeout if the function is called again within the delay
    clearTimeout(timeout);

    // Set a new timeout to call the function after the delay
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
