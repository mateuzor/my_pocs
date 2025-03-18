import { router } from "./router.js"; // Import the SPA router
import "./css/styles.css"; // Webpack loads CSS dynamically

// Ensure the router runs on page load
document.addEventListener("DOMContentLoaded", () => {
  router(); // Initializes the app and loads the correct page
});
