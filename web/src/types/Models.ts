import { TransferState } from './TransferState';
import { MessageType, ActionMessageActionType } from './MessageType';
import { DeviceType } from './DeviceType';

export interface ActionModel {
  type: string;
  value: any;
}

export interface MessageModel {
  type: MessageType;
  secure?: boolean;
}

export interface WelcomeMessageModel extends MessageModel {
  type: MessageType.WELCOME;
  clientId: string;
  suggestedClientName?: string;
  suggestedNetworkName?: string;
  remoteAddress?: string;
  localNetworkNames: string[];
  rtcConfiguration?: RTCConfiguration;
  maxSize: number;
  noticeText?: string;
  noticeUrl?: string;
}

export interface LocalNetworksMessageModel extends MessageModel {
  type: MessageType.LOCAL_NETWORKS;
  localNetworkNames: string[];
}

export interface NetworkNameMessageModel extends MessageModel {
  type: MessageType.NETWORK_NAME;
  networkName: string;
  publicKey?: string;
  deviceType?: DeviceType;
}

export interface ClientNameMessageModel extends MessageModel {
  type: MessageType.CLIENT_NAME;
  clientName: string;
}

export interface TransferMessageModel extends MessageModel {
  type: MessageType.TRANSFER;
  transferId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  targetId: string;
  clientId?: string;
  preview?: string;
}

export interface ActionMessageModel extends MessageModel {
  type: MessageType.ACTION;
  transferId: string;
  action: ActionMessageActionType;
  targetId: string;
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

export interface RTCMessageModel extends MessageModel {
  data: any;
  targetId: string;
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
}

export interface EncryptedMessageModel extends MessageModel {
  type: MessageType.ENCRYPTED;
  targetId: string;
  payload: string;
  clientId?: string;
}

export interface TransferModel {
  transferId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  receiving: boolean;
  file?: File;
  blobUrl?: string;
  clientId: string;
  peerConnection?: RTCPeerConnection;
  progress?: number;
  speed?: number;
  time?: number;
  timeLeft?: number;
  preview?: string;
  state: TransferState;
}

export interface ChatItemModel {
  id: string;
  date: Date;
  clientId: string;
  message: string;
}

export type TransferUpdateModel = Partial<TransferModel> & {
  transferId: string;
};

export type Message =
  | WelcomeMessageModel
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

export interface ClientModel {
  clientId: string;
  clientName?: string;
  publicKey?: string;
  isLocal: boolean;
  deviceType?: DeviceType;
}
