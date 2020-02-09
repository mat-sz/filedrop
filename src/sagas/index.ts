import { put, takeEvery, select, call } from 'redux-saga/effects';
import uuid from 'uuid/v4';

import { ActionModel, MessageModel, WelcomeMessageModel, TransferModel, TransferMessageModel, NameMessageModel, ActionMessageModel, RTCDescriptionMessageModel, RTCCandidateMessageModel, NetworkMessageModel, PingMessageModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';
import transferSendFile from './transferSendFile';
import transferReceiveFile from './transferReceiveFile';
import { TransferState } from '../types/TransferState';
import { setRemoteDescriptionAction, removeTransferAction, updateTransferAction, addTransferAction, addIceCandidateAction } from '../actions/transfers';
import { sendMessageAction } from '../actions/websocket';

function* message(action: ActionModel, dispatch: (action: any) => void) {
    const msg: MessageModel = action.value as MessageModel;

    switch (msg.type) {
        case 'welcome':
            const welcomeMessage: WelcomeMessageModel = msg as WelcomeMessageModel;
            yield put({ type: ActionType.SET_RTC_CONFIGURATION, value: welcomeMessage.rtcConfiguration })
            yield put({ type: ActionType.SET_SUGGESTED_NAME, value: welcomeMessage.suggestedName });
            yield put({ type: ActionType.SET_CLIENT_ID, value: welcomeMessage.clientId });
            yield put({ type: ActionType.SET_CLIENT_COLOR, value: welcomeMessage.clientColor });
            break;
        case 'transfer':
            const transferMessage: TransferMessageModel = msg as TransferMessageModel;
            const transfer: TransferModel = {
                fileName: transferMessage.fileName,
                fileType: transferMessage.fileType,
                fileSize: transferMessage.fileSize,
                transferId: transferMessage.transferId,
                clientId: transferMessage.clientId,
                state: TransferState.INCOMING,
                receiving: true,
            };

            yield put(addTransferAction(transfer));
            break;
        case 'action':
            const actionMessage: ActionMessageModel = msg as ActionMessageModel;

            switch (actionMessage.action) {
                case 'cancel':
                case 'reject':
                    yield put(removeTransferAction(actionMessage.transferId));
                    break;
                case 'accept':
                    yield call(() => transferSendFile(actionMessage, dispatch));
                    break;
            }
            break;
        case 'network':
            const networkMessage: NetworkMessageModel = msg as NetworkMessageModel;
            yield put({ type: ActionType.SET_NETWORK, value: networkMessage.clients });
            break;
        case 'ping':
            const pongMessage: PingMessageModel = {
                type: 'ping',
                timestamp: new Date().getTime(),
            };
            yield put(sendMessageAction(pongMessage));
            break;
        case 'rtcDescription':
            const rtcMessage: RTCDescriptionMessageModel = msg as RTCDescriptionMessageModel;
            
            if (rtcMessage.data.type === 'answer') {
                yield put(setRemoteDescriptionAction(rtcMessage.transferId, rtcMessage.data));
            } else {
                yield call(() => transferReceiveFile(rtcMessage, dispatch));
            }
            break;
        case 'rtcCandidate':
            const rtcCandidate: RTCCandidateMessageModel = msg as RTCCandidateMessageModel;
            yield put(addIceCandidateAction(rtcCandidate.transferId, rtcCandidate.data));
            break;
    }
}

function* connected() {
    yield put({ type: ActionType.SET_CONNECTED, value: true });

    let networkName = yield select((state: StateType) => state.networkName);
    if (networkName && networkName !== '') {
        const message: NameMessageModel = {
            type: 'name',
            networkName: networkName,
        };

        yield put(sendMessageAction(message));
    }
}

function* setName(action: ActionModel) {
    const message: NameMessageModel = {
        type: 'name',
        networkName: action.value,
    };

    yield put(sendMessageAction(message));
}

function* disconnected() {
    yield put({ type: ActionType.SET_CONNECTED, value: false });
}

function* createTransfer(action: ActionModel) {
    const file: File = action.value.file;

    const transfer: TransferModel = {
        file: file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream', // fileType is required by the server.
        transferId: uuid(),
        clientId: action.value.clientId,
        state: TransferState.OUTGOING,
        receiving: false,
    };

    yield put(addTransferAction(transfer));

    const model: TransferMessageModel = {
        type: 'transfer',
        transferId: transfer.transferId,
        fileName: transfer.fileName,
        fileSize: transfer.fileSize,
        fileType: transfer.fileType,
        targetId: transfer.clientId,
    };

    yield put(sendMessageAction(model));
}

function* cancelTransfer(action: ActionModel) {
    const transfers: TransferModel[] = yield select((state: StateType) => state.transfers);
    const filteredTransfers: TransferModel[] = transfers.filter(
        (transfer) =>
            transfer.transferId === action.value
    );
    if (filteredTransfers.length === 0) return;

    const transfer = filteredTransfers[0];
    if (!transfer) return;

    if (transfer.peerConnection) {
        try {
            transfer.peerConnection.close();
        } catch {}
    }

    const model: ActionMessageModel = {
        type: 'action',
        transferId: transfer.transferId,
        targetId: transfer.clientId,
        action: 'cancel',
    };

    yield put(sendMessageAction(model));
    yield put(removeTransferAction(action.value));
}

function* acceptTransfer(action: ActionModel) {
    const transfers: TransferModel[] = yield select((state: StateType) => state.transfers);
    const filteredTransfers: TransferModel[] = transfers.filter(
        (transfer) =>
        transfer.state === TransferState.INCOMING &&
        transfer.transferId === action.value
    );
    if (filteredTransfers.length === 0) return;

    const transfer = filteredTransfers[0];
    if (!transfer) return;

    const model: ActionMessageModel = {
        type: 'action',
        transferId: transfer.transferId,
        targetId: transfer.clientId,
        action: 'accept',
    };

    yield put(sendMessageAction(model));
    yield put(updateTransferAction({
        transferId: action.value,
        state: TransferState.CONNECTING,
    }));
}

function* rejectTransfer(action: ActionModel) {
    const transfers: TransferModel[] = yield select((state: StateType) => state.transfers);
    const filteredTransfers: TransferModel[] = transfers.filter(
        (transfer) =>
        transfer.state === TransferState.INCOMING &&
        transfer.transferId === action.value
    );
    if (filteredTransfers.length === 0) return;

    const transfer = filteredTransfers[0];
    if (!transfer) return;

    const model: ActionMessageModel = {
        type: 'action',
        transferId: transfer.transferId,
        targetId: transfer.clientId,
        action: 'reject',
    };

    yield put(sendMessageAction(model));
    yield put(removeTransferAction(action.value));
}

/**
 * Called after the welcome screen is dismissed.
 */
function* welcomed() {
    yield call(() => localStorage.setItem('welcomed', '1'));
}

function* updateNotificationCount() {
    const transfers: TransferModel[] = yield select((state: StateType) => state.transfers);
    const incomingTransfers: TransferModel[] = transfers.filter((transfer) => transfer.state === TransferState.INCOMING);
    
    if (incomingTransfers.length > 0) {
        document.title = "(" + incomingTransfers.length + ") " + process.env.REACT_APP_TITLE;
    } else {
        document.title = process.env.REACT_APP_TITLE;
    }
}

export default function* root(dispatch: (action: any) => void) {
    yield takeEvery(ActionType.DISMISS_WELCOME, welcomed);

    yield takeEvery(ActionType.WS_MESSAGE, function* (action: ActionModel) {
        // TODO: rewrite this to avoid passing dispatch
        yield call(() => message(action, dispatch));
    });
    yield takeEvery(ActionType.WS_CONNECTED, connected);
    yield takeEvery(ActionType.WS_DISCONNECTED, disconnected);

    yield takeEvery(ActionType.SET_NETWORK_NAME, setName);

    yield takeEvery(ActionType.CREATE_TRANSFER, createTransfer);
    yield takeEvery(ActionType.CANCEL_TRANSFER, cancelTransfer);

    yield takeEvery(ActionType.ACCEPT_TRANSFER, acceptTransfer);
    yield takeEvery(ActionType.REJECT_TRANSFER, rejectTransfer);

    yield takeEvery([
        ActionType.ADD_TRANSFER,
        ActionType.UPDATE_TRANSFER,
        ActionType.REMOVE_TRANSFER,
        ActionType.SET_NETWORK,
    ], updateNotificationCount);
};