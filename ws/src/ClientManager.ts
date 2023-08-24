import {
  LocalNetworksMessageModel,
  MessageModel,
  NetworkMessageModel,
  TargetedMessageModel,
  MessageType,
  ClientModel,
  AppInfoMessageModel,
  ClientInfoMessageModel,
  PingMessageModel,
  NetworkModel,
  DisconnectedMessageModel,
  ErrorMessageModel,
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
  isInitializeMessageModel,
  isChatMessageModel,
} from './utils/validation.js';
import {
  abuseEmail,
  appName,
  maxNetworkClients,
  maxSize,
  noticeText,
  noticeUrl,
  requireCrypto,
} from './config.js';
import { secretToId } from './utils/id.js';

export class ClientManager {
  private clients = new Set<Client>();

  constructor() {
    this.sendNetworkMessage = this.sendNetworkMessage.bind(this);
  }

  sendAppInfo(client: Client) {
    const message: AppInfoMessageModel = {
      type: MessageType.APP_INFO,
      remoteAddress: client.remoteAddress,
      maxSize,
      noticeText,
      noticeUrl,
      appName,
      abuseEmail,
      requireCrypto,
    };

    client.send(message);
  }

  handleMessage(client: Client, message: MessageModel) {
    client.lastSeen = new Date();

    if (isInitializeMessageModel(message)) {
      if (client.initialized) {
        return;
      }

      if (!message.publicKey && requireCrypto) {
        this.disconnectClient(client, 'cryptoRequired');
        return;
      }

      client.initialized = true;
      client.secret = message.secret;
      client.clientId = secretToId(client.secret);
      client.publicKey = message.publicKey;

      const localNetworks = this.getLocalNetworks(client);

      this.clients.add(client);

      const clientInfoMessage: ClientInfoMessageModel = {
        type: MessageType.CLIENT_INFO,
        clientId: client.clientId,
        suggestedClientName: client.clientName,
        suggestedNetworkName: localNetworks[0]?.name,
        localNetworks,
        rtcConfiguration: rtcConfiguration(client.clientId),
      };
      client.send(clientInfoMessage);

      return;
    }

    if (!client.initialized || !client.clientId) {
      return;
    }

    if (isNetworkNameMessageModel(message)) {
      const name = message.networkName.toUpperCase();
      const count = this.getNetworkClients(name).length;

      if (count >= maxNetworkClients) {
        this.sendError(client, 'network', 'networkFull');
        return;
      }

      client.deviceType = message.deviceType;
      this.setNetworkName(client, name);
    } else if (isClientNameMessageModel(message)) {
      const clients = [...this.clients].filter(
        c => c.clientId === client.clientId
      );

      for (const client of clients) {
        client.clientName = message.clientName;

        if (client.networkName) {
          this.setNetworkName(client, client.networkName);
        }
      }
    } else if (requireCrypto && !isEncryptedMessageModel(message)) {
      // Ignore unencrypted messages when running with required E2E crypto.
    } else if (
      isActionMessageModel(message) ||
      isRTCDescriptionMessageModel(message) ||
      isRTCCandidateMessageModel(message) ||
      isEncryptedMessageModel(message) ||
      isTransferMessageModel(message) ||
      isChatMessageModel(message)
    ) {
      this.sendMessage(client.clientId, message);
    }
  }

  disconnectClient(client: Client, reason: string) {
    const message: DisconnectedMessageModel = {
      type: MessageType.DISCONNECTED,
      reason,
    };
    client.send(message);
    client.close();
    this.removeClient(client);
  }

  sendError(client: Client, mode: ErrorMessageModel['mode'], reason: string) {
    const message: ErrorMessageModel = {
      type: MessageType.ERROR,
      mode,
      reason,
    };
    client.send(message);
  }

  sendMessage(fromClientId: string, message: TargetedMessageModel) {
    if (!message.targetId || message.targetId === fromClientId) {
      return;
    }

    const data = {
      ...message,
      clientId: fromClientId,
    };

    const targets = [...this.clients].filter(
      c => c.clientId === message.targetId
    );
    this.broadcast(data, targets);
  }

  sendLocalNetworksMessage(client: Client) {
    const localClients = this.getLocalClients(client);
    const localNetworks = this.getLocalNetworks(client);

    const localNetworksMessage: LocalNetworksMessageModel = {
      type: MessageType.LOCAL_NETWORKS,
      localNetworks,
    };
    this.broadcast(localNetworksMessage, localClients);
  }

  getNetworkClients(networkName: string): Client[] {
    const clients = [...this.clients].filter(
      client => client.networkName === networkName
    );

    const uniqueClients: Client[] = [];

    for (const client of clients) {
      if (!uniqueClients.find(c => c.clientId === client.clientId)) {
        uniqueClients.push(client);
      }
    }

    uniqueClients.sort((a, b) => b.firstSeen.getTime() - a.firstSeen.getTime());

    return uniqueClients;
  }

  sendNetworkMessage(networkName: string) {
    const networkClients = this.getNetworkClients(networkName);

    networkClients.forEach(client => {
      try {
        const clients: ClientModel[] = networkClients.map(otherClient => {
          return {
            clientId: otherClient.clientId!,
            clientName: otherClient.clientName,
            publicKey: otherClient.publicKey,
            isLocal: otherClient.remoteAddress === client.remoteAddress,
            deviceType: otherClient.deviceType,
          };
        });

        const networkMessage: NetworkMessageModel = {
          type: MessageType.NETWORK,
          clients,
        };

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
    return [...this.clients]
      .filter(c => c.remoteAddress === client.remoteAddress && c.networkName)
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  getLocalNetworks(client: Client): NetworkModel[] {
    const localClients = this.getLocalClients(client);
    const networkNames = new Set<string>();

    for (const client of localClients) {
      if (client.networkName) {
        networkNames.add(client.networkName);
      }
    }

    const networks: NetworkModel[] = [];
    for (const name of networkNames.values()) {
      networks.push({
        name,
        clients: this.getNetworkClients(name).map(otherClient => {
          return {
            clientId: otherClient.clientId!,
            clientName: otherClient.clientName,
            isLocal: otherClient.remoteAddress === client.remoteAddress,
          };
        }),
      });
    }

    networks.sort((a, b) => b.clients.length - a.clients.length);
    return networks;
  }

  broadcast(message: MessageModel, clients?: Client[]) {
    if (!clients) {
      clients = [...this.clients];
    }
    const data = JSON.stringify(message);

    for (const client of clients) {
      try {
        client.sendRaw(data);
      } catch {
        this.removeClient(client);
        client.close();
      }
    }
  }

  pingClients() {
    const pingMessage: PingMessageModel = {
      type: MessageType.PING,
      timestamp: new Date().getTime(),
    };

    this.broadcast(pingMessage);
  }

  removeClient(client: Client) {
    this.setNetworkName(client, undefined);
    this.clients.delete(client);
  }

  removeBrokenClients() {
    for (const client of this.clients) {
      if (client.readyState <= 1) {
        continue;
      }

      this.setNetworkName(client, undefined);
      this.clients.delete(client);
    }
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
