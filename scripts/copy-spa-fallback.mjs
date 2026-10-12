import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const indexPath = resolve("dist/index.html");
const fallbackPath = resolve("dist/404.html");

await copyFile(indexPath, fallbackPath);
console.log("Generated dist/404.html from the built app entry for GitHub Pages direct-route fallback.");
