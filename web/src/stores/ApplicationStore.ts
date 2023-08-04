import { makeAutoObservable } from 'mobx';
import { RSA } from 'matcrypt';

import { defaultAppName, wsServer } from '../config';
import { TypeSocket } from 'typesocket';
import {
  ActionMessageActionType,
  EncryptedMessageModel,
  InitializeMessageModel,
  Message,
  MessageModel,
  MessageType,
  PingMessageModel,
} from '@filedrop/types';
import { NetworkStore } from './NetworkStore';
import { randomString } from '../utils/string';
import { TransferState } from '../types/TransferState';
import { v4 } from 'uuid';
import { replaceUrlParameters } from '../utils/url';
import { Transfer } from './Transfer';

export class ApplicationStore {
  connected = false;
  rtcConfiguration?: RTCConfiguration = undefined;
  error?: string = undefined;
  remoteAddress?: string = undefined;
  maxSize = 0;
  suggestedNetworkName?: string = undefined;
  localNetworkNames: string[] = [];
  publicKey?: string = undefined;
  privateKey?: string = undefined;
  noticeText?: string = undefined;
  noticeUrl?: string = undefined;
  appName = defaultAppName;
  abuseEmail?: string = undefined;
  autoAccept = false;
  tab = 'transfers';

  networkStore = new NetworkStore(this);

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

  async init() {
    try {
      const keyPair = await RSA.randomKeyPair();
      this.publicKey = keyPair.publicKey;
      this.privateKey = keyPair.privateKey;
    } catch {}

    this.socket.connect();
  }

  async send(message: MessageModel) {
    const secure = !!message.secure;
    delete message['secure'];

    if ('targetId' in message) {
      const target = this.networkStore.network?.find(
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

  updateTitle() {
    const incomingTransferCount = this.networkStore.transfers.filter(
      transfer => transfer.state === TransferState.INCOMING
    ).length;

    if (incomingTransferCount > 0) {
      document.title = '(' + incomingTransferCount + ') ' + this.appName;
    } else {
      document.title = this.appName;
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
        if (message.appName) {
          this.appName = message.appName;
          this.updateTitle();
        }

        this.abuseEmail = message.abuseEmail;
        this.maxSize = message.maxSize;
        this.noticeText = message.noticeText;
        this.noticeUrl = message.noticeUrl;
        this.remoteAddress = message.remoteAddress;

        break;
      case MessageType.CLIENT_INFO:
        const rtcConfiguration = message.rtcConfiguration as RTCConfiguration;

        // If the server is allowed to set other properties it may result in a potential privacy breach.
        // Let's make sure that doesn't happen.
        // TODO: add other properties if neccessary.
        if (
          rtcConfiguration.iceServers &&
          Array.isArray(rtcConfiguration.iceServers)
        ) {
          this.rtcConfiguration = {
            iceServers: rtcConfiguration.iceServers.map(server => ({
              ...server,
              urls: Array.isArray(server.urls)
                ? server.urls.map(replaceUrlParameters)
                : replaceUrlParameters(server.urls),
            })),
          };
        } else {
          this.rtcConfiguration = undefined;
        }

        this.suggestedNetworkName = message.suggestedNetworkName;

        const clientName =
          this.networkStore.clientName || message.suggestedClientName;
        if (clientName) {
          this.networkStore.updateClientName(clientName);
        }

        this.localNetworkNames = message.localNetworkNames;
        this.networkStore.clientId = message.clientId;

        if (this.networkStore.networkName) {
          this.networkStore.updateNetworkName(this.networkStore.networkName);
        }
        break;
      case MessageType.LOCAL_NETWORKS:
        this.localNetworkNames = message.localNetworkNames;
        break;
      case MessageType.TRANSFER:
        if (message.clientId) {
          const transfer = new Transfer(
            this.networkStore,
            undefined,
            message.clientId!,
            message.fileName,
            message.fileSize,
            message.fileType,
            message.preview?.startsWith('data:') ? message.preview : undefined,
            message.transferId,
            true
          );

          this.networkStore.transfers.push(transfer);
          if (this.autoAccept) {
            this.networkStore.acceptTransfer(transfer.transferId);
          }
        }
        break;
      case MessageType.ACTION:
        switch (message.action) {
          case ActionMessageActionType.CANCEL:
            this.networkStore.removeTransfer(message.transferId);
            break;
          case ActionMessageActionType.ACCEPT:
            const transfer = this.networkStore.transfers.find(
              transfer => transfer.transferId === message.transferId
            );
            transfer?.start();
            break;
        }
        break;
      case MessageType.NETWORK:
        this.networkStore.updateNetwork(message.clients);
        break;
      case MessageType.PING:
        const pongMessage: PingMessageModel = {
          type: MessageType.PING,
          timestamp: new Date().getTime(),
        };
        this.send(pongMessage);
        break;
      case MessageType.RTC_DESCRIPTION:
        if (message.data.type === 'answer') {
          this.networkStore.setRemoteDescription(
            message.transferId,
            message.data
          );
        } else {
          const transfer = this.networkStore.transfers.find(
            transfer => transfer.transferId === message.transferId
          );
          transfer?.start(message.data);
        }
        break;
      case MessageType.RTC_CANDIDATE:
        this.networkStore.addIceCandiate(message.transferId, message.data);
        break;
      case MessageType.CHAT:
        this.networkStore.chat.push({
          id: v4(),
          date: new Date(),
          clientId: message.clientId!,
          message: message.message,
        });
        break;
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

            this.onMessage(json);
          }
        } catch {}
        break;
    }
  }
}

export const applicationStore = new ApplicationStore();
