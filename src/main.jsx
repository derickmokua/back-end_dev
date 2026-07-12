import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * JetBrains Mono is brand polish — not needed for first paint.
 * Loading it after `load` / idle keeps the critical path:
 * HTML → JS only (no 20KB woff2 chain on LCP).
 */
function loadBrandFonts() {
  // Only 400 + 700 (drop 500 to cut ~7KB)
  import("@fontsource/jetbrains-mono/latin-400.css");
  import("@fontsource/jetbrains-mono/latin-700.css");
}

function scheduleFontLoad() {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadBrandFonts, { timeout: 2000 });
  } else {
    setTimeout(loadBrandFonts, 1);
  }
}

if (document.readyState === "complete") {
  scheduleFontLoad();
} else {
  window.addEventListener("load", scheduleFontLoad, { once: true });
}
