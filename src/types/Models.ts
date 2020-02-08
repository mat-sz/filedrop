import { TransferState } from "./TransferState";

export interface ActionModel {
    type: string,
    value: any,
};

export interface MessageModel {
    type: 'welcome' | 'name' | 'transfer' | 'action' | 'network' | 'ping' | 'rtcDescription' | 'rtcCandidate',
};

export interface WelcomeMessageModel extends MessageModel {
    type: 'welcome',
    clientId: string,
    clientColor: string,
    suggestedName: string,
    rtcConfiguration?: RTCConfiguration,
};

export interface NameMessageModel extends MessageModel {
    type: 'name',
    networkName: string,
};

export interface TransferMessageModel extends MessageModel {
    type: 'transfer',
    transferId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    targetId: string,
    clientId?: string,
};

export interface ActionMessageModel extends MessageModel {
    type: 'action',
    transferId: string,
    action: 'accept' | 'reject' | 'cancel',
    targetId: string,
    clientId?: string,
};

export interface NetworkMessageModel extends MessageModel {
    type: 'network',
    clients: ClientModel[],
};

export interface PingMessageModel extends MessageModel {
    type: 'ping',
    timestamp: number,
};

export interface RTCDescriptionMessageModel extends MessageModel {
    type: 'rtcDescription',
    data: any,
    targetId: string,
    transferId: string,
    clientId?: string,
};

export interface RTCCandidateMessageModel extends MessageModel {
    type: 'rtcCandidate',
    data: any,
    targetId: string,
    transferId: string,
    clientId?: string,
};

export interface TransferModel {
    transferId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    receiving: boolean,
    file?: File,
    blobUrl?: string,
    clientId?: string,
    peerConnection?: RTCPeerConnection,
    progress?: number,
    speed?: number,
    time?: number,
    state: TransferState,
};

export interface ClientModel {
    clientId: string,
    clientColor: string,
};