import {
  ActionMessageActionType,
  ClientModel,
  ClientNameMessageModel,
  Message,
  MessageType,
  NetworkModel,
  NetworkNameMessageModel,
  TransferMessageModel,
} from '@filedrop/types';
import { makeAutoObservable, runInAction } from 'mobx';
import { canvas } from 'imtool';

import type { Connection } from './Connection.js';
import { deviceType } from '../utils/browser.js';
import { TransferState } from '../types/TransferState.js';
import { Transfer } from './Transfer.js';
import { defaultAppName } from '../config.js';
import { replaceUrlParameters } from '../utils/url.js';
import { getItem, setItem } from '../utils/storage.js';
import { settingsStore } from './SettingsStore.js';

export class NetworkStore {
  maxSize = 0;
  appName = defaultAppName;
  rtcConfiguration?: RTCConfiguration = undefined;
  localNetworks: NetworkModel[] = [];

  clientName?: string = getItem('clientName', undefined);
  networkName?: string = undefined;
  networkError?: string = undefined;

  networkClients: Map<string, ClientModel> = new Map();
  transfers: Map<string, Transfer> = new Map();

  constructor(private connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
  }

  get transferList() {
    const list = [...this.transfers.values()];
    list.sort((a, b) => b.sortTimestamp - a.sortTimestamp);
    return list;
  }

  get incomingTransfers() {
    return this.transferList.filter(
      transfer => transfer.state === TransferState.INCOMING
    );
  }

  get outgoingTransfers() {
    return this.transferList.filter(
      transfer => transfer.state === TransferState.OUTGOING
    );
  }

  get activeTransfers() {
    return this.transferList.filter(transfer => transfer.isActive);
  }

  get doneTransfers() {
    return this.transferList.filter(transfer => transfer.isDone);
  }

  get otherNetworks() {
    return this.localNetworks.filter(
      network => network.name.toUpperCase() !== this.networkName?.toUpperCase()
    );
  }

  get currentClient() {
    if (!this.connection.clientId) {
      return undefined;
    }

    return this.networkClients.get(this.connection.clientId);
  }

  get clients() {
    return [...this.networkClients.values()].filter(
      client => client.clientId !== this.connection.clientId
    );
  }

  updateTitle() {
    const incomingTransferCount = this.incomingTransfers.length;

    if (incomingTransferCount > 0) {
      document.title = '(' + incomingTransferCount + ') ' + this.appName;
    } else {
      document.title = this.appName;
    }
  }

  updateClientName(clientName: string) {
    const message: ClientNameMessageModel = {
      type: MessageType.CLIENT_NAME,
      clientName,
    };

    this.connection.send(message);
    this.clientName = clientName;
    setItem('clientName', clientName);
  }

  updateNetworkName(networkName: string) {
    const message: NetworkNameMessageModel = {
      type: MessageType.NETWORK_NAME,
      networkName,
      deviceType,
    };

    this.networkName = networkName;
    this.connection.send(message);
  }

  async createTransfer(file: File, targetId: string) {
    let preview: string | undefined = undefined;

    if (file.type.startsWith('image/')) {
      const maxSize = this.maxSize;
      try {
        const newCanvas = await canvas.fromFile(file);
        const url = canvas
          .thumbnail(newCanvas, 100, true)
          .toDataURL('image/jpeg', 0.65);

        // Ensure the URL isn't too long.
        if (url.length < maxSize * 0.75) {
          preview = url;
        }
      } catch {}
    }

    const transfer = new Transfer(
      this,
      this.connection,
      file,
      targetId,
      file.name,
      file.size,
      file.type || 'application/octet-stream',
      preview
    );

    runInAction(() => {
      this.transfers.set(transfer.transferId, transfer);
    });

    const message: TransferMessageModel = {
      type: MessageType.TRANSFER,
      transferId: transfer.transferId,
      fileName: transfer.fileName,
      fileSize: transfer.fileSize,
      fileType: transfer.fileType,
      targetId: transfer.targetId,
      preview,
    };

    this.connection.send(message);
  }

  removeTransfer(id: string) {
    this.transfers.get(id)?.stop();
    this.transfers.delete(id);
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.APP_INFO:
        if (message.appName) {
          this.appName = message.appName;
          this.updateTitle();
        }

        this.maxSize = message.maxSize;
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

        const clientName = this.clientName || message.suggestedClientName;
        if (clientName) {
          this.updateClientName(clientName);
        }

        if (this.networkName) {
          this.updateNetworkName(this.networkName);
        }
        break;
      case MessageType.ERROR:
        if (message.mode === 'network') {
          this.networkError = message.reason;
        }
        break;
      case MessageType.NETWORK:
        this.networkError = undefined;
        this.networkClients.clear();

        for (const client of message.clients) {
          this.networkClients.set(client.clientId, client);
        }
        break;
      case MessageType.LOCAL_NETWORKS:
        this.localNetworks = message.localNetworks;
        break;
      case MessageType.TRANSFER:
        if (message.clientId) {
          const transfer = new Transfer(
            this,
            this.connection,
            undefined,
            message.clientId!,
            message.fileName,
            message.fileSize,
            message.fileType,
            message.preview?.startsWith('data:') ? message.preview : undefined,
            message.transferId,
            true
          );

          this.transfers.set(transfer.transferId, transfer);
          if (settingsStore.settings.autoAccept) {
            transfer.accept();
          }
        }
        break;
      case MessageType.ACTION:
        switch (message.action) {
          case ActionMessageActionType.CANCEL:
            this.removeTransfer(message.transferId);
            break;
          case ActionMessageActionType.ACCEPT:
            this.transfers.get(message.transferId)?.start();
            break;
        }
        break;
      case MessageType.RTC_DESCRIPTION:
        this.transfers.get(message.transferId)?.start(message.data);
        break;
      case MessageType.RTC_CANDIDATE:
        this.transfers.get(message.transferId)?.addIceCandidate(message.data);
        break;
    }
  }
}
