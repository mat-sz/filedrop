import { put, takeEvery, select, call } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { canvas } from 'imtool';
import { RSA } from 'matcrypt';

import { title } from '../config';
import {
  ActionModel,
  TransferModel,
  TransferMessageModel,
  ActionMessageModel,
  PingMessageModel,
  Message,
  ClientModel,
  EncryptedMessageModel,
  ChatMessageModel,
  NetworkNameMessageModel,
  ClientNameMessageModel,
} from '../types/Models';
import { ActionType } from '../types/ActionType';
import { TransferState } from '../types/TransferState';
import { MessageType, ActionMessageActionType } from '../types/MessageType';
import { StateType } from '../reducers';
import transferSendFile from './transferSendFile';
import transferReceiveFile from './transferReceiveFile';
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
  setSuggestedNetworkNameAction,
  setClientIdAction,
  setClientNameAction,
  setConnectedAction,
  setMaxSizeAction,
  setNoticeAction,
  setKeyPairAction,
  setNetworkNameAction,
  addChatItemAction,
  setLocalNetworkNames,
  setRemoteAddressAction,
} from '../actions/state';
import { deviceType } from '../utils/browser';

function* message(action: ActionModel, dispatch: (action: any) => void) {
  const msg: Message = action.value as Message;

  switch (msg.type) {
    case MessageType.WELCOME:
      const clientName: string | undefined = yield select(
        (state: StateType) => state.clientName
      );

      if (msg.rtcConfiguration) {
        yield put(setRtcConfigurationAction(msg.rtcConfiguration));
      }

      if (msg.suggestedNetworkName) {
        yield put(setSuggestedNetworkNameAction(msg.suggestedNetworkName));
      }

      if (clientName) {
        // If we have a name already, let's use that.
        yield put(setClientNameAction(clientName));
      } else if (msg.suggestedClientName) {
        yield put(setClientNameAction(msg.suggestedClientName));
      }

      yield put(setLocalNetworkNames(msg.localNetworkNames));
      yield put(setClientIdAction(msg.clientId));
      yield put(setMaxSizeAction(msg.maxSize));
      yield put(setNoticeAction(msg.noticeText, msg.noticeUrl));
      yield put(setRemoteAddressAction(msg.remoteAddress));

      const networkName: string = yield select(
        (state: StateType) => state.networkName
      );

      if (networkName && networkName !== '') {
        yield put(setNetworkNameAction(networkName));
      }
      break;
    case MessageType.LOCAL_NETWORKS:
      yield put(setLocalNetworkNames(msg.localNetworkNames));
      break;
    case MessageType.TRANSFER:
      if (msg.clientId) {
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
      }
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
    case MessageType.CHAT:
      const network: ClientModel[] = yield select(
        (state: StateType) => state.network
      );
      const client = network.find(client => client.clientId === msg.clientId);

      if (client) {
        yield put(
          addChatItemAction({
            id: uuid(),
            date: new Date(),
            clientId: client.clientId,
            message: msg.message,
          })
        );
      }
      break;
    case MessageType.ENCRYPTED:
      const privateKey: string = yield select(
        (state: StateType) => state.privateKey
      );
      if (privateKey) {
        try {
          const json = JSON.parse(
            yield call(
              async () => await RSA.decryptString(privateKey, msg.payload)
            )
          );

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
  const secure = !!msg.secure;
  delete msg['secure'];

  if ('targetId' in msg) {
    const network: ClientModel[] = yield select(
      (state: StateType) => state.network
    );
    const target = network?.find(client => client.clientId === msg.targetId);

    const targetPublicKey = target?.publicKey;
    if (targetPublicKey) {
      try {
        const payload: string = yield call(
          async () =>
            await RSA.encryptString(targetPublicKey, JSON.stringify(msg))
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

  if (secure) {
    return;
  }

  yield put({
    type: ActionType.WS_SEND_MESSAGE,
    value: msg,
  });
}

function* connected() {
  yield put(setConnectedAction(true));
}

function* setNetworkName(action: ActionModel) {
  const publicKey: string = yield select((state: StateType) => state.publicKey);

  const message: NetworkNameMessageModel = {
    type: MessageType.NETWORK_NAME,
    networkName: action.value,
    publicKey,
    deviceType,
  };

  yield put(sendMessageAction(message));
}

function* setClientName(action: ActionModel) {
  localStorage.setItem('clientName', action.value);
  const message: ClientNameMessageModel = {
    type: MessageType.CLIENT_NAME,
    clientName: action.value,
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
    const maxSize: number = yield select((state: StateType) => state.maxSize);
    preview = yield call(async () => {
      try {
        const newCanvas = await canvas.fromFile(file);
        const url = canvas
          .thumbnail(newCanvas, 100, true)
          .toDataURL('image/jpeg', 0.65);

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

function* sendChatMessage(action: ActionModel) {
  const message = action.value as string;
  const clientId: string = yield select((state: StateType) => state.clientId);
  const network: ClientModel[] = yield select(
    (state: StateType) => state.network
  );

  for (const client of network) {
    const model: ChatMessageModel = {
      type: MessageType.CHAT,
      targetId: client.clientId,
      message,
      secure: true,
    };

    yield put(sendMessageAction(model));
  }

  console.log(clientId);
  yield put(
    addChatItemAction({
      id: uuid(),
      date: new Date(),
      clientId,
      message,
    })
  );
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

  yield takeEvery(ActionType.SET_NETWORK_NAME, setNetworkName);
  yield takeEvery(ActionType.SET_CLIENT_NAME, setClientName);

  yield takeEvery(ActionType.CREATE_TRANSFER, createTransfer);
  yield takeEvery(ActionType.CANCEL_TRANSFER, cancelTransfer);

  yield takeEvery(ActionType.ACCEPT_TRANSFER, acceptTransfer);
  yield takeEvery(ActionType.REJECT_TRANSFER, rejectTransfer);

  yield takeEvery(ActionType.SEND_CHAT_MESSAGE, sendChatMessage);

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
