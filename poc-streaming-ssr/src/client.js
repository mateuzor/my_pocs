import { hydrateRoot } from "react-dom/client";
import React from "react";
import App from "./App";

hydrateRoot(document.getElementById("approot"), <App />);
