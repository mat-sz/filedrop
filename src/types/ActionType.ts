export enum ActionType {
    // Application state
    SET_ERROR = 'SET_ERROR',
    DISMISS_ERROR = 'DISMISS_ERROR',
    SET_CONNECTED = 'SET_CONNECTED',
    SET_NETWORK_NAME = 'SET_NETWORK_NAME',
    SET_CLIENT_ID = 'SET_CLIENT_ID',
    SET_CLIENT_COLOR = 'SET_CLIENT_COLOR',
    SET_SUGGESTED_NAME = 'SET_SUGGESTED_NAME',
    SET_NETWORK = 'SET_NETWORK',

    // Web Sockets
    WS_SEND_MESSAGE = 'WS_SEND_MESSAGE',
    WS_MESSAGE = 'WS_MESSAGE',
    WS_CONNECTED = 'WS_CONNECTED',
    WS_DISCONNECTED = 'WS_DISCONNECTED',

    // Incoming transfers
    ACCEPT_TRANSFER = 'ACCEPT_TRANSFER',
    REJECT_TRANSFER = 'REJECT_TRANSFER',
    ADD_TRANSFER = 'ADD_TRANSFER',
    REMOVE_TRANSFER = 'REMOVE_TRANSFER',

    // Outgoing transfers
    CREATE_TRANSFER = 'CREATE_TRANSFER',
    CANCEL_TRANSFER = 'CANCEL_TRANSFER',

    // Active transfers
    ADD_ICE_CANDIDATE = 'ADD_ICE_CANDIDATE',
    SET_LOCAL_DESCRIPTION = 'SET_LOCAL_DESCRIPTION',
    SET_REMOTE_DESCRIPTION = 'SET_REMOTE_DESCRIPTION',
    UPDATE_TRANSFER = 'UPDATE_TRANSFER',
};