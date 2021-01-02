import { put, takeEvery, select, call } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { fromImage } from 'imtool';
import { fromByteArray, toByteArray } from 'base64-js';
import { RSA, Utils } from 'matcrypt';

import {
  ActionModel,
  TransferModel,
  TransferMessageModel,
  NameMessageModel,
  ActionMessageModel,
  PingMessageModel,
  Message,
  ClientModel,
  EncryptedMessageModel,
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
import {
  connectAction,
  messageAction,
  sendMessageAction,
} from '../actions/websocket';
import {
  setNetworkAction,
  setRtcConfigurationAction,
  setSuggestedNameAction,
  setClientIdAction,
  setClientColorAction,
  setConnectedAction,
  setMaxSizeAction,
  setNoticeAction,
  setKeyPairAction,
  setNetworkNameAction,
} from '../actions/state';
import { MessageType, ActionMessageActionType } from '../types/MessageType';
import { title } from '../config';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function* message(action: ActionModel, dispatch: (action: any) => void) {
  const msg: Message = action.value as Message;

  switch (msg.type) {
    case MessageType.WELCOME:
      yield put(setRtcConfigurationAction(msg.rtcConfiguration));
      yield put(setSuggestedNameAction(msg.suggestedName));
      yield put(setClientIdAction(msg.clientId));
      yield put(setClientColorAction(msg.clientColor));
      yield put(setMaxSizeAction(msg.maxSize));
      yield put(setNoticeAction(msg.noticeText, msg.noticeUrl));

      const networkName = yield select((state: StateType) => state.networkName);

      if (networkName && networkName !== '') {
        yield put(setNetworkNameAction(networkName));
      }
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
    case MessageType.ENCRYPTED:
      const privateKey = yield select((state: StateType) => state.privateKey);
      if (privateKey) {
        try {
          let json: any = undefined;
          if (msg.secret) {
            const data = Utils.joinArrays(
              toByteArray(msg.secret),
              toByteArray(msg.payload)
            );

            json = JSON.parse(
              textDecoder.decode(
                yield call(async () => await RSA.decrypt(privateKey, data))
              )
            );
          } else {
            json = JSON.parse(
              yield call(
                async () => await RSA.decryptString(privateKey, msg.payload)
              )
            );
          }

          if (json && json.type) {
            if (msg.clientId) {
              json.clientId = msg.clientId;
            }

            yield put(messageAction(json));
          }
        } catch {}
      }
      break;
  }
}

function* prepareMessage(action: ActionModel) {
  const msg = action.value as Message;

  if ('targetId' in msg) {
    const network: ClientModel[] = yield select(
      (state: StateType) => state.network
    );
    const target = network?.find(client => client.clientId === msg.targetId);
    if (target && target.publicKey) {
      try {
        const payload: string = yield call(
          async () =>
            await RSA.encryptString(target.publicKey, JSON.stringify(msg))
        );

        const message: EncryptedMessageModel = {
          type: MessageType.ENCRYPTED,
          targetId: msg.targetId,
          payload,
        };

        yield put({
          type: ActionType.WS_SEND_MESSAGE,
          value: message,
        });
        return;
      } catch {}
    }
  }

  yield put({
    type: ActionType.WS_SEND_MESSAGE,
    value: msg,
  });
  return;
}

function* connected() {
  yield put(setConnectedAction(true));
}

function* setName(action: ActionModel) {
  const publicKey = yield select((state: StateType) => state.publicKey);

  const message: NameMessageModel = {
    type: MessageType.NAME,
    networkName: action.value,
    publicKey,
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

function* createKeys() {
  // Generate keys.
  const keyPair: RSA.KeyPair | undefined = yield call(async () => {
    try {
      return await RSA.randomKeyPair();
    } catch {
      // In case of failure we default to plaintext communication.
      return undefined;
    }
  });

  if (keyPair) {
    yield put(setKeyPairAction(keyPair.publicKey, keyPair.privateKey));
  }

  yield put(connectAction());
}

export default function* root(dispatch: (action: any) => void) {
  yield call(() => createKeys());

  yield takeEvery(ActionType.DISMISS_WELCOME, welcomed);

  yield takeEvery(ActionType.WS_MESSAGE, function* (action: ActionModel) {
    // TODO: rewrite this to avoid passing dispatch
    yield call(() => message(action, dispatch));
  });
  yield takeEvery(ActionType.PREPARE_MESSAGE, prepareMessage);
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
