import { BrowserRouter, HashRouter } from 'react-router-dom';

import { replaceUrlParameters } from './utils/url';

export const title = process.env.REACT_APP_TITLE || 'filedrop';
export const wsServer = process.env.REACT_APP_SERVER
  ? replaceUrlParameters(process.env.REACT_APP_SERVER)
  : 'ws://' + window.location.hostname + ':5000/ws';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = process.env.REACT_APP_USE_BROWSER_ROUTER
  ? BrowserRouter
  : HashRouter;
export const abuseEmail = process.env.REACT_APP_ABUSE_EMAIL || null;
