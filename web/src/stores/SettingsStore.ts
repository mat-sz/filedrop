import { makeAutoObservable } from 'mobx';

export class SettingsStore {
  autoAccept = false;

  constructor() {
    makeAutoObservable(this);
  }
}

export const settingsStore = new SettingsStore();
