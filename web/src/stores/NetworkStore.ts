import {
  ChatMessageModel,
  ClientModel,
  ClientNameMessageModel,
  MessageType,
  NetworkNameMessageModel,
  TransferMessageModel,
} from '@filedrop/types';
import { makeAutoObservable } from 'mobx';
import { ChatItemModel } from '../types/Models';
import type { ApplicationStore } from './ApplicationStore';
import { deviceType } from '../utils/browser';
import { canvas } from 'imtool';
import { TransferState } from '../types/TransferState';
import { v4 } from 'uuid';
import { Transfer } from './Transfer';

export class NetworkStore {
  clientId?: string = undefined;
  clientName?: string = localStorage.getItem('clientName') || undefined;
  networkName?: string = undefined;

  clientCache: ClientModel[] = [];
  network: ClientModel[] = [];
  transfers: Transfer[] = [];
  chat: ChatItemModel[] = [];

  constructor(public applicationStore: ApplicationStore) {
    makeAutoObservable(this);
  }

  updateClientName(clientName: string) {
    const message: ClientNameMessageModel = {
      type: MessageType.CLIENT_NAME,
      clientName,
    };

    this.applicationStore.send(message);
    this.clientName = clientName;
    localStorage.setItem('clientName', clientName);
  }

  updateNetworkName(networkName: string) {
    const message: NetworkNameMessageModel = {
      type: MessageType.NETWORK_NAME,
      networkName,
      deviceType,
    };

    this.networkName = networkName;
    this.applicationStore.send(message);
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
      const maxSize = this.applicationStore.maxSize;
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
      file,
      targetId,
      file.name,
      file.size,
      file.type,
      preview
    );

    this.transfers.push(transfer);

    const message: TransferMessageModel = {
      type: MessageType.TRANSFER,
      transferId: transfer.transferId,
      fileName: transfer.fileName,
      fileSize: transfer.fileSize,
      fileType: transfer.fileType,
      targetId: transfer.targetId,
      preview,
    };

    this.applicationStore.send(message);
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
      transfer =>
        transfer.state === TransferState.INCOMING && transfer.transferId === id
    );
    if (!transfer) return;
    transfer.accept();
  }

  removeTransfer(id: string) {
    this.transfers = this.transfers.filter(
      transfer => transfer.transferId !== id
    );
  }

  sendChatMessage(body: string) {
    const clients = this.network;

    for (const client of clients) {
      if (!client.publicKey) {
        continue;
      }

      const message: ChatMessageModel = {
        type: MessageType.CHAT,
        targetId: client.clientId,
        message: body,
        secure: true,
      };

      this.applicationStore.send(message);
    }

    this.chat.push({
      id: v4(),
      date: new Date(),
      clientId: this.clientId!,
      message: body,
    });
  }
}
