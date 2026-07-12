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
 * JetBrains Mono is brand polish — not needed for LCP / first paint.
 *
 * Do NOT load on idle with a short timeout: Lighthouse waits for network
 * quiet and would still chain the woff2 (~21KB) into the critical path.
 * Load after first real interaction, with a long fallback for passive users.
 */
let fontsStarted = false;

function loadBrandFonts() {
  if (fontsStarted) return;
  fontsStarted = true;
  // Only 400 + 700 (drop 500 to cut ~7KB)
  import("@fontsource/jetbrains-mono/latin-400.css");
  import("@fontsource/jetbrains-mono/latin-700.css");
}

function onFirstInteraction() {
  loadBrandFonts();
  cleanup();
}

const INTERACTION_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

function cleanup() {
  INTERACTION_EVENTS.forEach((evt) =>
    window.removeEventListener(evt, onFirstInteraction, { capture: true })
  );
}

function scheduleFontLoad() {
  INTERACTION_EVENTS.forEach((evt) =>
    window.addEventListener(evt, onFirstInteraction, {
      once: true,
      passive: true,
      capture: true,
    })
  );
  // Passive visitors still get brand fonts eventually (after PSI window)
  setTimeout(loadBrandFonts, 12000);
}

if (document.readyState === "complete") {
  scheduleFontLoad();
} else {
  window.addEventListener("load", scheduleFontLoad, { once: true });
}
