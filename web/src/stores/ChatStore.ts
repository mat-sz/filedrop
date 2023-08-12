import { makeAutoObservable } from 'mobx';
import {
  ChatMessageModel,
  ClientModel,
  Message,
  MessageType,
} from '@filedrop/types';
import { v4 } from 'uuid';

import type { Connection } from './Connection.js';
import { ChatItemModel } from '../types/Models.js';

interface ChatChannel {
  channel: string;
  name: string;
  unread: number;
  client?: ClientModel;
}

export class ChatStore {
  channelItems: Map<string, ChatItemModel[]> = new Map();
  unreadCount: Map<string, number> = new Map();
  currentChannel = 'global';

  get items() {
    return this.channelItems.get(this.currentChannel) || [];
  }

  constructor(private connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
  }

  get enabled() {
    return this.connection.secure;
  }

  get channels(): ChatChannel[] {
    return [
      {
        channel: 'global',
        name: 'Everyone',
        unread: this.unreadCount.get('global') || 0,
      },
      ...this.connection.clients
        .filter(client => client.clientId !== this.connection.clientId)
        .map(client => ({
          channel: client.clientId,
          name: client.clientName || '',
          unread: this.unreadCount.get(client.clientId) || 0,
          client,
        })),
    ];
  }

  private pushMessage(channel: string, senderId: string, message: string) {
    if (!this.channelItems.has(channel)) {
      this.channelItems.set(channel, []);
    }

    const array = this.channelItems.get(channel)!;
    array.push({
      id: v4(),
      date: new Date(),
      clientId: senderId,
      message,
    });

    if (channel !== this.currentChannel) {
      this.unreadCount.set(channel, (this.unreadCount.get(channel) || 0) + 1);
    }
  }

  selectChannel(name: string) {
    this.currentChannel = name;
    this.unreadCount.set(name, 0);
  }

  sendChatMessage(body: string) {
    const direct = this.currentChannel !== 'global';
    const clients = direct
      ? this.connection.clients.filter(
          client => client.clientId === this.currentChannel
        )
      : this.connection.clients;

    for (const client of clients) {
      if (!client.publicKey) {
        continue;
      }

      const message: ChatMessageModel = {
        type: MessageType.CHAT,
        targetId: client.clientId,
        message: body,
        secure: true,
        direct,
      };

      this.connection.send(message);
    }

    this.pushMessage(this.currentChannel, this.connection.clientId!, body);
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.CHAT:
        this.pushMessage(
          message.direct ? message.clientId! : 'global',
          message.clientId!,
          message.message
        );
        break;
    }
  }
}
