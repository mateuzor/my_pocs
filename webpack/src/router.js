import { Home } from "./views/home.js";
import { User } from "./views/user.js";

// Define the routes and their corresponding components
const routes = {
  "/": Home, // Home Page
  "/user/:id": User, // User Details Page (Dynamic ID)
};

// Function to extract parameters from the URL (e.g., /user/1)
function parsePath(path) {
  const match = path.match(/^\/user\/(\d+)$/);
  return match
    ? { route: "/user/:id", params: match[1] }
    : { route: path, params: null };
}

// Handles navigation between pages without reloading
export async function navigateTo(url) {
  history.pushState(null, null, url); // Updates the browser URL
  await router(); // Re-renders the page content
}

// Main function that loads the correct page dynamically
export async function router() {
  const path = window.location.pathname;
  const { route, params } = parsePath(path); // Parse dynamic parameters

  const view = routes[route];

  if (view) {
    document.getElementById("app").innerHTML = await view(params);
  } else {
    document.getElementById("app").innerHTML = "<h1>404 - Page Not Found</h1>";
  }
}

// Ensure the correct page loads when using back/forward browser buttons
window.addEventListener("popstate", router);

// Attach event listeners for SPA navigation (prevents full-page reload)
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router(); // Load the correct page initially
});
