// Import specific functions from the web-vitals library
// Each function collects a different performance metric from real user data
import { onCLS, onFID, onLCP, onTTFB, onINP } from "web-vitals";

// This function captures the metrics as soon as they are available
// 'onPerfEntry' is a callback function passed from the main application (e.g., index.js)
const reportWebVitals = (onPerfEntry) => {
  // Ensure the provided callback is valid
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Register each web-vital metric with the callback
    onCLS(onPerfEntry); // Cumulative Layout Shift
    onFID(onPerfEntry); // First Input Delay
    onLCP(onPerfEntry); // Largest Contentful Paint
    onTTFB(onPerfEntry); // Time To First Byte
    onINP(onPerfEntry); // Interaction to Next Paint
  }
};

// Export the function so it can be imported and used elsewhere (e.g., in index.js)
export default reportWebVitals;
