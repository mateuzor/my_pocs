import { Home } from "./views/home.js";
import { User } from "./views/user.js";

const routes = {
  "/": Home,
  "/user/:id": User,
};

// Function to parse the URL and extract parameters
function parsePath(path) {
  const match = path.match(/^\/user\/(\d+)$/);
  return match
    ? { route: "/user/:id", params: match[1] }
    : { route: path, params: null };
}

// Function to navigate to a new route
export async function navigateTo(url) {
  history.pushState(null, null, url);
  await router();
}

// Function to render the correct page
export async function router() {
  const path = window.location.pathname;
  const { route, params } = parsePath(path);

  const view = routes[route];

  if (view) {
    document.getElementById("app").innerHTML = await view(params);
  } else {
    document.getElementById("app").innerHTML = "<h1>404 - Page Not Found</h1>";
  }
}

// Ensure the router runs **immediately** when the page loads
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  // ✅ Force the correct page to render on initial load
  router();
});
