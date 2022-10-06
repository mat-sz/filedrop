import { Store } from 'redux';
import { RSA } from 'matcrypt';

import {
  ActionModel,
  TransferModel,
  ClientModel,
  ChatItemModel,
} from '../types/Models';
import { ActionType } from '../types/ActionType';
import { TransferState } from '../types/TransferState';
import { replaceUrlParameters } from '../utils/url';

export interface StateType {
  connected: boolean;
  rtcConfiguration?: RTCConfiguration;
  error?: string;
  networkName?: string;
  clientId?: string;
  clientName?: string;
  remoteAddress?: string;
  maxSize: number;
  suggestedNetworkName?: string;
  localNetworkNames: string[];
  network: ClientModel[];
  transfers: TransferModel[];
  chat: ChatItemModel[];
  publicKey?: string;
  privateKey?: string;
  noticeText?: string;
  noticeUrl?: string;
}

let initialState: StateType = {
  clientName: localStorage.getItem('clientName') || undefined,
  connected: false,
  localNetworkNames: [],
  network: [],
  transfers: [],
  maxSize: 0,
  chat: [],
};

const stateSort: Record<TransferState, number> = {
  [TransferState.INCOMING]: 0,
  [TransferState.OUTGOING]: 2,
  [TransferState.CONNECTING]: 1,
  [TransferState.CONNECTED]: 1,
  [TransferState.IN_PROGRESS]: 1,
  [TransferState.COMPLETE]: 5,
  [TransferState.FAILED]: 6,
};

export type StoreType = Store<StateType, ActionModel>;

function applicationState(state = initialState, action: ActionModel) {
  const newState = { ...state };
  switch (action.type) {
    case ActionType.SET_ERROR:
      newState.error = action.value as string;
      break;
    case ActionType.DISMISS_ERROR:
      newState.error = undefined;
      break;
    case ActionType.SET_CONNECTED:
      newState.connected = action.value as boolean;
      break;
    case ActionType.SET_RTC_CONFIGURATION:
      const rtcConfiguration = action.value as RTCConfiguration;

      // If the server is allowed to set other properties it may result in a potential privacy breach.
      // Let's make sure that doesn't happen.
      // TODO: add other properties if neccessary.
      if (
        rtcConfiguration.iceServers &&
        Array.isArray(rtcConfiguration.iceServers)
      ) {
        newState.rtcConfiguration = {
          iceServers: rtcConfiguration.iceServers.map(server => ({
            ...server,
            urls: Array.isArray(server.urls)
              ? server.urls.map(replaceUrlParameters)
              : replaceUrlParameters(server.urls),
          })),
        };
      } else {
        newState.rtcConfiguration = undefined;
      }
      break;
    case ActionType.SET_NETWORK_NAME:
      newState.networkName = action.value as string;
      break;
    case ActionType.SET_CLIENT_ID:
      newState.clientId = action.value as string;
      break;
    case ActionType.SET_CLIENT_NAME:
      newState.clientName = action.value as string;
      break;
    case ActionType.SET_REMOTE_ADDRESS:
      newState.remoteAddress = action.value as string;
      break;
    case ActionType.SET_MAX_SIZE:
      newState.maxSize = action.value as number;
      break;
    case ActionType.SET_SUGGESTED_NETWORK_NAME:
      newState.suggestedNetworkName = action.value as string;
      break;
    case ActionType.SET_LOCAL_NETWORK_NAMES:
      newState.localNetworkNames = action.value as string[];
      break;
    case ActionType.SET_KEY_PAIR:
      const keyPairValue = action.value as RSA.KeyPair;
      newState.publicKey = keyPairValue.publicKey;
      newState.privateKey = keyPairValue.privateKey;
      break;
    case ActionType.SET_NETWORK:
      newState.network = action.value as ClientModel[];

      // Remove transfers from now offline clients.
      const clientIds = newState.network.map(client => client.clientId);
      newState.transfers = newState.transfers.filter(transfer =>
        transfer.clientId ? clientIds.includes(transfer.clientId) : true
      );
      break;
    case ActionType.SET_NOTICE:
      const notice = action.value as {
        noticeText?: string;
        noticeUrl?: string;
      };
      newState.noticeText = notice.noticeText;
      newState.noticeUrl = notice.noticeUrl;
      break;
    case ActionType.ADD_TRANSFER:
      newState.transfers = [...newState.transfers, action.value];
      break;
    case ActionType.REMOVE_TRANSFER:
      newState.transfers = newState.transfers.filter(
        transfer => transfer.transferId !== action.value
      );
      break;
    case ActionType.SET_REMOTE_DESCRIPTION:
      newState.transfers = newState.transfers.map(transfer => {
        const peerConnection = transfer.peerConnection;
        if (
          transfer.transferId === action.value.transferId &&
          peerConnection &&
          peerConnection.connectionState !== 'disconnected' &&
          peerConnection.connectionState !== 'failed'
        ) {
          peerConnection
            .setRemoteDescription(action.value.data)
            .catch(() => {});
        }
        return transfer;
      });
      break;
    case ActionType.ADD_ICE_CANDIDATE:
      newState.transfers = newState.transfers.map(transfer => {
        const peerConnection = transfer.peerConnection;
        if (
          transfer.transferId === action.value.transferId &&
          peerConnection &&
          peerConnection.connectionState !== 'disconnected' &&
          peerConnection.connectionState !== 'failed'
        ) {
          peerConnection.addIceCandidate(action.value.data).catch(() => {});
        }
        return transfer;
      });
      break;
    case ActionType.UPDATE_TRANSFER:
      newState.transfers = newState.transfers.map(transfer => {
        if (transfer.transferId === action.value.transferId) {
          return {
            ...transfer,
            ...action.value,
          };
        }
        return transfer;
      });
      break;
    case ActionType.ADD_CHAT_ITEM:
      newState.chat = [...newState.chat, action.value as ChatItemModel];
      break;
    default:
      return state;
  }

  newState.transfers = newState.transfers.sort((a, b) => {
    return stateSort[b.state] - stateSort[a.state];
  });

  return newState;
}

export default applicationState;
