# 🚀 Mini SPA with ES Modules (No Bundler)

This project is a **minimalist Single Page Application (SPA)** built solely with **native ES Modules**, without using Webpack, Vite, or any other bundler. It demonstrates how to create a modern SPA with routing, API calls, and Lazy Loading, running directly in the browser.

## 📌 Technologies Used

- **ES Modules (native import/export)**
- **Fetch API** for HTTP requests
- **Local Storage** for data persistence
- **HTML5, CSS3, and Vanilla JavaScript**

## 📁 Project Structure

```
/esm-spa
│── /js
│   ├── main.js        # Main entry file
│   ├── router.js      # Manages SPA routes
│   ├── api.js         # Handles API requests
│   ├── views
│   │   ├── home.js    # Home page (User List)
│   │   ├── user.js    # User Details page
│── /css
│   ├── styles.css     # Global styles
│── index.html         # Main HTML file
```

## 🚀 How to Run the Project

Since we are using **ES Modules**, the browser requires a local server to run.

### 🔹 Node.js (http-server)

```sh
npx http-server .
```

Access: **http://localhost:8080/**

## 🛠 Features

✅ **SPA Routing** - Dynamic navigation between Home and User Details without reloading the page.  
✅ **API Consumption** - Fetches users in real-time from `https://jsonplaceholder.typicode.com/users`.  
✅ **Lazy Loading** - `user.js` is only loaded when needed.  
✅ **Local Storage** - Stores recently visited users for display on the Home page.  
✅ **Animations** - Smooth page transitions using CSS.

## 🔍 Testing in DevTools

1️⃣ **Open DevTools (F12) → Network → JS**

2️⃣ **Reload the page and check the loaded files**

3️⃣ **Click on a user and see `user.js` load on demand**

4️⃣ **Compare with Webpack/Vite/Parcel and any other bundlers**

## 📌 Next Steps

- Improve UX with advanced animations.
- Optimize image and style loading.
- Test performance with Lighthouse.

---

🚀 **Project created to explore ES Modules without bundlers!**
