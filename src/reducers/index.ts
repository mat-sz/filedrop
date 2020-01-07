import { ActionModel, TransferModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { Store } from 'redux';

export interface StateType {
    connected: boolean,
    error: string,
    name: string,
    clientId: string,
    activeTransfers: TransferModel[],
    incomingTransfers: TransferModel[],
    outgoingTransfers: TransferModel[],
};

let initialState: StateType = {
    connected: false,
    error: null,
    name: null,
    clientId: null,
    activeTransfers: [],
    incomingTransfers: [],
    outgoingTransfers: [],
};

export type StoreType = Store<StateType, ActionModel>;
  
function applicationState(state = initialState, action: ActionModel) {
    const newState = {...state};
    switch (action.type) {
        case ActionType.SET_ERROR:
            newState.error = action.value as string;
            break;
        case ActionType.DISMISS_ERROR:
            newState.error = null;
            break;
        case ActionType.SET_CONNECTED:
            newState.connected = action.value as boolean;
            break;
        case ActionType.SET_NAME:
            newState.name = action.value as string;
            break;
        case ActionType.SET_CLIENT_ID:
            newState.clientId = action.value as string;
            break;
        case ActionType.ADD_OUTGOING_TRANSFER:
            newState.outgoingTransfers = [...newState.outgoingTransfers, action.value];
            break;
        case ActionType.REMOVE_OUTGOING_TRANSFER:
            newState.outgoingTransfers = newState.outgoingTransfers.filter(transfer => transfer.transferId !== action.value);
            break;
        case ActionType.ADD_INCOMING_TRANSFER:
            newState.incomingTransfers = [...newState.incomingTransfers, action.value];
            break;
        case ActionType.REMOVE_INCOMING_TRANSFER:
            newState.incomingTransfers = newState.incomingTransfers.filter(transfer => transfer.transferId !== action.value);
            break;
        case ActionType.MOVE_INCOMING_TRANSFER_TO_ACTIVE:
            const incomingTransfer = newState.incomingTransfers.find(transfer => transfer.transferId === action.value);
            newState.incomingTransfers = newState.incomingTransfers.filter(transfer => transfer.transferId !== action.value);
            newState.activeTransfers = [...newState.activeTransfers, incomingTransfer];
            break;
        case ActionType.MOVE_OUTGOING_TRANSFER_TO_ACTIVE:
            const outgoingTransfer = newState.outgoingTransfers.find(transfer => transfer.transferId === action.value);
            newState.outgoingTransfers = newState.outgoingTransfers.filter(transfer => transfer.transferId !== action.value);
            newState.activeTransfers = [...newState.activeTransfers, outgoingTransfer];
            break;
        case ActionType.ADD_PEER_CONNECTION:
            newState.activeTransfers = newState.activeTransfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId && action.value.peerConnection) {
                    transfer.peerConnection = action.value.peerConnection;
                }
                return transfer;
            });
            break;
        case ActionType.SET_REMOTE_DESCRIPTION:
            newState.activeTransfers = newState.activeTransfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId && transfer.peerConnection) {
                    transfer.peerConnection.setRemoteDescription(action.value.data);
                }
                return transfer;
            });
            break;
        case ActionType.ADD_ICE_CANDIDATE:
            newState.activeTransfers = newState.activeTransfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId && transfer.peerConnection) {
                    transfer.peerConnection.addIceCandidate(action.value.data);
                }
                return transfer;
            });
            break;
        default:
            return state;
    }

    return newState;
};

export default applicationState;