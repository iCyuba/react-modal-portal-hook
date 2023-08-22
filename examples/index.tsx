import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

createRoot(root).render(<App />);
