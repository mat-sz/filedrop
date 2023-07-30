import { v4 as uuid } from 'uuid';
import WebSocket from 'ws';
import { FastifyRequest } from 'fastify';

import { Client } from './types/Client';
import { generateClientName } from './utils/name';
import { acceptForwardedFor } from './config';

export class WSClient implements Client {
  readonly clientId = uuid();
  readonly firstSeen = new Date();
  clientName?: string = generateClientName();
  lastSeen = new Date();
  readonly remoteAddress?: string;
  networkName?: string = undefined;

  constructor(private ws: WebSocket, req: FastifyRequest) {
    const address =
      acceptForwardedFor && req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for']
        : req.socket.remoteAddress;
    this.remoteAddress = typeof address === 'string' ? address : address?.[0];
  }

  send(data: string) {
    if (this.ws.readyState !== 1) {
      return;
    }

    this.ws.send(data);
  }

  get readyState() {
    return this.ws.readyState;
  }

  close() {
    this.ws.close();
  }
}
