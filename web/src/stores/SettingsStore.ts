import { autorun, makeAutoObservable } from 'mobx';
import { getItem, setItem } from '../utils/storage.js';

interface Settings {
  autoAccept: boolean;
}

const DEFAULT_SETTINGS = {
  autoAccept: false,
};

export class SettingsStore {
  settings: Settings = {
    ...DEFAULT_SETTINGS,
    ...getItem('settings', {}),
  };

  constructor() {
    makeAutoObservable(this);

    autorun(() => {
      setItem('settings', this.settings);
    });
  }
}

export const settingsStore = new SettingsStore();
