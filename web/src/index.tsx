import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import { Loading } from './components/Loading';
import { App } from './App';
import './i18n';

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
