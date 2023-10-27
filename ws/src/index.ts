import path, { resolve } from 'path';
import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';

import { WSClient } from './WSClient.js';
import { ClientManager } from './ClientManager.js';
import { isMessageModel } from './utils/validation.js';
import {
  host,
  maxSize,
  port,
  useProxy,
  appName,
  staticRoot,
} from './config.js';

const clientManager = new ClientManager();
const app = Fastify();
app.register(fastifyCompress);

const manifest = {
  icons: [
    {
      src: 'icon512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
  start_url: '/',
  display: 'standalone',
  theme_color: '#1b1b1d',
  background_color: '#1b1b1d',
  name: appName || 'filedrop',
};
const manifestString = JSON.stringify(manifest);
const maxAge = 30 * 24 * 60 * 60 * 1000;

if (useProxy) {
  const fastifyHttpProxy = (await import('@fastify/http-proxy')).default;
  app.register(fastifyHttpProxy, {
    upstream: 'http://localhost:3000/',
  });
} else {
  const STATIC_ROOT = resolve(staticRoot);

  app.setNotFoundHandler((req, reply) => {
    const split = req.url.split('/');

    if (split.length === 2) {
      // For paths like /xyz we want to send the frontend.
      // This will not interfere with 404 errors for
      // truly not found files.
      reply.sendFile('index.html', STATIC_ROOT);
      return;
    }

    reply.status(404);
    reply.send('Not found');
  });
  app.register(fastifyStatic, {
    root: STATIC_ROOT,
    prefix: '/',
    index: 'index.html',
    cacheControl: false,
  });
  app.register(fastifyStatic, {
    root: path.join(STATIC_ROOT, 'assets'),
    prefix: '/assets',
    cacheControl: true,
    immutable: true,
    maxAge,
    decorateReply: false,
  });
  app.register(fastifyStatic, {
    root: path.join(STATIC_ROOT, 'locales'),
    prefix: '/locales',
    cacheControl: true,
    immutable: true,
    maxAge,
    decorateReply: false,
  });
}

app.get('/manifest.json', (_, res) => {
  res.type('application/json');
  return manifestString;
});

app.register(fastifyWebsocket);
app.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const ws = connection.socket;
    const client = new WSClient(ws, req);

    clientManager.sendAppInfo(client);

    ws.on('error', error => {
      console.log('[ERROR (Handled)]', error.message);
    });

    ws.on('message', (data: string) => {
      // Prevents DDoS and abuse.
      if (!data || data.length > maxSize) return;

      try {
        const message = JSON.parse(data);

        if (isMessageModel(message)) {
          clientManager.handleMessage(client, message);
        }
      } catch (e) {}
    });

    ws.on('close', () => {
      clientManager.removeClient(client);
    });
  });
});

app.listen({ host, port });

setInterval(() => {
  clientManager.removeBrokenClients();
}, 1000);

// Ping clients to keep the connection alive (when behind nginx)
setInterval(() => {
  clientManager.pingClients();
}, 5000);

setInterval(() => {
  clientManager.removeInactiveClients();
}, 10000);

console.log(`Server running on ${host}:${port}`);
