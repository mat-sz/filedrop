import { put, takeEvery } from 'redux-saga/effects';
import { ActionModel, MessageModel, WelcomeMessageModel } from '../types/Models';
import { ActionType } from '../types/ActionType';

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

export default function* root() {
    yield takeEvery(ActionType.WS_MESSAGE, message);
    yield takeEvery(ActionType.WS_CONNECTED, connected);
    yield takeEvery(ActionType.WS_DISCONNECTED, disconnected);
};