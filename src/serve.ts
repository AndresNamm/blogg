import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const port = Number(process.env.PORT ?? 3000);
const buildDir = path.join(__dirname, '..', 'build');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function requestPath(url: string): string | undefined {
  const [pathname] = url.split('?', 1);
  if (pathname === '/') return 'index.html';
  if (!pathname.startsWith('/')) return;

  try {
    const segments = pathname.slice(1).split('/').map(decodeURIComponent);
    if (segments.some(segment => !segment || segment === '.' || segment === '..' || /[/\\\0]/.test(segment))) {
      return;
    }
    return segments.join('/');
  } catch {
    return;
  }
}

const server = http.createServer(async (req, res) => {
  const requested = requestPath(req.url ?? '');
  if (requested === undefined) {
    res.writeHead(400).end('400 Bad Request');
    return;
  }

  try {
    const root = await fs.promises.realpath(buildDir);
    const file = await fs.promises.realpath(path.join(root, requested));
    if (!file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(404).end('404 Not Found');
      return;
    }
    const content = await fs.promises.readFile(file);
    const ext = path.extname(requested).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType }).end(content);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
      res.writeHead(404).end('404 Not Found');
    } else {
      res.writeHead(500).end('Server Error');
    }
  }
});

server.listen(port, () => {
  const address = server.address();
  if (address && typeof address !== 'string') {
    console.log(`Server running at http://localhost:${address.port}/`);
  }
  console.log('Press Ctrl+C to stop');
});
