import { ApplicationStore } from './ApplicationStore';
import { ChatStore } from './ChatStore';
import { Connection } from './Connection';
import { NetworkStore } from './NetworkStore';

export const connection = new Connection();
export const applicationStore = new ApplicationStore(connection);
export const networkStore = new NetworkStore(connection);
export const chatStore = new ChatStore(connection);
export { settingsStore } from './SettingsStore';
