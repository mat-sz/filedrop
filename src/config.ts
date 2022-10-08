import { BrowserRouter, HashRouter } from 'react-router-dom';

import { replaceUrlParameters } from './utils/url';

export const title = window.__RUNTIME_CONFIG__.REACT_APP_TITLE || 'filedrop';
export const wsServer = window.__RUNTIME_CONFIG__.REACT_APP_SERVER
  ? replaceUrlParameters(window.__RUNTIME_CONFIG__.REACT_APP_SERVER)
  : 'ws://' + window.location.hostname + ':5000/ws';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = window.__RUNTIME_CONFIG__.REACT_APP_USE_BROWSER_ROUTER
  ? BrowserRouter
  : HashRouter;
export const abuseEmail = window.__RUNTIME_CONFIG__.REACT_APP_ABUSE_EMAIL || null;
