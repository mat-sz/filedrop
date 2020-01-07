import { put, takeEvery, select } from 'redux-saga/effects';
import uuid from 'uuid/v4';

import { ActionModel, MessageModel, WelcomeMessageModel, TransferModel, TransferMessageModel, NameMessageModel, ActionMessageModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';

function* message(action: ActionModel) {
    const msg: MessageModel = action.value as MessageModel;

    switch (msg.type) {
        case 'welcome':
            yield put({ type: ActionType.SET_CLIENT_ID, value: (msg as WelcomeMessageModel).clientId });
            break;
        case 'transfer':
            const transferMessage: TransferMessageModel = msg as TransferMessageModel;
            const transfer: TransferModel = {
                fileName: transferMessage.fileName,
                fileType: transferMessage.fileType,
                fileSize: transferMessage.fileSize,
                transferId: transferMessage.transferId,
            };

            yield put({ type: ActionType.ADD_INCOMING_TRANSFER, value: transfer });
            break;
        case 'action':
            const actionMessage: ActionMessageModel = msg as ActionMessageModel;

            switch (actionMessage.action) {
                case 'cancel':
                    yield put({ type: ActionType.REMOVE_INCOMING_TRANSFER, value: actionMessage.transferId });
                    break;
                case 'accept':
                    yield put({ type: ActionType.MOVE_OUTGOING_TRANSFER_TO_ACTIVE, value: actionMessage.transferId });
                    break;
                case 'reject':
                    yield put({ type: ActionType.REMOVE_OUTGOING_TRANSFER, value: actionMessage.transferId });
                    break;
            }
            break;
        case 'rtc':
            break;
    }
}

function* connected() {
    yield put({ type: ActionType.SET_CONNECTED, value: true });

    let name = yield select((state: StateType) => state.name);
    if (name && name !== '') {
        const message: NameMessageModel = {
            type: 'name',
            clientName: name,
        };

        yield put({ type: ActionType.WS_SEND_MESSAGE, value: message });
    }
}

function* setName(action: ActionModel) {
    const message: NameMessageModel = {
        type: 'name',
        clientName: action.value,
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: message });
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
        transferId: uuid(),
    };

    yield put({ type: ActionType.ADD_OUTGOING_TRANSFER, value: transfer });

    const model: TransferMessageModel = {
        type: 'transfer',
        transferId: transfer.transferId,
        fileName: transfer.fileName,
        fileSize: transfer.fileSize,
        fileType: transfer.fileType,
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: model });
}

function* cancelTransfer(action: ActionModel) {
    yield put({ type: ActionType.REMOVE_OUTGOING_TRANSFER, value: action.value });

    const model: ActionMessageModel = {
        type: 'action',
        transferId: action.value,
        action: 'cancel',
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: model });
}

function* acceptTransfer(action: ActionModel) {
    yield put({ type: ActionType.MOVE_INCOMING_TRANSFER_TO_ACTIVE, value: action.value });

    const model: ActionMessageModel = {
        type: 'action',
        transferId: action.value,
        action: 'accept',
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: model });
}

function* rejectTransfer(action: ActionModel) {
    yield put({ type: ActionType.REMOVE_INCOMING_TRANSFER, value: action.value });

    const model: ActionMessageModel = {
        type: 'action',
        transferId: action.value,
        action: 'reject',
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: model });
}

export default function* root() {
    yield takeEvery(ActionType.WS_MESSAGE, message);
    yield takeEvery(ActionType.WS_CONNECTED, connected);
    yield takeEvery(ActionType.WS_DISCONNECTED, disconnected);

    yield takeEvery(ActionType.SET_NAME, setName);

    yield takeEvery(ActionType.CREATE_TRANSFER, createTransfer);
    yield takeEvery(ActionType.CANCEL_TRANSFER, cancelTransfer);

    yield takeEvery(ActionType.ACCEPT_TRANSFER, acceptTransfer);
    yield takeEvery(ActionType.REJECT_TRANSFER, rejectTransfer);
};