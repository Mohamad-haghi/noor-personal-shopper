import "./styles.css";
import { startApplication } from "./app/bootstrap";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Application root element #app was not found.");
}

startApplication(root);
