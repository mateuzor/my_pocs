# ♿️ POC 10: Accessible Progress Bar with Dynamic Loading

This POC demonstrates how to build a **fully accessible progress bar component** using pure HTML, CSS, and JavaScript. It updates dynamically and follows accessibility best practices using `aria-*` attributes.

---

## 📁 Project Structure

```
/poc-progress-bar
│── /src
│   ├── index.html        # UI structure for progress bar
│   ├── app.js            # JavaScript for dynamic progress simulation
│   ├── styles.css        # Styles for progress bar container and animation
│   └── README.md         # Documentation
```

---

## 🚀 How to Run

1. Open a terminal in the `src/` folder:
```bash
npx http-server -p 3000
```

2. Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Accessibility Features

- `role="progressbar"`: Identifies the component as a progress bar for screen readers
- `aria-valuemin="0"` and `aria-valuemax="100"`: Define the value range
- `aria-valuenow`: Updated dynamically to reflect current progress

These attributes make the component accessible to assistive technologies.

---

## 🧠 JavaScript Behavior

The progress bar is updated incrementally (1% every 50ms):

```js
value++;
bar.style.width = value + "%";
bar.setAttribute("aria-valuenow", value);
text.textContent = value + "%";
```

This simulates a loading scenario, updating both visual and accessible states.

---

## 💡 Ideas for Expansion

- Add `aria-live="polite"` for smoother screen reader updates
- Add a cancel button or pause/resume functionality
- Integrate with real file uploads or async tasks

---

🔧 Created as part of the Frontend POC series focused on accessibility and usability.
