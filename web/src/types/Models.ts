import { TransferState } from './TransferState.js';

export interface ActionModel {
  type: string;
  value: any;
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
  offset?: number;
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
