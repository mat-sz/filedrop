import { autorun, makeAutoObservable } from 'mobx';
import { getItem, setItem } from '../utils/storage.js';

type Settings = Record<keyof typeof DEFAULT_SETTINGS, boolean>;

const DEFAULT_SETTINGS = {
  autoAccept: false,
  autoDownload: true,
  displayIcons: false,
};

export class SettingsStore {
  keys = Object.keys(DEFAULT_SETTINGS);
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
