import { makeAutoObservable, runInAction } from 'mobx';
import { Message, MessageType } from '@filedrop/types';

import type { Connection } from './Connection.js';
import { defaultAppName } from '../config.js';
import { isClipboardReadSupported, isSafari } from '../utils/browser.js';

export class ApplicationStore {
  error?: string = undefined;
  suggestedNetworkName?: string = undefined;
  noticeText?: string = undefined;
  noticeUrl?: string = undefined;
  appName = defaultAppName;
  abuseEmail?: string = undefined;
  tab = 'transfers';
  modal?: string = undefined;
  showPaste = false;

  constructor(connection: Connection) {
    makeAutoObservable(this);

    connection.on('message', message => this.onMessage(message as any));
    this.refreshClipboardStatus();
  }

  openModal(modal: string) {
    this.modal = modal;
  }

  closeModal() {
    this.modal = undefined;
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

  private handlePermissionState(state: PermissionState) {
    this.showPaste = state !== 'denied';
  }

  async refreshClipboardStatus() {
    if (!isClipboardReadSupported) {
      this.showPaste = false;
      return;
    }

    if (isSafari) {
      this.showPaste = true;
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'clipboard-read',
        allowWithoutGesture: false,
      } as any);
      this.handlePermissionState(permissionStatus.state);
      permissionStatus.onchange = () => {
        this.handlePermissionState(permissionStatus.state);
      };
    } catch {
      runInAction(() => {
        this.showPaste = false;
      });
    }
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.APP_INFO:
        runInAction(() => {
          this.appName = message.appName || defaultAppName;
          this.abuseEmail = message.abuseEmail;
          this.noticeText = message.noticeText;
          this.noticeUrl = message.noticeUrl;
        });

        break;
      case MessageType.CLIENT_INFO:
        runInAction(() => {
          this.suggestedNetworkName = message.suggestedNetworkName;
        });
        break;
    }
  }
}
