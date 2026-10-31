import https from "node:https";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve("dist");
const prefix = "/noor-personal-shopper";
const host = "0.0.0.0";
const port = Number(process.env.PORT ?? 443);
const keyPath = process.env.HTTPS_KEY_PATH;
const certPath = process.env.HTTPS_CERT_PATH;
if (!keyPath || !certPath) throw new Error("isolated_preview_tls_paths_required");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = https.createServer({
  key: await readFile(keyPath),
  cert: await readFile(certPath),
}, async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "https://mohamad-haghi.github.io");
    if (url.pathname !== prefix && !url.pathname.startsWith(prefix + "/")) {
      response.writeHead(404).end("not_found");
      return;
    }
    const relative = decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\/+/, "");
    let target = path.resolve(root, relative || "index.html");
    if (target !== root && !target.startsWith(root + path.sep)) {
      response.writeHead(400).end("invalid_path");
      return;
    }
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target, "index.html");
    } catch {
      target = path.join(root, "index.html");
    }
    const body = await readFile(target);
    response.writeHead(200, {
      "content-type": mime[path.extname(target)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(500).end("isolated_preview_error");
  }
});

server.listen(port, host, () => {
  process.stdout.write(JSON.stringify({ status: "ready", host, port, root, prefix }) + "\n");
});
