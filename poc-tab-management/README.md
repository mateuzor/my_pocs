# 🚀 Tab Management System with Drag & Drop (HTML5 APIs)

This project demonstrates how to create a **fully interactive tab system** that allows users to **add, remove, and reorder tabs dynamically** using **HTML5 Drag & Drop API**, without external dependencies.

## 📌 Features

✅ **Dynamic tab creation & deletion**  
✅ **Drag & Drop reordering using HTML5 API**  
✅ **State persistence with `localStorage`**  
✅ **Fully interactive tab system**  
✅ **No external dependencies (pure HTML, CSS, and JavaScript)**

---

## 📁 Project Structure

```
/poc-tab-management
│── /src
│   │── index.html       # Main UI for tab system
│   │── tabs.js          # JavaScript for tab functionality
│   │── styles.css       # Basic styling for tabs
│── README.md            # Documentation
```

---

## 🚀 How to Run the Project

Simply open `index.html` in a browser—**no server required!** 🎯

---

## 🔍 How It Works

### **1️⃣ Dynamic Tab System**

- Users can **add new tabs** dynamically by clicking the **"➕ Add Tab"** button.
- Clicking on a tab **activates** it and displays the corresponding content.
- Clicking the ❌ button **removes** the tab.
- The tab state is **saved in `localStorage`**, so tabs persist after refresh.

### **2️⃣ Drag & Drop Reordering**

- Tabs can be **dragged and reordered** using the **HTML5 Drag API**.
- Dragging a tab highlights its movement and updates its position dynamically.
- New tab order is **saved in `localStorage`**, maintaining order after reload.

---

## 🛠 Key Code Implementations

✅ The **tab list** is dynamically populated.

✅ The "Add Tab" button creates **new tabs** on click.

✅ **Drag & Drop events** allow tabs to be reordered.

✅ **Tabs are created dynamically** and stored in `localStorage`.

✅ **Clicking a tab updates the active state**.

✅ **Close button (`❌`) removes tabs and updates storage**.

✅ Implements **Drag & Drop for reordering** tabs.

✅ Stores new **tab order in `localStorage`**.

---

## 📌 Next Steps

1️⃣ Enhance Drag & Drop animations for smoother movement.

2️⃣ Allow renaming of tabs for customization.

3️⃣ Expand tab content functionality (e.g., text editors, embedded components).

---

🚀 **Project created to explore interactive UI components with HTML5 APIs!**
