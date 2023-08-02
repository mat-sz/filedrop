import WebSocket from 'ws';
import { FastifyRequest } from 'fastify';
import { DeviceType, MessageModel } from '@filedrop/types';

import { Client } from './types/Client.js';
import { generateClientName } from './utils/name.js';
import { acceptForwardedFor } from './config.js';

export class WSClient implements Client {
  readonly firstSeen = new Date();
  clientName?: string = generateClientName();
  lastSeen = new Date();
  readonly remoteAddress?: string;
  networkName?: string = undefined;
  publicKey?: string;
  deviceType?: DeviceType;
  initialized = false;
  secret?: string;
  clientId?: string;

  constructor(private ws: WebSocket, req: FastifyRequest) {
    const address =
      acceptForwardedFor && req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for']
        : req.socket.remoteAddress;
    this.remoteAddress = typeof address === 'string' ? address : address?.[0];
  }

  send(message: MessageModel) {
    this.sendRaw(JSON.stringify(message));
  }

  sendRaw(data: string) {
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
