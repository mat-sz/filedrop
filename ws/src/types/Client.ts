import { DeviceType } from './DeviceType';

export interface Client {
  readonly clientId: string;
  clientName?: string;
  readonly firstSeen: Date;
  lastSeen: Date;
  readonly remoteAddress?: string;
  networkName?: string;
  readonly readyState: number;
  publicKey?: string;
  deviceType?: DeviceType;

  send(data: string): void;
  close(): void;
}
