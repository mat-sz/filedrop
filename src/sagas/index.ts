import { put, takeEvery, select, call } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { fromImage } from 'imtool';

import {
  ActionModel,
  TransferModel,
  TransferMessageModel,
  NameMessageModel,
  ActionMessageModel,
  PingMessageModel,
  Message,
} from '../types/Models';
import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';
import transferSendFile from './transferSendFile';
import transferReceiveFile from './transferReceiveFile';
import { TransferState } from '../types/TransferState';
import {
  setRemoteDescriptionAction,
  removeTransferAction,
  updateTransferAction,
  addTransferAction,
  addIceCandidateAction,
} from '../actions/transfers';
import { sendMessageAction } from '../actions/websocket';
import {
  setNetworkAction,
  setRtcConfigurationAction,
  setSuggestedNameAction,
  setClientIdAction,
  setClientColorAction,
  setConnectedAction,
  setMaxSizeAction,
} from '../actions/state';
import { MessageType, ActionMessageActionType } from '../types/MessageType';
import { title } from '../config';

function* message(action: ActionModel, dispatch: (action: any) => void) {
  const msg: Message = action.value as Message;

  switch (msg.type) {
    case MessageType.WELCOME:
      yield put(setRtcConfigurationAction(msg.rtcConfiguration));
      yield put(setSuggestedNameAction(msg.suggestedName));
      yield put(setClientIdAction(msg.clientId));
      yield put(setClientColorAction(msg.clientColor));
      yield put(setMaxSizeAction(msg.maxSize));
      break;
    case MessageType.TRANSFER:
      const transfer: TransferModel = {
        fileName: msg.fileName,
        fileType: msg.fileType,
        fileSize: msg.fileSize,
        transferId: msg.transferId,
        clientId: msg.clientId,
        state: TransferState.INCOMING,
        preview: msg.preview?.startsWith('data:') ? msg.preview : undefined,
        receiving: true,
      };

      yield put(addTransferAction(transfer));
      break;
    case MessageType.ACTION:
      switch (msg.action) {
        case ActionMessageActionType.CANCEL:
        case ActionMessageActionType.REJECT:
          yield put(removeTransferAction(msg.transferId));
          break;
        case ActionMessageActionType.ACCEPT:
          yield call(() => transferSendFile(msg, dispatch));
          break;
      }
      break;
    case MessageType.NETWORK:
      yield put(setNetworkAction(msg.clients));
      break;
    case MessageType.PING:
      const pongMessage: PingMessageModel = {
        type: MessageType.PING,
        timestamp: new Date().getTime(),
      };
      yield put(sendMessageAction(pongMessage));
      break;
    case MessageType.RTC_DESCRIPTION:
      if (msg.data.type === 'answer') {
        yield put(setRemoteDescriptionAction(msg.transferId, msg.data));
      } else {
        yield call(() => transferReceiveFile(msg, dispatch));
      }
      break;
    case MessageType.RTC_CANDIDATE:
      yield put(addIceCandidateAction(msg.transferId, msg.data));
      break;
  }
}

function* connected() {
  yield put(setConnectedAction(true));

  let networkName = yield select((state: StateType) => state.networkName);
  if (networkName && networkName !== '') {
    const message: NameMessageModel = {
      type: MessageType.NAME,
      networkName: networkName,
    };

    yield put(sendMessageAction(message));
  }
}

function* setName(action: ActionModel) {
  const message: NameMessageModel = {
    type: MessageType.NAME,
    networkName: action.value,
  };

  yield put(sendMessageAction(message));
}

function* disconnected() {
  yield put(setConnectedAction(false));
}

function* createTransfer(action: ActionModel) {
  const file: File = action.value.file;

  let preview: string | undefined = undefined;

  if (file.type.startsWith('image/')) {
    const maxSize = yield select((state: StateType) => state.maxSize);
    preview = yield call(async () => {
      try {
        const imtool = await fromImage(file);
        imtool.thumbnail(100, true);

        const url = await imtool.toDataURL();
        // Ensure the URL isn't too long.
        if (url.length < maxSize * 0.75) {
          return url;
        }
      } catch {}

      return undefined;
    });
  }

  const transfer: TransferModel = {
    file: file,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream', // fileType is required by the server.
    transferId: uuid(),
    clientId: action.value.clientId,
    state: TransferState.OUTGOING,
    receiving: false,
    preview,
  };

  yield put(addTransferAction(transfer));

  const model: TransferMessageModel = {
    type: MessageType.TRANSFER,
    transferId: transfer.transferId,
    fileName: transfer.fileName,
    fileSize: transfer.fileSize,
    fileType: transfer.fileType,
    targetId: transfer.clientId,
    preview,
  };

  yield put(sendMessageAction(model));
}

function* cancelTransfer(action: ActionModel) {
  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const filteredTransfers: TransferModel[] = transfers.filter(
    transfer => transfer.transferId === action.value
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
    type: MessageType.ACTION,
    transferId: transfer.transferId,
    targetId: transfer.clientId,
    action: ActionMessageActionType.CANCEL,
  };

  yield put(sendMessageAction(model));
  yield put(removeTransferAction(action.value));
}

function* acceptTransfer(action: ActionModel) {
  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const filteredTransfers: TransferModel[] = transfers.filter(
    transfer =>
      transfer.state === TransferState.INCOMING &&
      transfer.transferId === action.value
  );
  if (filteredTransfers.length === 0) return;

  const transfer = filteredTransfers[0];
  if (!transfer) return;

  const model: ActionMessageModel = {
    type: MessageType.ACTION,
    transferId: transfer.transferId,
    targetId: transfer.clientId,
    action: ActionMessageActionType.ACCEPT,
  };

  yield put(sendMessageAction(model));
  yield put(
    updateTransferAction({
      transferId: action.value,
      state: TransferState.CONNECTING,
    })
  );
}

function* rejectTransfer(action: ActionModel) {
  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const filteredTransfers: TransferModel[] = transfers.filter(
    transfer =>
      transfer.state === TransferState.INCOMING &&
      transfer.transferId === action.value
  );
  if (filteredTransfers.length === 0) return;

  const transfer = filteredTransfers[0];
  if (!transfer) return;

  const model: ActionMessageModel = {
    type: MessageType.ACTION,
    transferId: transfer.transferId,
    targetId: transfer.clientId,
    action: ActionMessageActionType.REJECT,
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
  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const incomingTransfers: TransferModel[] = transfers.filter(
    transfer => transfer.state === TransferState.INCOMING
  );

  if (incomingTransfers.length > 0) {
    document.title = '(' + incomingTransfers.length + ') ' + title;
  } else {
    document.title = title;
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

  yield takeEvery(
    [
      ActionType.ADD_TRANSFER,
      ActionType.UPDATE_TRANSFER,
      ActionType.REMOVE_TRANSFER,
      ActionType.SET_NETWORK,
    ],
    updateNotificationCount
  );
}
