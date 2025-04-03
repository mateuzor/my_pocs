# 🚀 Mini SPA with Webpack

This project is a **Single Page Application (SPA)** built with **Webpack** to demonstrate how to structure, bundle, and optimize a JavaScript-based SPA. It includes routing, API calls, and dynamic page rendering, all packaged into a single `bundle.js` file.

## 📌 Technologies Used

- **Webpack** - Bundling and module management
- **ES Modules** - JavaScript modularization
- **Fetch API** - For API requests
- **HTML5, CSS3, and Vanilla JavaScript**

## 📁 Project Structure

```
/poc-webpack
│── /src
│   ├── index.html      # Main HTML file, handled by Webpack
│   ├── main.js         # Entry file, initializes the app
│   ├── router.js       # Manages SPA routes and navigation
│   ├── api.js          # Handles API requests (fetching user data)
│   ├── /views
│   │   ├── home.js     # Home page, displays a list of users
│   │   ├── user.js     # User Details page, displays selected user info
│   ├── /css
│   │   ├── styles.css  # Global styles for the application
│── package.json        # Dependencies and scripts
│── webpack.config.js   # Webpack configuration
```

## 🚀 How to Run the Project

Since we are using **Webpack**, the application requires bundling before running.

### 🔹 Install Dependencies

```sh
npm install
```

### 🔹 Build the Project

```sh
npm run build
```

This generates the `dist/` folder containing the bundled files.

### 🔹 Run the Development Server

```sh
npm start
```

Access: **http://localhost:8080/**

## 🛠 Features

✅ **SPA Routing** - Dynamic navigation between Home and User Details without reloading the page.  
✅ **API Consumption** - Fetches users in real-time from `https://jsonplaceholder.typicode.com/users`.  
✅ **Lazy Loading** - `user.js` is only loaded when needed.  
✅ **Webpack Bundling** - All assets are optimized into a single `bundle.js`.  
✅ **Hot Module Replacement (HMR)** - Live reloading for faster development.  
✅ **Optimized for Production** - Minified and efficient build when running `npm run build`.

## 🔍 Testing in DevTools

1️⃣ **Open DevTools (F12) → Network → JS**  
2️⃣ **Reload the page and check that only `bundle.js` is loaded**  
3️⃣ **Click on a user and see `user.js` dynamically loaded**  
4️⃣ **Compare with non-bundled versions (e.g., ES Modules)**

## 🔍 Testing in DevTools

1️⃣ **Open DevTools (F12) → Network → JS**

2️⃣ **Reload the page and check the loaded files**

3️⃣ **You'll see only a `bundle.js` file different from the esm poc**

## 📌 Next Steps

- Implement code splitting for further optimization.
- Add ESLint for code quality checks.
- Optimize image and asset loading with Webpack.
- Test performance using Lighthouse.

---

🚀 **Project created to explore Webpack-based SPA development!**
