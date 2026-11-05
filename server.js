const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Stealth landing page
app.get('/', (req, res) => {
    res.send('<h1>My Computer Science Portfolio</h1><p>Under construction.</p>');
});

// 2. Proxy web traffic
app.use('/game', createProxyMiddleware({
    target: 'https://diep.io',
    changeOrigin: true,
    pathRewrite: { '^/game': '' },
    logLevel: 'debug'
}));

const server = http.createServer(app);

// 3. Proxy WebSocket connections
server.on('upgrade', (req, socket, head) => {
    const wsProxy = createProxyMiddleware({
        target: 'https://diep.io', // http-proxy-middleware handles wss via the https target + ws: true
        ws: true,
        changeOrigin: true,
        logLevel: 'debug'
    });
    wsProxy.upgrade(req, socket, head);
});

server.listen(PORT, () => {
    console.log(`Stealth proxy running on port ${PORT}`);
});
