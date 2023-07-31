import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { wsServer } from './config';
import { socketMiddleware } from './socketMiddleware';
import { applicationState, StoreType } from './reducers';
import { root } from './sagas';

export const newStore = (): StoreType => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    applicationState,
    applyMiddleware(socketMiddleware(wsServer), sagaMiddleware)
  );

  sagaMiddleware.run(root, store.dispatch);

  return store;
};
