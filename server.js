const http = require('http');
const fs = require('fs');
const path = require('path');

function readPort(argv){
  const idx = argv.findIndex(arg => arg === '--port' || arg === '-p');
  if (idx !== -1 && argv[idx + 1]) return parseInt(argv[idx + 1], 10);
  const withEq = argv.find(arg => arg.startsWith('--port='));
  if (withEq) return parseInt(withEq.split('=')[1], 10);
  return undefined;
}

const cliPort = readPort(process.argv.slice(2));
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
const PORT = Number.isFinite(cliPort) ? cliPort : (Number.isFinite(envPort) ? envPort : 5173);
const baseDir = process.cwd();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function safePath(urlPath){
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const filePath = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.join(baseDir, path.normalize(filePath));
  if (!resolved.startsWith(baseDir)) return null; // directory traversal guard
  return resolved;
}

function notFound(res){
  res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
  res.end('404 - Arquivo não encontrado');
}

const server = http.createServer((req, res) => {
  const p = safePath(req.url || '/');
  if(!p) return notFound(res);

  fs.stat(p, (err, stats) => {
    if (err) {
      // Tenta fallback para index.html em rotas desconhecidas (SPA-like)
      if (path.extname(p) === '') {
        const fallback = path.join(baseDir, 'index.html');
        return fs.readFile(fallback, (e, data) => {
          if (e) return notFound(res);
          res.writeHead(200, {'Content-Type': types['.html']});
          res.end(data);
        });
      }
      return notFound(res);
    }

    const filePath = stats.isDirectory() ? path.join(p, 'index.html') : p;
    const ext = path.extname(filePath).toLowerCase();
    const type = types[ext] || 'application/octet-stream';

    const range = req.headers.range;
    // Suporte a Range para streaming de vídeo (necessário no iOS/Safari)
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const size = stats.size;
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10) || 0;
      const end = endStr ? parseInt(endStr, 10) : size - 1;
      const chunk = Math.max(0, end - start + 1);
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunk,
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    // Resposta normal com suporte a HEAD e Accept-Ranges
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': ext.match(/\.(html|js|css)$/) ? 'no-cache' : 'public, max-age=31536000'
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
