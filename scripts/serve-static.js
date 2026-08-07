const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const dir = process.argv[2] || 'admin/dist';
const port = parseInt(process.argv[3], 10) || 5174;

http.createServer((req, res) => {
  try {
    const fullUrl = req.url || '/';
    let reqPath = decodeURIComponent(fullUrl.split('?')[0]);

    // Proxy API requests to the backend server on port 5000
    if (reqPath.startsWith('/api')) {
      const target = `http://localhost:5000${reqPath}`;
      const proxyReq = http.request(target, {
        method: req.method,
        headers: req.headers,
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });
      req.pipe(proxyReq, { end: true });
      return;
    }

    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), dir, reqPath);
    if (!filePath.startsWith(path.join(process.cwd(), dir))) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // fallback to index.html for SPA
      const indexPath = path.join(process.cwd(), dir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    }
  } catch (err) {
    res.writeHead(500);
    res.end('Server error');
  }
}).listen(port, () => {
  console.log(`Serving ${dir} on http://localhost:${port}`);
});
