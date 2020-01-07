import { put, takeEvery } from 'redux-saga/effects';
import { ActionModel, MessageModel, WelcomeMessageModel, TransferModel, RequestMessageModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import uuid from 'uuid/v4';

function* message(action: ActionModel) {
    const msg: MessageModel = action.value as MessageModel;

    switch (msg.type) {
        case 'welcome':
            yield put({ type: ActionType.SET_CLIENT_ID, value: (msg as WelcomeMessageModel).clientId });
            break;
        case 'request':
            break;
        case 'rtc':
            break;
    }
}

function* connected() {
    yield put({ type: ActionType.SET_CONNECTED, value: true });
}

function* disconnected() {
    yield put({ type: ActionType.SET_CONNECTED, value: false });
}

function* createTransfer(action: ActionModel) {
    const file: File = action.value;

    const transfer: TransferModel = {
        file: file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        requestId: uuid(),
    };

    yield put({ type: ActionType.ADD_OUTGOING_TRANSFER, value: transfer });

    const model: RequestMessageModel = {
        type: 'request',
        requestId: transfer.requestId,
        fileName: transfer.fileName,
        fileSize: transfer.fileSize,
        fileType: transfer.fileType,
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: model });
}

export default function* root() {
    yield takeEvery(ActionType.WS_MESSAGE, message);
    yield takeEvery(ActionType.WS_CONNECTED, connected);
    yield takeEvery(ActionType.WS_DISCONNECTED, disconnected);

    yield takeEvery(ActionType.CREATE_TRANSFER, createTransfer);
};