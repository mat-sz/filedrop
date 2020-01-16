import { ActionModel, TransferModel, ClientModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { Store } from 'redux';

export interface StateType {
    welcomed: boolean,
    connected: boolean,
    rtcConfiguration: RTCConfiguration,
    error: string,
    networkName: string,
    clientId: string,
    clientColor: string,
    suggestedName: string,
    network: ClientModel[],
    transfers: TransferModel[],
};

let initialState: StateType = {
    welcomed: localStorage.getItem('welcomed') === '1',
    connected: false,
    rtcConfiguration: null,
    error: null,
    networkName: null,
    clientId: null,
    clientColor: null,
    suggestedName: null,
    network: [],
    transfers: [],
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
        case ActionType.DISMISS_WELCOME:
            newState.welcomed = true;
            break;
        case ActionType.SET_CONNECTED:
            newState.connected = action.value as boolean;
            break;
        case ActionType.SET_RTC_CONFIGURATION:
            const rtcConfiguration = action.value as RTCConfiguration;

            // If the server is allowed to set other properties it may result in a potential privacy breach.
            // Let's make sure that doesn't happen.
            // TODO: add other properties if neccessary.
            if (rtcConfiguration.iceServers) {
                newState.rtcConfiguration = {
                    iceServers: rtcConfiguration.iceServers,
                };
            } else {
                newState.rtcConfiguration = null;
            }
            break;
        case ActionType.SET_NETWORK_NAME:
            newState.networkName = action.value as string;
            break;
        case ActionType.SET_CLIENT_ID:
            newState.clientId = action.value as string;
            break;
        case ActionType.SET_CLIENT_COLOR:
            newState.clientColor = action.value as string;
            break;
        case ActionType.SET_SUGGESTED_NAME:
            newState.suggestedName = action.value as string;
            break;
        case ActionType.SET_NETWORK:
            newState.network = action.value as ClientModel[];
            newState.network = newState.network.filter((client) => client.clientId !== newState.clientId);
            
            // Remove transfers from now offline clients.
            const clientIds = newState.network.map((client) => client.clientId);
            newState.transfers = newState.transfers.filter((transfer) => transfer.clientId ? clientIds.includes(transfer.clientId) : true);
            break;
        case ActionType.ADD_TRANSFER:
            newState.transfers = [...newState.transfers, action.value];
            break;
        case ActionType.REMOVE_TRANSFER:
            newState.transfers = newState.transfers.filter(transfer => transfer.transferId !== action.value);
            break;
        case ActionType.SET_REMOTE_DESCRIPTION:
            newState.transfers = newState.transfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId && transfer.peerConnection) {
                    transfer.peerConnection.setRemoteDescription(action.value.data);
                }
                return transfer;
            });
            break;
        case ActionType.ADD_ICE_CANDIDATE:
            newState.transfers = newState.transfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId && transfer.peerConnection) {
                    try {
                        transfer.peerConnection.addIceCandidate(action.value.data);
                    } catch {}
                }
                return transfer;
            });
            break;
        case ActionType.UPDATE_TRANSFER:
            newState.transfers = newState.transfers.map((transfer) => {
                if (transfer.transferId === action.value.transferId) {
                    return {
                        ...transfer,
                        ...action.value,
                    };
                }
                return transfer;
            });
            break;
        default:
            return state;
    }

    newState.transfers = newState.transfers.sort((a, b) => {
        return b.state - a.state;
    });

    return newState;
};

export default applicationState;