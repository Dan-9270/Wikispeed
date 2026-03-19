import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const port = Number.parseInt(process.env.PORT || '8080', 10);
const apiPort = Number.parseInt(process.env.API_PORT || '3000', 10);
const solverPort = Number.parseInt(process.env.SOLVER_PORT || '3001', 10);
const wsPort = Number.parseInt(process.env.WS_PORT || '2025', 10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

app.use('/api', createProxyMiddleware({
  target: `http://127.0.0.1:${apiPort}`,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

app.use('/solver', createProxyMiddleware({
  target: `http://127.0.0.1:${solverPort}`,
  changeOrigin: true,
  pathRewrite: { '^/solver': '' },
}));

const wsProxy = createProxyMiddleware({
  target: `ws://127.0.0.1:${wsPort}`,
  ws: true,
  changeOrigin: true,
  pathRewrite: { '^/ws': '' },
});

app.use('/ws', wsProxy);
app.use(express.static(distPath));
app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Gateway running on http://0.0.0.0:${port}`);
});

server.on('upgrade', wsProxy.upgrade);
