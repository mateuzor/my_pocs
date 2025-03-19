# 🚀 Accessible Modal Component (No Dependencies)

This project demonstrates how to build a **fully accessible modal** using only **HTML, CSS, and JavaScript**, without relying on external libraries.

## 📌 Why Accessibility Matters

A truly accessible modal should:

✅ **Be keyboard navigable** (open/close using `Tab`, `Enter`, `Escape`).  
✅ **Trap focus inside the modal** (so users don’t navigate outside while it's open).  
✅ **Announce itself to screen readers** using `aria-*` attributes.  
✅ **Close when clicking outside** or pressing `Esc`.  
✅ **Be fully functional without JavaScript** (fallback mechanism).

### **🔍 ARIA Attributes in the Modal**

This modal implements ARIA attributes to enhance accessibility:

- **`role="dialog"`** → Identifies the modal as a dialog for screen readers.
- **`aria-labelledby="modal-title"`** → Ensures the modal title is read when opened.
- **`aria-hidden="true"`** → Hides the modal from assistive technologies when closed.
- **`aria-haspopup="dialog"`** → Indicates that the button triggers a modal.

With these attributes, screen readers can **announce the modal correctly**, ensuring a better experience for visually impaired users.

---

## 📁 Project Structure

```
/poc-accessible-modal
│── /src
│   │── index.html      # Main page with a button to open the modal
│   │── modal.js        # JavaScript for modal functionality
│   │── styles.css      # Basic styling for the modal
│── README.md           # Documentation
```

---

## 🚀 How to Run the Project

Simply open `index.html` in a browser—**no server required!** 🎯

---

## 🛠 Features

✅ **ARIA attributes** for screen reader support.  
✅ **Keyboard support** (`Tab`, `Enter`, `Esc` for full accessibility).  
✅ **Focus management** (focus moves inside the modal and returns to the button on close).  
✅ **Click outside the modal to close it**.  
✅ **Lightweight and dependency-free**.

---

## 📌 Next Steps

1️⃣ **Add animations** for a smoother open/close experience.  
2️⃣ **Implement focus trapping** (prevent tabbing outside the modal).  
3️⃣ **Improve styling for better UI/UX.**

---

🚀 **Project created to explore accessible UI components without dependencies!**
