import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // Server-defined count value
  const count = 42;

  // Read the HTML template from file
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "views/index.html"),
    "utf-8"
  );

  // Prepare the button HTML with dynamic value
  const buttonHtml = `<button id="counter" data-count="${count}">Count: ${count}</button>`;

  // Replace the placeholder in the template with the generated button
  const finalHtml = htmlTemplate.replace("{{button}}", buttonHtml);

  res.send(finalHtml);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
