export interface ActionModel {
    type: string,
    value: any,
};

export interface MessageModel {
    type: 'welcome' | 'name' | 'request' | 'rtc',
};

export interface WelcomeMessageModel extends MessageModel {
    type: 'welcome',
    clientId: string,
};

export interface NameMessageModel extends MessageModel {
    type: 'name',
    clientName: string,
};

export interface RequestMessageModel extends MessageModel {
    type: 'request',
    requestId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    clientId?: string,
};

export interface RTCMessageModel extends MessageModel {
    type: 'rtc',
    data: any,
    targetId: string,
    requestId: string,
    clientId?: string,
};

export interface TransferModel {
    requestId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    file?: File,
};