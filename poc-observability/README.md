# POC - Frontend Observability with Sentry, Web Vitals, LogRocket & Microsoft Clarity

This project is a comprehensive Proof of Concept that showcases how to implement observability in a modern React application using the following tools:

- **Sentry**: Error tracking and performance monitoring
- **Web Vitals**: Collecting user-centric performance metrics
- **LogRocket**: Session replay, logs, and UX diagnostics
- **Microsoft Clarity**: Heatmaps and user behavior analysis

---

## 🧠 What is Observability?

Observability is the ability to monitor, detect, and understand the internal state of a system based on its external outputs. In front-end development, it means having visibility into errors, performance issues, and user interactions in real-time.

### Observability vs Monitoring

- **Monitoring**: Alerts you when something goes wrong
- **Observability**: Helps you understand _why_ it's going wrong

### The Three Pillars of Observability

1. **Logs** – raw text records of system events
2. **Metrics** – numerical data over time (e.g. load times)
3. **Traces** – following the flow of a request across systems

### Why Observability Matters in Front-End

- JavaScript errors often go unnoticed
- Devices and networks vary between users
- Browsers are black boxes without instrumentation

### Key Front-End Observability Data Sources

- Console logs
- JavaScript error stack traces
- Web performance APIs
- User interaction tracking

---

## 🔧 Technologies Used

| Tool                  | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| **Sentry**            | Error tracking, performance tracing                   |
| **Web Vitals**        | Core performance metrics (LCP, FID, CLS, TTFB, INP)   |
| **LogRocket**         | Session replay, error reproduction, network, and logs |
| **Microsoft Clarity** | Heatmaps, session recordings, user behavior tracking  |

---

## 🚀 Learning Path & Concepts Covered

### 1. Error Monitoring in Production

- Using `window.onerror`, `window.onunhandledrejection`
- Custom `ErrorBoundary` in React
- Capture errors with Sentry/Bugsnag/LogRocket

### 2. Session Replays

- Visualize exactly what users experienced when a bug happened
- Tools: LogRocket, FullStory, Smartlook

### 3. Real User Monitoring (RUM)

- Track metrics like LCP, FID, CLS, INP using Web Vitals
- Tools: Web Vitals library, Sentry Performance, Datadog RUM

### 4. Transaction Tracing

- Follow user interaction → network request → backend result
- Tools: Sentry Performance, Datadog

### 5. Frontend-to-Backend Log Correlation

- Match session IDs, trace IDs across systems
- Structured logging for cross-system analysis

### 6. Heatmaps and UX Insights

- Visual maps of user interactions
- Tools: Hotjar, Microsoft Clarity

---

## 📦 Setup

1. Clone this repository:

```bash
git clone <url>
cd poc-observability
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
SENTRY_DSN=your-sentry-dsn
LOGROCKET_ID=your-logrocket-id
CLARITY_ID=your-clarity-id
```

4. Start the project:

```bash
npm start
```

5. Visit [http://localhost:3003](http://localhost:3003) and interact with the app

---

## 🧪 How to Test

| Tool           | How to Trigger                 | Where to Check                      |
| -------------- | ------------------------------ | ----------------------------------- |
| **Sentry**     | Click `Trigger Error` button   | Sentry → Project → Issues           |
| **Web Vitals** | Load app, interact             | Sentry → Project → Logs/Performance |
| **LogRocket**  | Click, scroll, reload page     | LogRocket → Dashboard → Sessions    |
| **Clarity**    | Clicks, scrolling, idle on app | Clarity → Recordings / Heatmaps     |

---

## 📈 Metrics Tracked

### Web Vitals

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP)
- Time To First Byte (TTFB)

### Sentry

- JavaScript runtime errors
- Stack traces and environment details
- Performance tracing
- Web Vitals as logs

### LogRocket

- Session recordings
- Console logs
- Network requests
- Redux/UI state
- Clicks & navigation

### Clarity

- Click heatmaps
- Scroll depth
- Session replays
- Rage click detection

---

## 📊 Pros & Cons

| Tool           | Pros                                                | Cons                                           |
| -------------- | --------------------------------------------------- | ---------------------------------------------- |
| **Sentry**     | Fast setup, detailed error context, tracing support | Free tier limited to 5k events/mo              |
| **LogRocket**  | Replay + logs in one place, great for debugging UX  | Free tier has 1k sessions/mo                   |
| **Clarity**    | 100% free, automatic heatmaps, simple integration   | Small delay for data, no custom event tracking |
| **Web Vitals** | Official metrics, reflects real user experience     | Requires custom integration with backend/tool  |

---

## 📝 Screenshots & Recordings

- [ ] Screenshot of Sentry capturing a JS error
- [ ] Video of LogRocket session with stack trace
- [ ] Screenshot of Clarity heatmap & replay

---

## ✅ Future Enhancements

- Add ErrorBoundary for smoother UX
- Correlate LogRocket sessions in Sentry via `LogRocket.getSessionURL()`
- Export metrics to dashboards (Grafana, Datadog, etc.)
- Add funnel tracking, A/B testing, and user events

> This POC helps us achieve deep visibility into our front-end application behavior and performance. By combining these tools, we're equipped to debug, measure, and improve the user experience in production. 🚀
