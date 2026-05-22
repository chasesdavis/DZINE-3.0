import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";

export interface PreviewOptions {
  port?: number;
  rootDir?: string;
}

export async function startPreviewServer(filePath: string, options: PreviewOptions = {}): Promise<{ url: string; close: () => Promise<void> }> {
  const absolutePath = resolve(filePath);
  const rootDir = resolve(options.rootDir ?? dirname(absolutePath));
  const port = options.port ?? 4310;
  const entryContent = await readFile(absolutePath);
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
      const pathname = decodeURIComponent(requestUrl.pathname);
      const targetPath = pathname === "/" ? absolutePath : resolve(rootDir, `.${normalize(pathname)}`);
      if (!targetPath.startsWith(rootDir) && targetPath !== absolutePath) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
        response.end("Forbidden");
        return;
      }
      const content = pathname === "/" ? entryContent : await readFile(targetPath);
      response.writeHead(200, { "content-type": contentType(targetPath) });
      response.end(content);
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end((error as Error).message);
    }
  });

  await new Promise<void>((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(port, () => resolveListen());
  });

  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolveClose, rejectClose) => {
      server.close((error) => error ? rejectClose(error) : resolveClose());
    })
  };
}

function contentType(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
