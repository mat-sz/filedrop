import {
  LocalNetworksMessageModel,
  MessageModel,
  NetworkMessageModel,
  TargetedMessageModel,
  WelcomeMessageModel,
  MessageType,
  ClientModel,
} from '@filedrop/types';

import { Client } from './types/Client.js';
import { rtcConfiguration } from './utils/rtcConfiguration.js';
import {
  isNetworkNameMessageModel,
  isClientNameMessageModel,
  isTransferMessageModel,
  isActionMessageModel,
  isRTCDescriptionMessageModel,
  isRTCCandidateMessageModel,
  isEncryptedMessageModel,
} from './utils/validation.js';
import { appName, maxSize, noticeText, noticeUrl } from './config.js';

export class ClientManager {
  private clients: Client[] = [];

  constructor() {
    this.sendNetworkMessage = this.sendNetworkMessage.bind(this);
  }

  addClient(client: Client) {
    const localNetworkNames = this.getLocalNetworkNames(client);

    this.clients.push(client);

    client.send(
      JSON.stringify({
        type: MessageType.WELCOME,
        clientId: client.clientId,
        suggestedClientName: client.clientName,
        suggestedNetworkName: localNetworkNames[0],
        remoteAddress: client.remoteAddress,
        localNetworkNames,
        rtcConfiguration: rtcConfiguration(client.clientId),
        maxSize,
        noticeText,
        noticeUrl,
        appName,
      } as WelcomeMessageModel)
    );
  }

  handleMessage(client: Client, message: MessageModel) {
    client.lastSeen = new Date();

    if (isNetworkNameMessageModel(message)) {
      client.publicKey = message.publicKey;
      client.deviceType = message.deviceType;
      this.setNetworkName(client, message.networkName.toUpperCase());
    } else if (isClientNameMessageModel(message)) {
      client.clientName = message.clientName;
      this.setNetworkName(client, client.networkName);
    } else if (
      isActionMessageModel(message) ||
      isRTCDescriptionMessageModel(message) ||
      isRTCCandidateMessageModel(message) ||
      isEncryptedMessageModel(message)
    ) {
      this.sendMessage(client.clientId, message);
    } else if (isTransferMessageModel(message)) {
      // Ensure all previews are data URLs for safety.
      if (
        message.preview &&
        (typeof message.preview !== 'string' ||
          !message.preview.startsWith('data:'))
      ) {
        return;
      }

      this.sendMessage(client.clientId, message);
    }
  }

  sendMessage(fromClientId: string, message: TargetedMessageModel) {
    if (!message.targetId || message.targetId === fromClientId) {
      return;
    }

    const data = JSON.stringify({
      ...message,
      clientId: fromClientId,
    });

    const targets = this.clients.filter(c => c.clientId === message.targetId);
    targets.forEach(client => client.send(data));
  }

  sendLocalNetworksMessage(client: Client) {
    const localClients = this.getLocalClients(client);
    const localNetworkNames = this.getLocalNetworkNames(client);

    const localNetworksMessage = JSON.stringify({
      type: MessageType.LOCAL_NETWORKS,
      localNetworkNames,
    } as LocalNetworksMessageModel);

    localClients.forEach(client => {
      try {
        client.send(localNetworksMessage);
      } catch {}
    });
  }

  sendNetworkMessage(networkName: string) {
    const networkClients = this.clients.filter(
      client => client.networkName === networkName
    );

    const sortedClients = networkClients.sort(
      (a, b) => b.firstSeen.getTime() - a.firstSeen.getTime()
    );

    networkClients.forEach(client => {
      try {
        const clients: ClientModel[] = sortedClients.map(otherClient => {
          return {
            clientId: otherClient.clientId,
            clientName: otherClient.clientName,
            publicKey: otherClient.publicKey,
            isLocal: otherClient.remoteAddress === client.remoteAddress,
            deviceType: otherClient.deviceType,
          };
        });

        const networkMessage = JSON.stringify({
          type: MessageType.NETWORK,
          clients,
        } as NetworkMessageModel);

        client.send(networkMessage);
      } catch {}
    });
  }

  setNetworkName(client: Client, networkName?: string) {
    const previousNetworkName = client.networkName;
    client.networkName = networkName;

    if (previousNetworkName && previousNetworkName !== networkName) {
      this.sendNetworkMessage(previousNetworkName);
    }

    if (networkName) {
      this.sendNetworkMessage(networkName);
    }

    this.sendLocalNetworksMessage(client);
  }

  getLocalClients(client: Client) {
    return this.clients
      .filter(c => c.remoteAddress === client.remoteAddress && c.networkName)
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  getLocalNetworkNames(client: Client): string[] {
    const localClients = this.getLocalClients(client);
    const networkNames = new Set<string>();

    for (const client of localClients) {
      if (client.networkName) {
        networkNames.add(client.networkName);
      }
    }

    return [...networkNames.values()];
  }

  pingClients() {
    const pingMessage = JSON.stringify({
      type: MessageType.PING,
      timestamp: new Date().getTime(),
    });

    this.clients.forEach(client => {
      try {
        client.send(pingMessage);
      } catch {
        this.removeClient(client);
        client.close();
      }
    });
  }

  removeClient(client: Client) {
    this.setNetworkName(client, undefined);
    this.clients = this.clients.filter(c => c !== client);
  }

  removeBrokenClients() {
    this.clients = this.clients.filter(client => {
      if (client.readyState <= 1) {
        return true;
      } else {
        this.setNetworkName(client, undefined);
        return false;
      }
    });
  }

  removeInactiveClients() {
    const minuteAgo = new Date(Date.now() - 1000 * 20);

    this.clients.forEach(client => {
      if (client.readyState !== 1) return;

      if (client.lastSeen < minuteAgo) {
        this.removeClient(client);
        client.close();
      }
    });
  }
}
