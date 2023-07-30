import { MiddlewareAPI } from 'redux';
import { TypeSocket } from 'typesocket';

import { ActionType } from './types/ActionType';
import { MessageModel } from './types/Models';
import {
  connectedAction,
  disconnectedAction,
  messageAction,
} from './actions/websocket';

export const socketMiddleware = (url: string) => {
  return (store: MiddlewareAPI<any, any>) => {
    const socket = new TypeSocket<MessageModel>(url, {
      maxRetries: 0,
      retryOnClose: true,
      retryTime: 500,
    });

    socket.on('connected', () => store.dispatch(connectedAction()));
    socket.on('disconnected', () => store.dispatch(disconnectedAction()));
    socket.on('message', message => store.dispatch(messageAction(message)));

    return (next: (action: any) => void) => (action: any) => {
      if (action.type) {
        if (
          action.type === ActionType.WS_SEND_MESSAGE &&
          socket.readyState === 1
        ) {
          socket.send(action.value);
        }

        if (action.type === ActionType.WS_CONNECT && socket.readyState === 0) {
          socket.connect();
        }
      }

      return next(action);
    };
  };
};
