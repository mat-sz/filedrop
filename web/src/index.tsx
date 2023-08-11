import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import { Loading } from './components/Loading.js';
import { App } from './App.js';
import './i18n.js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading>Loading...</Loading>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
