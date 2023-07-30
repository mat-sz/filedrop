import { BrowserRouter, HashRouter } from 'react-router-dom';

function env(name: string): string | undefined {
  return window.__RUNTIME_CONFIG__?.[name] || process.env[name];
}

const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
export const wsServer = `${wsProtocol}${window.location.host}/ws`;
export const title = env('REACT_APP_TITLE') || 'filedrop';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = env('REACT_APP_USE_BROWSER_ROUTER')
  ? BrowserRouter
  : HashRouter;
export const abuseEmail = env('REACT_APP_ABUSE_EMAIL');
