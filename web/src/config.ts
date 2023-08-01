import { BrowserRouter, HashRouter } from 'react-router-dom';

const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
export const wsServer = `${wsProtocol}${window.location.host}/ws`;
export const defaultAppName = import.meta.env.VITE_APP_NAME || 'filedrop';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = import.meta.env.VITE_APP_USE_BROWSER_ROUTER
  ? BrowserRouter
  : HashRouter;
