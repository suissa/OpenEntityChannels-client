import * as http from "http";
import * as fs   from "fs";
import * as path from "path";
import { readProtocolFile }    from "./parser";
import { generateFullPageHTML } from "./template/page";

const PORT         = Number(process.env.PORT) || 4040;
const PUBLIC_DIR   = path.resolve("./public");
const PROTOCOL_FILE = process.argv[2] || "./openEntityChannels.json";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css",
  ".js":   "text/javascript",
  ".json": "application/json",
};

function generateInterfaceAndWriteToPublicDir(): void {
  const protocol = readProtocolFile(PROTOCOL_FILE);
  const html     = generateFullPageHTML(protocol);

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, "index.html"), html, "utf-8");

  const entityCount  = Object.keys(protocol.entities).length;
  const channelCount = Object.values(protocol.entities)
    .reduce((n, e) => n + Object.values(e.channels).filter(c => c?.enabled).length, 0);

  console.log(`\n✅  Interface gerada: ${entityCount} entidades · ${channelCount} canais`);
  console.log(`    Fonte  → ${path.resolve(PROTOCOL_FILE)}`);
  console.log(`    Output → ${path.join(PUBLIC_DIR, "index.html")}`);
}

function resolveRequestedFilePath(url: string): string {
  const normalizedUrl = url === "/" ? "/index.html" : url;
  return path.join(PUBLIC_DIR, normalizedUrl);
}

function respondWithFile(filePath: string, res: http.ServerResponse): void {
  const ext         = path.extname(filePath);
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  const content     = fs.readFileSync(filePath);

  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}

function respondWithNotFound(res: http.ServerResponse): void {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
}

function handleStaticFileRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const filePath = resolveRequestedFilePath(req.url ?? "/");

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    respondWithFile(filePath, res);
  } else {
    respondWithNotFound(res);
  }
}

function printServerReadyBanner(url: string): void {
  const line = "─".repeat(45);
  console.log(`\n┌${line}┐`);
  console.log(`│${"  🚀  ECP Interface Explorer  ".padEnd(45)}│`);
  console.log(`│${line}│`);
  console.log(`│${" ".padEnd(45)}│`);
  console.log(`│${ `   URL  →  ${url}`.padEnd(45)}│`);
  console.log(`│${" ".padEnd(45)}│`);
  console.log(`│${"   Ctrl+C para parar".padEnd(45)}│`);
  console.log(`│${" ".padEnd(45)}│`);
  console.log(`└${line}┘\n`);
}

generateInterfaceAndWriteToPublicDir();

http.createServer(handleStaticFileRequest).listen(PORT, () => {
  printServerReadyBanner(`http://localhost:${PORT}`);
});
