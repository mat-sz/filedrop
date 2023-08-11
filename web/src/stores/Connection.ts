import { makeAutoObservable, runInAction } from 'mobx';
import { RSA } from 'matcrypt';
import { TypeSocket } from 'typesocket';
import {
  ClientModel,
  EncryptedMessageModel,
  InitializeMessageModel,
  Message,
  MessageModel,
  MessageType,
  PingMessageModel,
} from '@filedrop/types';

import { wsServer } from '../config.js';
import { randomString } from '../utils/string.js';

export class Connection {
  clientId?: string = undefined;
  connected = false;
  remoteAddress?: string = undefined;
  publicKey?: string = undefined;
  privateKey?: string = undefined;
  clients: ClientModel[] = [];
  eventListeners: Map<string, Set<Function>> = new Map();

  private secret = randomString(64);
  private socket = new TypeSocket<MessageModel>(wsServer, {
    maxRetries: 0,
    retryOnClose: true,
    retryTime: 1000,
  });

  constructor() {
    makeAutoObservable(this);

    this.socket.on('connected', () => this.onConnected());
    this.socket.on('disconnected', () => this.onDisconnected());
    this.socket.on('message', message => this.onMessage(message as any));

    this.init();
  }

  get secure() {
    return !!this.publicKey;
  }

  async init() {
    try {
      const keyPair = await RSA.randomKeyPair();
      runInAction(() => {
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
      });
    } catch {}

    this.socket.connect();
  }

  async send(message: MessageModel) {
    if (this.socket.readyState !== 1) {
      return;
    }

    const secure = !!message.secure;
    delete message['secure'];

    if ('targetId' in message) {
      const target = this.clients.find(
        client => client.clientId === message.targetId
      );
      const targetPublicKey = target?.publicKey;

      if (targetPublicKey) {
        try {
          const payload: string = await RSA.encryptString(
            targetPublicKey,
            JSON.stringify(message)
          );

          const msg: EncryptedMessageModel = {
            type: MessageType.ENCRYPTED,
            targetId: message.targetId as string,
            payload,
          };

          this.socket.send(msg);
          return;
        } catch {}
      }
    }

    if (secure) {
      return;
    }

    this.socket.send(message);
  }

  on(type: 'message', handler: (message: Message) => void) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)!.add(handler);
  }

  emit(type: 'message', message: Message) {
    const set = this.eventListeners.get(type);
    if (set) {
      for (const handler of set) {
        handler(message);
      }
    }
  }

  onConnected() {
    this.connected = true;

    const message: InitializeMessageModel = {
      type: MessageType.INITIALIZE,
      secret: this.secret,
      publicKey: this.publicKey,
    };

    this.send(message);
  }

  onDisconnected() {
    this.connected = false;
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.APP_INFO:
        this.remoteAddress = message.remoteAddress;
        break;
      case MessageType.CLIENT_INFO:
        this.clientId = message.clientId;
        break;
      case MessageType.NETWORK:
        this.clients = message.clients;
        break;
      case MessageType.PING:
        const pongMessage: PingMessageModel = {
          type: MessageType.PING,
          timestamp: new Date().getTime(),
        };
        this.send(pongMessage);
        return;
      case MessageType.ENCRYPTED:
        if (!this.privateKey) {
          return;
        }

        try {
          const json = JSON.parse(
            (await RSA.decryptString(this.privateKey, message.payload))!
          );

          if (json && json.type) {
            if (message.clientId) {
              json.clientId = message.clientId;
            }

            this.emit('message', json);
            return;
          }
        } catch {}
        break;
    }

    this.emit('message', message);
  }
}
