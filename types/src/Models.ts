import { DeviceType } from './DeviceType.js';
import { MessageType, ActionMessageActionType } from './MessageType.js';

export interface ClientModel {
  clientId: string;
  clientName?: string;
  publicKey?: string;
  isLocal: boolean;
  deviceType?: DeviceType;
}

export interface NetworkModel {
  name: string;
  clients: ClientModel[];
}

export interface MessageModel {
  type: MessageType;
  secure?: boolean;
}

export interface TargetedMessageModel extends MessageModel {
  targetId: string;
}

export interface InitializeMessageModel extends MessageModel {
  type: MessageType.INITIALIZE;
  secret: string;
  publicKey?: string;
}

export interface DisconnectedMessageModel extends MessageModel {
  type: MessageType.DISCONNECTED;
  reason: string;
}

export interface ErrorMessageModel extends MessageModel {
  type: MessageType.ERROR;
  mode: 'network';
  reason: string;
}

export interface AppInfoMessageModel extends MessageModel {
  type: MessageType.APP_INFO;
  remoteAddress?: string;
  maxSize: number;
  noticeText?: string;
  noticeUrl?: string;
  appName?: string;
  abuseEmail?: string;
  requireCrypto: boolean;
}

export interface ClientInfoMessageModel extends MessageModel {
  type: MessageType.CLIENT_INFO;
  clientId: string;
  suggestedClientName?: string;
  suggestedNetworkName?: string;
  localNetworks?: NetworkModel[];
  rtcConfiguration?: any;
}

export interface LocalNetworksMessageModel extends MessageModel {
  type: MessageType.LOCAL_NETWORKS;
  localNetworks: NetworkModel[];
}

export interface NetworkNameMessageModel extends MessageModel {
  type: MessageType.NETWORK_NAME;
  networkName: string;
  deviceType?: DeviceType;
}

export interface ClientNameMessageModel extends MessageModel {
  type: MessageType.CLIENT_NAME;
  clientName: string;
}

export interface TransferMessageModel extends TargetedMessageModel {
  type: MessageType.TRANSFER;
  transferId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  clientId?: string;
  preview?: string;
}

export interface ActionMessageModel extends TargetedMessageModel {
  type: MessageType.ACTION;
  transferId: string;
  action: ActionMessageActionType;
  clientId?: string;
}

export interface NetworkMessageModel extends MessageModel {
  type: MessageType.NETWORK;
  clients: ClientModel[];
}

export interface PingMessageModel extends MessageModel {
  type: MessageType.PING;
  timestamp: number;
}

export interface RTCMessageModel extends TargetedMessageModel {
  data: any;
  transferId: string;
  clientId?: string;
}

export interface RTCDescriptionMessageModel extends RTCMessageModel {
  type: MessageType.RTC_DESCRIPTION;
}

export interface RTCCandidateMessageModel extends RTCMessageModel {
  type: MessageType.RTC_CANDIDATE;
}

export interface ChatMessageModel extends MessageModel {
  type: MessageType.CHAT;
  clientId?: string;
  targetId: string;
  message: string;
  direct?: boolean;
}

export interface EncryptedMessageModel extends TargetedMessageModel {
  type: MessageType.ENCRYPTED;
  payload: string;
  clientId?: string;
}

export type Message =
  | InitializeMessageModel
  | DisconnectedMessageModel
  | ErrorMessageModel
  | AppInfoMessageModel
  | ClientInfoMessageModel
  | LocalNetworksMessageModel
  | NetworkNameMessageModel
  | ClientNameMessageModel
  | TransferMessageModel
  | ActionMessageModel
  | NetworkMessageModel
  | PingMessageModel
  | RTCDescriptionMessageModel
  | RTCCandidateMessageModel
  | ChatMessageModel
  | EncryptedMessageModel;
