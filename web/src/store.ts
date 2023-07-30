import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { socketMiddleware } from './socketMiddleware';
import reducers, { StoreType } from './reducers';
import sagas from './sagas';
import { wsServer } from './config';

const newStore = (): StoreType => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers,
    applyMiddleware(socketMiddleware(wsServer), sagaMiddleware)
  );

  sagaMiddleware.run(sagas, store.dispatch);

  return store;
};

export default newStore;
