import { ActionModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { Store } from 'redux';

export interface StateType {
    connected: boolean,
    error: string,
    name: string,
    clientId: string,
};

let initialState: StateType = {
    connected: false,
    error: null,
    name: null,
    clientId: null,
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
        default:
            return state;
    }

    return newState;
};

export default applicationState;