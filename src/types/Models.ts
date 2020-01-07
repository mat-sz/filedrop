export interface ActionModel {
    type: string,
    value: any,
};

export interface MessageModel {
    type: 'welcome' | 'name' | 'transfer' | 'rtc' | 'action',
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
};

export interface RTCMessageModel extends MessageModel {
    type: 'rtc',
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
};