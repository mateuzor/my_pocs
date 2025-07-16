import React from "react";
import path from "path";
import express from "express";
import { renderToNodeStream } from "react-dom/server";

import App from "./App";

const app = express();

app.get("/favicon.ico", (req, res) => res.end());

app.use("/client.js", (req, res) => res.redirect("/build/client.js"));

app.use(express.static(path.join(__dirname, "src")));

// Simulate server latency to demonstrate streaming effect more clearly
const DELAY = 500;
app.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, DELAY);
});

// HTML shell to be sent before React rendering begins
const BEFORE = `
<!DOCTYPE html>
  <html>
    <head>
      <title>Cat Facts</title>
      <link rel="stylesheet" href="/style.css">
      <script type="module" defer src="/build/client.js"></script>
    </head>
    <body>
      <h1>Stream Rendered Cat Facts!</h1>
      <div id="approot">
`.replace(/\n\s*/g, "");

// Main route
app.get("/", async (request, response) => {
  try {
    const stream = renderToNodeStream(<App />);
    const start = Date.now(); // Capture start time

    // Wait for the first chunk to begin measuring actual rendering start
    stream.on("data", function handleData() {
      console.log("Render Start: ", Date.now() - start);

      // Remove listener after first data chunk
      stream.off("data", handleData);

      // Enable chunked transfer
      response.useChunkedEncodingByDefault = true;

      // Send custom headers
      response.writeHead(200, {
        "content-type": "text/html",
        "content-transfer-encoding": "chunked",
        "x-content-type-options": "nosniff",
      });

      // Write the initial HTML shell
      response.write(BEFORE);

      // Flush headers and body shell immediately to the client
      response.flushHeaders();
    });

    // Await the full stream and handle completion or error
    await new Promise((resolve, reject) => {
      stream.on("error", (err) => {
        // Stop piping and return error
        stream.unpipe(response);
        reject(err);
      });

      stream.on("end", () => {
        console.log("Render End: ", Date.now() - start); // Log end of rendering

        // Finish HTML structure
        response.write("</div></body></html>");
        response.end();
        resolve();
      });

      // Start streaming rendered content to client
      stream.pipe(response, { end: false });
    });
  } catch (err) {
    response.writeHead(500, {
      "content-type": "text/plain",
    });
    response.end(String((err && err.stack) || err));
    return;
  }
});

app.use(express.static(path.resolve(__dirname, "src")));
app.use("/build", express.static(path.resolve(__dirname, "build")));

// Starts our server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
