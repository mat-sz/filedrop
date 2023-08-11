import {
  ActionMessageActionType,
  ClientModel,
  ClientNameMessageModel,
  Message,
  MessageType,
  NetworkNameMessageModel,
  TransferMessageModel,
} from '@filedrop/types';
import { makeAutoObservable, runInAction } from 'mobx';
import { canvas } from 'imtool';

import type { Connection } from './Connection';
import { deviceType } from '../utils/browser';
import { TransferState } from '../types/TransferState';
import { Transfer } from './Transfer';
import { defaultAppName } from '../config';
import { replaceUrlParameters } from '../utils/url';
import { getItem, setItem } from '../utils/storage';
import { settingsStore } from '.';

export class NetworkStore {
  maxSize = 0;
  appName = defaultAppName;
  rtcConfiguration?: RTCConfiguration = undefined;
  localNetworkNames: string[] = [];

  clientName?: string = getItem('clientName', undefined);
  networkName?: string = undefined;

  clientCache: ClientModel[] = [];
  network: ClientModel[] = [];
  transfers: Transfer[] = [];

  constructor(private connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
  }

  get incomingTransfers() {
    return this.transfers.filter(
      transfer => transfer.state === TransferState.INCOMING
    );
  }

  get outgoingTransfers() {
    return this.transfers.filter(
      transfer => transfer.state === TransferState.OUTGOING
    );
  }

  get activeTransfers() {
    return this.transfers.filter(transfer => transfer.isActive);
  }

  get doneTransfers() {
    return this.transfers.filter(transfer => transfer.isDone);
  }

  get otherNetworks() {
    return this.localNetworkNames.filter(
      networkName => networkName !== this.networkName
    );
  }

  get currentClient() {
    return this.network.find(
      client => client.clientId === this.connection.clientId
    );
  }

  get clients() {
    return this.network.filter(
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

  updateNetwork(clients: ClientModel[]) {
    this.network = clients;

    const clientIds = clients.map(client => client.clientId);
    const cached = this.clientCache.filter(
      client => !clientIds.includes(client.clientId)
    );
    this.clientCache = [...cached, ...clients];
  }

  setRemoteDescription(id: string, description: RTCSessionDescription) {
    for (const transfer of this.transfers) {
      if (transfer.transferId === id) {
        transfer.setRemoteDescription(description);
        return;
      }
    }
  }

  addIceCandiate(id: string, candidate: RTCIceCandidate) {
    for (const transfer of this.transfers) {
      if (transfer.transferId === id) {
        transfer.addIceCandiate(candidate);
        return;
      }
    }
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
      file.type,
      preview
    );

    runInAction(() => {
      this.transfers.push(transfer);
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

  cancelTransfer(id: string) {
    const transfer = this.transfers.find(
      transfer => transfer.transferId === id
    );
    if (!transfer) return;
    transfer.cancel();
  }

  acceptTransfer(id: string) {
    const transfer = this.transfers.find(
      transfer => transfer.transferId === id
    );
    if (!transfer) return;
    transfer.accept();
  }

  removeTransfer(id: string) {
    this.transfers = this.transfers.filter(
      transfer => transfer.transferId !== id
    );
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

          this.transfers.push(transfer);
          if (settingsStore.autoAccept) {
            this.acceptTransfer(transfer.transferId);
          }
        }
        break;
      case MessageType.ACTION:
        switch (message.action) {
          case ActionMessageActionType.CANCEL:
            this.removeTransfer(message.transferId);
            break;
          case ActionMessageActionType.ACCEPT:
            const transfer = this.transfers.find(
              transfer => transfer.transferId === message.transferId
            );
            transfer?.start();
            break;
        }
        break;
      case MessageType.NETWORK:
        this.updateNetwork(message.clients);
        break;
      case MessageType.LOCAL_NETWORKS:
        this.localNetworkNames = message.localNetworkNames;
        break;
      case MessageType.RTC_DESCRIPTION:
        if (message.data.type === 'answer') {
          this.setRemoteDescription(message.transferId, message.data);
        } else {
          const transfer = this.transfers.find(
            transfer => transfer.transferId === message.transferId
          );
          transfer?.start(message.data);
        }
        break;
      case MessageType.RTC_CANDIDATE:
        this.addIceCandiate(message.transferId, message.data);
        break;
    }
  }
}
