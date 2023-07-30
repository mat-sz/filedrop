import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import createStore from './store';
import './i18n';

const store = createStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<section className="center">Loading...</section>}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
