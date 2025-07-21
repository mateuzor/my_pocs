import path from "path";
import express from "express";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.js";

const app = express();

// Serve static assets (CSS, client bundle, etc.)
app.use(express.static(path.resolve(__dirname, "src")));
app.use("/build", express.static(path.resolve(__dirname, "build")));

// Main route
app.get("/", (req, res) => {
  const start = Date.now();

  // Streaming SSR using renderToPipeableStream
  const { pipe } = renderToPipeableStream(<App />, {
    // Injects the client-side JS bundle for hydration
    bootstrapScripts: ["/build/client.js"],

    // Called when shell (first HTML) is ready to send
    onShellReady() {
      const elapsed = Date.now() - start;
      console.log(`📦 Shell sent after ${elapsed}ms`);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");

      // Start piping the HTML chunks to the client
      pipe(res);
    },

    // Called when all components (even async ones) are flushed
    onAllReady() {
      const elapsed = Date.now() - start;
      console.log(`✅ All chunks sent after ${elapsed}ms`);
    },
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log(`🚀 Server listening on http://localhost:3000`);
});
