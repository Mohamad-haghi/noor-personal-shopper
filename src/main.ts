import "./styles.css";
import "./ui/hero.css";
import "./ui/shopper.css";
import { startApplication } from "./app/bootstrap";

// Capture the opt-in trace marker before lazy-loaded routes can discard the query string.
if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("corTrace") === "1") {
  (window as Window & { __COR_TRACE_REQUESTED__?: boolean }).__COR_TRACE_REQUESTED__ = true;
  try {
    window.sessionStorage.setItem("corTraceRequested", "1");
  } catch {
    // The in-memory marker still covers this page if session storage is unavailable.
  }
}

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Application root element #app was not found.");
}

startApplication(root);
