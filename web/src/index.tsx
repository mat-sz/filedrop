import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { pwanow, splash } from 'pwanow';

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

// Prevent zoom.
document.addEventListener(
  'touchmove',
  (event: any) => {
    event = event.originalEvent || event;
    if (typeof event.scale !== 'undefined' && event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

pwanow({
  backgroundColor: '#1b1b1d',
  iconUrl: '/drop.svg',
}).use(splash);
