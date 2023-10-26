import { makeAutoObservable } from 'mobx';
import {
  ChatMessageModel,
  ClientModel,
  Message,
  MessageType,
} from '@filedrop/types';
import { nanoid } from 'nanoid';

import type { Connection } from './Connection.js';
import { ChatItemModel } from '../types/Models.js';
import { t } from 'i18not';

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
  visible = false;

  setVisible(visible: boolean) {
    this.visible = visible;
    this.unreadCount.set(this.currentChannel, 0);
  }

  get items() {
    return this.channelItems.get(this.currentChannel) || [];
  }

  constructor(private connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
  }

  get unread() {
    return [...this.unreadCount.values()].reduce(
      (total, current) => total + current,
      0
    );
  }

  get currentChannelName() {
    return this.currentChannel === 'global'
      ? t('chat.everyone')
      : this.connection.clients.find(
          client => client.clientId === this.currentChannel
        )?.clientName || '';
  }

  get channels(): ChatChannel[] {
    const channels: ChatChannel[] = [
      {
        channel: 'global',
        name: 'Everyone',
        unread: this.unreadCount.get('global') || 0,
      },
    ];

    channels.push(
      ...this.connection.clients
        .filter(client => client.clientId !== this.connection.clientId)
        .map(client => ({
          channel: client.clientId,
          name: client.clientName || '',
          unread: this.unreadCount.get(client.clientId) || 0,
          client,
        }))
    );

    for (const key of this.channelItems.keys()) {
      if (key === 'global') {
        continue;
      }

      if (!channels.find(channel => channel.channel === key)) {
        const cached = this.connection.clientCache.get(key);
        if (!cached) {
          continue;
        }

        channels.push({
          channel: key,
          name: cached.clientName || '',
          unread: this.unreadCount.get(cached.clientId) || 0,
          client: cached,
        });
      }
    }

    return channels;
  }

  private getVisible() {
    return this.visible || window.matchMedia('(min-width: 768px)').matches;
  }

  private pushMessage(channel: string, senderId: string, message: string) {
    if (!this.channelItems.has(channel)) {
      this.channelItems.set(channel, []);
    }

    const array = this.channelItems.get(channel)!;
    array.push({
      id: nanoid(),
      date: new Date(),
      clientId: senderId,
      message,
    });

    if (!this.getVisible() || channel !== this.currentChannel) {
      this.unreadCount.set(channel, (this.unreadCount.get(channel) || 0) + 1);
    }
  }

  selectChannel(channel: string) {
    this.currentChannel = channel;
    this.unreadCount.set(channel, 0);
  }

  sendChatMessage(body: string) {
    const direct = this.currentChannel !== 'global';
    const clients = direct
      ? this.connection.clients.filter(
          client => client.clientId === this.currentChannel
        )
      : this.connection.clients;

    for (const client of clients) {
      const message: ChatMessageModel = {
        type: MessageType.CHAT,
        targetId: client.clientId,
        message: body,
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
