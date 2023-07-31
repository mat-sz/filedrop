import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Loading } from './components/Loading';
import { App } from './App';
import { newStore } from './store';
import './i18n';

const store = newStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loading>Loading...</Loading>}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
