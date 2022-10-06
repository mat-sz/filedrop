import { BrowserRouter, HashRouter } from 'react-router-dom';

export const title = process.env.REACT_APP_TITLE || 'filedrop';
export const wsServer = process.env.REACT_APP_SERVER
  ? process.env.REACT_APP_SERVER.replace('(hostname)', window.location.hostname)
      .replace(
        '(protocol)',
        window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      )
      .replace(
        '(port)',
        window.location.port ||
          (window.location.protocol === 'https:' ? '443' : '80')
      )
  : 'ws://' + window.location.hostname + ':5000/ws';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = process.env.REACT_APP_USE_BROWSER_ROUTER
  ? BrowserRouter
  : HashRouter;
export const abuseEmail = process.env.REACT_APP_ABUSE_EMAIL || null;
