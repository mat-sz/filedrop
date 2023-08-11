import { ApplicationStore } from './ApplicationStore.js';
import { ChatStore } from './ChatStore.js';
import { Connection } from './Connection.js';
import { NetworkStore } from './NetworkStore.js';

export const connection = new Connection();
export const applicationStore = new ApplicationStore(connection);
export const networkStore = new NetworkStore(connection);
export const chatStore = new ChatStore(connection);
export { settingsStore } from './SettingsStore.js';
