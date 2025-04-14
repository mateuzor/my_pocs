import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import Sentry for error tracking and performance monitoring
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Import function to collect Web Vitals metrics
import reportWebVitals from "./reportWebVitals";

// Import LogRocket for session replay and frontend analytics
import LogRocket from "logrocket";

// Initialize Sentry with your project configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

// Initialize LogRocket with your project ID
LogRocket.init(process.env.LOGROCKET_ID);

// Register the root React component to the DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Send Web Vitals metrics to Sentry for performance analysis
reportWebVitals((metric) => {
  Sentry.captureMessage(`[Web Vitals] ${metric.name}: ${metric.value}`, {
    level: "info",
    tags: { metric: metric.name },
    extra: metric,
  });
});
