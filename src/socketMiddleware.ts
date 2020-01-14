import { MiddlewareAPI } from 'redux';
import { TypeSocket } from 'typesocket';

import { ActionType } from './types/ActionType';
import { MessageModel } from './types/Models';

export const socketMiddleware = (url: string) => {
    return (store: MiddlewareAPI<any, any>) => {
        const socket = new TypeSocket<MessageModel>(url);
        
        socket.onConnected = () => store.dispatch({ type: ActionType.WS_CONNECTED });
        socket.onDisconnected = () => store.dispatch({ type: ActionType.WS_DISCONNECTED });
        socket.onMessage = (message) => store.dispatch({ type: ActionType.WS_MESSAGE, value: message });

        return (next: (action: any) => void) => (action: any) => {
            if (action.type && action.type === ActionType.WS_SEND_MESSAGE && socket.readyState === 1) {
                socket.send(action.value);
            }
            
            return next(action);
        };
    };
};