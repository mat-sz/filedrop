export interface ActionModel {
    type: string,
    value: any,
};

export interface MessageModel {
    type: 'welcome' | 'name' | 'transfer' | 'action' | 'rtcDescription' | 'rtcCandidate',
};

export interface WelcomeMessageModel extends MessageModel {
    type: 'welcome',
    clientId: string,
};

export interface NameMessageModel extends MessageModel {
    type: 'name',
    clientName: string,
};

export interface TransferMessageModel extends MessageModel {
    type: 'transfer',
    transferId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    clientId?: string,
};

export interface ActionMessageModel extends MessageModel {
    type: 'action',
    transferId: string,
    action: 'accept' | 'reject' | 'cancel',
    clientId?: string,
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
    file?: File,
    blobUrl?: string,
    clientId?: string,
    peerConnection?: RTCPeerConnection,
    progress?: number,
    speed?: number,
    time?: number,
    state?: 'connecting' | 'connected' | 'inprogress' | 'complete' | 'failed',
};