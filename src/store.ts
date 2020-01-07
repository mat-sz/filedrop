import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { socketMiddleware } from './BetterWebSocket';
import reducers, { StoreType } from './reducers';
import sagas from './sagas';

const url = process.env.REACT_APP_SERVER || 'ws://localhost:5000/ws';

const newStore = (): StoreType => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        reducers,
        applyMiddleware(socketMiddleware(url), sagaMiddleware),
    );

    sagaMiddleware.run(sagas, store.dispatch);

    return store;
};

export default newStore;