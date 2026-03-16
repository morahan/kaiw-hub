#!/usr/bin/env node
// Simple SPA server - routes all paths to index.html
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = parseInt(process.env.PORT || '5173');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let filePath = join(DIST, req.url.split('?')[0]);
  
  // If file doesn't exist or is a directory without index.html, serve index.html (SPA)
  if (!existsSync(filePath) || (statSync(filePath).isDirectory() && !existsSync(join(filePath, 'index.html')))) {
    filePath = join(DIST, 'index.html');
  } else if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }
  
  const ext = extname(filePath);
  const contentType = MIME[ext] || 'text/plain';
  
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`kaiw-hub static SPA server ready → http://127.0.0.1:${PORT}/`);
});
