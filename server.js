const http = require("http");
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV ||= "development";
process.env.AUTH_SECRET ||= "local-development-secret-change-before-production";
process.env.CCO_EMAIL ||= "luiza.gomes@mroativa.com.br";
process.env.CCO_PASSWORD ||= "senhamro";
process.env.CCO_NAME ||= "Luiza Gomes";

const apiHandler = require("./api/index");
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".png": "image/png", ".json": "application/json; charset=utf-8"
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > 4.2 * 1024 * 1024) {
        reject(new Error("Requisição muito grande."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new Error("JSON inválido.")); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (requestUrl.pathname === "/api" || requestUrl.pathname === "/api/") {
    try {
      req.query = Object.fromEntries(requestUrl.searchParams);
      req.body = ["POST", "PUT", "PATCH"].includes(req.method) ? await readBody(req) : {};
      res.status = function status(code) { this.statusCode = code; return this; };
      await apiHandler(req, res);
    } catch (error) {
      if (!res.headersSent) res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  const relativePath = requestUrl.pathname === "/" ? "index.html" : decodeURIComponent(requestUrl.pathname.slice(1));
  const filePath = path.resolve(root, relativePath);
  if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Não encontrado");
    return;
  }
  res.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Hub MRO disponível em http://localhost:${port}`);
  console.log(`Login local: ${process.env.CCO_EMAIL} / senha temporária configurada`);
});
