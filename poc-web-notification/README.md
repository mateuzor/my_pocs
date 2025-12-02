# ✨ **poc-web-notifications**

### A minimal, modern, vanilla JavaScript Proof of Concept using the **Web Notifications API**

---

## 📌 **What this project is**

A small PoC built with:

* **HTML + CSS**
* ** JavaScript**
* **ES Modules (`import/export`)**
* A custom **hook-like helper** → `useNotifications()`

Purpose:
* 👉 Understand how browser notifications work
* 👉 Practice modular JS design
* 👉 Build step-by-step commits (good for PR history)

---

## 🔔 **What the Web Notifications API does**

The Web Notifications API lets a website display **system-level notifications**, even when the tab is unfocused.

You can:

* Ask permission from the user
* Show a notification
* Customize title & body
* Integrate with OS-level alert systems (macOS, Windows)

---

## ⭐ **Features implemented in this PoC**

* Detect whether Notifications API is supported
* Show current permission (`default`, `granted`, `denied`)
* Request permission through a button
* Send a test notification with custom:

  * **title**
  * **body**
* Status area that explains every step
* Clean code separated into:

  * `main.js` → UI logic
  * `notifications.js` → hook-like logic

---

## 🧩 **Project structure**

```
index.html
styles.css
scripts/
  ├─ main.js
  └─ notifications.js
```

---

## 🪝 **The hook: useNotifications()**

Encapsulates:

* `isSupported()`
* `getPermission()`
* `canNotify()`
* `requestPermission()`
* `sendNotification()`
* `setStatus()`

This keeps UI clean and makes the logic reusable.

---

## 🚀 **How to run**

1. Open a local server (necessary for browser permission flow):

   Using VSCode **Live Server**, or:

   ```bash
   npx serve .
   ```

2. Open the URL (usually `http://localhost:3000`)

> Avoid opening via `file://`, because the Notifications API behaves differently.

---

## 🧪 **How to test the PoC**

### **1. Open the page**

You should see:

* Support message
* Current permission status

### **2. Click “Check support”**

It confirms:

* Whether Notifications API exists
* Current permission

### **3. Click “Request permission”**

Browser will prompt:

* **Allow**
* **Block**
* or ignore (stays as `default`)

### **4. Send a notification**

Fill title & body → press **Notify**

You should see:

* macOS → banner in top-right
* Windows → toast near bottom-right

### **5. Observe status updates**

Every action updates the status text at the top.

---

## 🧭 **What to look for**

* How the permission changes over time
* How the UI enables/disables buttons
* Behavior differences between OSes
* How the notification appears when:

  * Tab is active
  * Tab is hidden

---

## ⚠️ **Troubleshooting**

### **Notification permission is granted, but no banner appears**

Common macOS reasons:

* Chrome is **not allowed** in System Settings
* Focus Mode / Do Not Disturb ON
* **Screen recording** hides all banners
* Chrome notifications set to “None”

Fix:

**System Settings → Notifications → Google Chrome**

Enable:

* Allow notifications
* Alerts/banners
* Time-sensitive notifications (optional)

---

### **Permission always denied**

You may have blocked the site earlier.

Reset via Chrome:

```
chrome://settings/content/notifications
```

---

## 🎯 **Real-world use cases**

* Reminder apps
* Build/CI dashboards
* Chat/messaging notifications
* Meeting timers
* Page visibility analytics
* Basic scheduling (“notify me in 5 minutes”)

---
