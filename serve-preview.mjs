import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : (req.url || "/index.html");
  const safePath = normalize(join(root, urlPath));

  if (!safePath.startsWith(root) || !existsSync(safePath) || statSync(safePath).isDirectory()) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  const ext = extname(safePath);
  res.setHeader("Content-Type", types[ext] || "application/octet-stream");
  res.end(readFileSync(safePath));
}).listen(4173, "127.0.0.1", () => {
  console.log("Static server running on http://127.0.0.1:4173");
});
