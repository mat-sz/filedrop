import { makeAutoObservable } from 'mobx';
import { ChatMessageModel, Message, MessageType } from '@filedrop/types';
import { v4 } from 'uuid';

import type { Connection } from './Connection';
import { ChatItemModel } from '../types/Models';

export class ChatStore {
  items: ChatItemModel[] = [];

  constructor(private connection: Connection) {
    makeAutoObservable(this);
  }

  get enabled() {
    return this.connection.secure;
  }

  sendChatMessage(body: string) {
    const clients = this.connection.clients;

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

      this.connection.send(message);
    }

    this.items.push({
      id: v4(),
      date: new Date(),
      clientId: this.connection.clientId!,
      message: body,
    });
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.CHAT:
        this.items.push({
          id: v4(),
          date: new Date(),
          clientId: message.clientId!,
          message: message.message,
        });
        break;
    }
  }
}
