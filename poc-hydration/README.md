# 🧪 Manual Hydration - No Framework

This project demonstrates the concept of **hydration** in the frontend without using any framework. I implemented a simple **Server-Side Rendering (SSR)** example with **manual hydration** using only **Node.js**, **Express**, and **plain JavaScript**.

---

## 🧠 What is Hydration?

**Hydration** is the process of **activating static HTML** rendered on the server with interactive functionality in the browser.

> In other words, it's when JavaScript loads in the browser and connects server-rendered DOM elements with interactivity (event listeners, state, etc).

### Practical Example:

- The server sends HTML with a button: `Count: 0`
- The browser displays it immediately (no JS needed)
- JavaScript is loaded and adds the click behavior
- Now the button works: `Count: 1`, `Count: 2`, etc.

That's the classic hydration cycle.

---

## 🗂 Project Structure

```
hydration-manual/
├── public/
│   └── script.js         # Client-side JS that hydrates the DOM
├── views/
│   └── index.html        # HTML template with placeholder
├── server.js             # Node/Express server with SSR
```

---

## 🚀 How to Run the Project

1. Install the dependencies (only express):

```bash
npm install
```

2. Start the server:

```bash
node server.js
```

3. Open your browser at:

```
http://localhost:3000
```

---

## 🔍 How It Works

### `server.js`

- Reads the `index.html` file
- Replaces the `{{button}}` placeholder with a button with dynamic value (e.g. 42)
- Sends the full HTML to the browser

### `script.js`

- Runs in the browser after `DOMContentLoaded`
- Selects the button from the DOM
- Reads the initial value from the `data-count` attribute
- Adds an `addEventListener` to make the button interactive

---

## ✅ Testing the Hydration

1. **Disable JavaScript** in your browser (DevTools > Settings > Disable JavaScript)
2. Refresh the page
3. The button still shows up (thanks to SSR), but is not clickable (no hydration)
4. Re-enable JS and see it work again

---

## 📘 Conclusion

In this project you learned:

- What hydration is and why it matters
- How to render HTML on the server (SSR)
- How to apply interactivity after the page loads
- How to do all of this without any frameworks, to deeply understand the process

This is an excellent foundation for understanding how modern frameworks work "under the hood".

---

To go further, try implementing:

- Hydrated inputs and forms
- Partial hydration strategies
- State saving with `localStorage`

---
