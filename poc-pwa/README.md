# 🚀 POC 7: Progressive Web App (PWA) - Offline & Notifications

This project demonstrates how to build a **Progressive Web App (PWA)** using only **HTML, CSS, and JavaScript**. It includes offline support via **Service Worker**, installation capability, and simulated **push notifications**.

---

## 📌 What is a PWA?

A **Progressive Web App** combines the best of web and native apps:

- ✅ Installable on desktop/mobile
- ✅ Works offline using Cache API + Service Worker
- ✅ Loads fast and works reliably in poor networks
- ✅ Can send native-like push notifications

---

## 📁 Project Structure

```
/poc-pwa-fixed
│── /src
│   ├── index.html           # Main entry file
│   ├── app.js               # JavaScript logic and notification handling
│   ├── service-worker.js    # Handles offline caching
│   ├── manifest.json        # PWA manifest file
│   ├── styles.css           # Basic styling
│   └── /icons               # App icons (192x192 and 512x512)
```

---

## 🚀 How to Run Locally

1. Open a terminal in the `src/` folder:

```bash
npx http-server -p 3000
```

2. Open in browser: [http://localhost:3000](http://localhost:3000)

3. You should see:
   - App loads with "Online" status
   - Button: "Send Notification"
   - Option to install the app (in address bar)

---

## 🧪 Features to Test

### ✅ Installation

- Click on the browser's install icon
- The app will open in standalone window (like a native app)

### ✅ Offline Support

- Load the app once
- Turn off Wi-Fi
- Refresh the page → App still works!

### ✅ Push Notification Simulation

- Click "Send Notification"
- If permission is granted, a native notification will appear
- Works both in browser and in installed PWA (if OS allows it)

---

## 🛠 Under the Hood

### Service Worker (service-worker.js)

- Caches core files during `install`
- Serves cached files on `fetch`
- Cleans up old caches on `activate`

### Manifest (manifest.json)

- Declares icons, colors, name, and start URL
- Enables installation on devices

### JavaScript (app.js)

- Detects online/offline status
- Handles permission requests for notifications
- Sends notifications via `showNotification` from the Service Worker

---

## ✅ Next Steps

- Add IndexedDB for local data persistence
- Handle dynamic caching of API data
- Integrate real push notifications with Firebase
- Add UX enhancements (custom install banners, loading indicators, etc.)

---
