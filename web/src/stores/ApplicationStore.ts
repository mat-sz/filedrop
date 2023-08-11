import { makeAutoObservable } from 'mobx';
import { Message, MessageType } from '@filedrop/types';

import type { Connection } from './Connection';
import { defaultAppName } from '../config';

export class ApplicationStore {
  error?: string = undefined;
  suggestedNetworkName?: string = undefined;
  noticeText?: string = undefined;
  noticeUrl?: string = undefined;
  appName = defaultAppName;
  abuseEmail?: string = undefined;
  tab = 'transfers';

  constructor(private connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  share(url: string) {
    if (!('share' in navigator)) {
      return;
    }

    navigator.share({
      title: this.appName + ' - transfer files',
      url,
    });
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.APP_INFO:
        this.abuseEmail = message.abuseEmail;
        this.noticeText = message.noticeText;
        this.noticeUrl = message.noticeUrl;

        break;
      case MessageType.CLIENT_INFO:
        this.suggestedNetworkName = message.suggestedNetworkName;
        break;
    }
  }
}
