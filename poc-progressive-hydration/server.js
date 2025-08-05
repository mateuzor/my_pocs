import express from "express";
import React from "react";
import reactDomServer from "react-dom/server";
const { renderToPipeableStream } = reactDomServer;

import fs from "fs"; // File system access
import path from "path"; // Path utilities
import { fileURLToPath } from "url"; // Convert module URL to path

// Import the main App component (server-rendered)
import App from "./src/App.cjs";

// Convert module URL to __dirname (needed when using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Serve static assets from the 'public' folder (e.g., JS bundles)
app.use(express.static(path.join(__dirname, "public")));

// Handle GET requests to the root path
app.get("/", (req, res) => {
  // Set HTML response header
  res.setHeader("Content-Type", "text/html");

  // Read the base HTML template and split it at the hydration point
  const html = fs.readFileSync("./views/template.html", "utf8");
  const [htmlStart, htmlEnd] = html.split("<!-- APP -->");

  // Send the first part of HTML immediately
  res.write(htmlStart);

  // Stream the React component into the response using React 18 streaming API
  const stream = renderToPipeableStream(React.createElement(App), {
    // When the HTML shell is ready (enough to paint), pipe it to response
    onShellReady() {
      stream.pipe(res); // Send React content
      res.write(htmlEnd); // Finish with closing HTML
    },

    // Handle any rendering errors
    onError(err) {
      console.error("React render error:", err);
    },
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
