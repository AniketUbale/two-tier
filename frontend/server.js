const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.WEB_PORT || 3000;
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function resolveFile(urlPath) {
  if (urlPath === "/") {
    return path.join(publicDir, "index.html");
  }

  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(publicDir, safePath);
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});
