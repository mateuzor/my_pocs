const chokidar = require("chokidar");
const { exec } = require("child_process");
const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");

// Serve the static files from the dist directory
app.use(express.static(distPath));

// Route for serving the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Watch for file changes in the src directory
const watcher = chokidar.watch(path.join(__dirname, "src"));

watcher.on("change", () => {
  console.log("HTML file changed. Reloading...");
  exec("npm run build", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
    io.emit("reload");
  });
});

// Start the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// Set up Socket.IO
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Client connected.");

  socket.on("disconnect", () => {
    console.log("Client disconnected.");
  });
});
