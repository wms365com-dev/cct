const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 3000;
const root = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache"
  });
  res.end(body);
}

function safePath(urlPath) {
  const trimmed = urlPath.split("?")[0];
  const normalized = path.normalize(trimmed === "/" ? "/index.html" : trimmed);
  const resolved = path.resolve(root, `.${normalized}`);
  if (!resolved.startsWith(root)) {
    return null;
  }
  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || "/");

  if (!filePath) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        send(res, 404, "Not found", "text/plain; charset=utf-8");
        return;
      }
      send(res, 500, "Server error", "text/plain; charset=utf-8");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    send(res, 200, data, type);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Maple Mentor listening on port ${port}`);
});
