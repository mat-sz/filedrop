import { ActionModel, ClientModel } from "../types/Models";
import { ActionType } from "../types/ActionType";

export function setErrorAction(error: string): ActionModel {
    return { type: ActionType.SET_ERROR, value: error };
};

export function setConnectedAction(connected: boolean): ActionModel {
    return { type: ActionType.SET_CONNECTED, value: connected };
};

export function setRtcConfigurationAction(configuration: RTCConfiguration): ActionModel {
    return { type: ActionType.SET_RTC_CONFIGURATION, value: configuration };
};

export function setNetworkNameAction(name: string): ActionModel {
    return { type: ActionType.SET_NETWORK_NAME, value: name };
};

export function setSuggestedNameAction(name: string): ActionModel {
    return { type: ActionType.SET_SUGGESTED_NAME, value: name };
};

export function setClientIdAction(id: string): ActionModel {
    return { type: ActionType.SET_CLIENT_ID, value: id };
};

export function setClientColorAction(color: string): ActionModel {
    return { type: ActionType.SET_CLIENT_COLOR, value: color };
};

export function setNetworkAction(network: ClientModel[]): ActionModel {
    return { type: ActionType.SET_NETWORK, value: network };
};

export function dismissWelcomeAction(): ActionModel {
    return { type: ActionType.DISMISS_WELCOME, value: null };
};

export function dismissErrorAction(): ActionModel {
    return { type: ActionType.DISMISS_ERROR, value: null };
};