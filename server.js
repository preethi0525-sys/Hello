const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, 'sample-store');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};
const appRoutes = new Set([
  '/', '/collections/all', '/products/sample-product', '/products/coffee-mug',
  '/products/canvas-tote', '/cart', '/checkout', '/account/login',
  '/account/register', '/search',
]);

http.createServer((req, res) => {
  const requestUrl = new URL(req.url, 'http://127.0.0.1');
  const pathname = decodeURIComponent(requestUrl.pathname);
  const asset = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const assetPath = path.resolve(root, asset);

  if (assetPath.startsWith(root + path.sep) && fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    res.writeHead(200, { 'Content-Type': contentTypes[path.extname(assetPath)] || 'application/octet-stream' });
    fs.createReadStream(assetPath).pipe(res);
    return;
  }

  if (appRoutes.has(pathname) || pathname.startsWith('/products/')) {
    res.writeHead(200, { 'Content-Type': contentTypes['.html'] });
    fs.createReadStream(path.join(root, 'index.html')).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': contentTypes['.html'] });
  fs.createReadStream(path.join(root, 'index.html')).pipe(res);
}).listen(3000, '127.0.0.1', () => {
  console.log('Sample store ready at http://127.0.0.1:3000');
});
