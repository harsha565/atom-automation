const http = require('http');

const FRONTEND_PORT = 3000;
const BACKEND_PORT = 8000;
const PORT = 5000;

const server = http.createServer((req, res) => {
  // Route /api/, /docs, /redoc, /openapi.json to the backend
  const isBackend = req.url.startsWith('/api/') || 
                    req.url.startsWith('/docs') || 
                    req.url.startsWith('/redoc') || 
                    req.url.startsWith('/openapi.json');
                    
  const targetPort = isBackend ? BACKEND_PORT : FRONTEND_PORT;
  const targetHost = isBackend ? '127.0.0.1' : 'localhost';

  // Forward request
  const proxyReq = http.request({
    host: targetHost,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error for ${req.url}:`, err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq, { end: true });
});

server.on('upgrade', (req, socket, head) => {
  const isBackend = req.url.startsWith('/api/');
  const targetPort = isBackend ? BACKEND_PORT : FRONTEND_PORT;
  const host = isBackend ? '127.0.0.1' : 'localhost';

  const proxyReq = http.request({
    host: host,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n');
    Object.keys(proxyRes.headers).forEach(key => {
      socket.write(`${key}: ${proxyRes.headers[key]}\r\n`);
    });
    socket.write('\r\n');

    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', (err) => {
    console.error('WebSocket proxy error:', err);
    socket.destroy();
  });

  proxyReq.end();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Reverse proxy listening on port ${PORT}`);
});
