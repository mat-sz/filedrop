import { TransferState } from "./TransferState";
import { MessageType, ActionMessageActionType } from "./MessageType";

export interface ActionModel {
    type: string,
    value: any,
};

export interface MessageModel {
    type: MessageType,
};

export interface WelcomeMessageModel extends MessageModel {
    type: MessageType.WELCOME,
    clientId: string,
    clientColor: string,
    suggestedName: string,
    rtcConfiguration?: RTCConfiguration,
};

export interface NameMessageModel extends MessageModel {
    type: MessageType.NAME,
    networkName: string,
};

export interface TransferMessageModel extends MessageModel {
    type: MessageType.TRANSFER,
    transferId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    targetId: string,
    clientId?: string,
};

export interface ActionMessageModel extends MessageModel {
    type: MessageType.ACTION,
    transferId: string,
    action: ActionMessageActionType,
    targetId: string,
    clientId?: string,
};

export interface NetworkMessageModel extends MessageModel {
    type: MessageType.NETWORK,
    clients: ClientModel[],
};

export interface PingMessageModel extends MessageModel {
    type: MessageType.PING,
    timestamp: number,
};

export interface RTCDescriptionMessageModel extends MessageModel {
    type: MessageType.RTC_DESCRIPTION,
    data: any,
    targetId: string,
    transferId: string,
    clientId?: string,
};

export interface RTCCandidateMessageModel extends MessageModel {
    type: MessageType.RTC_CANDIDATE,
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

export interface TransferUpdateModel {
    transferId: string,
    fileName?: string,
    fileSize?: number,
    fileType?: string,
    receiving?: boolean,
    file?: File,
    blobUrl?: string,
    clientId?: string,
    peerConnection?: RTCPeerConnection,
    progress?: number,
    speed?: number,
    time?: number,
    state?: TransferState,
};

export interface ClientModel {
    clientId: string,
    clientColor: string,
};