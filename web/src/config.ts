const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
export const wsServer = `${wsProtocol}${window.location.host}/ws`;
export const defaultAppName: string =
  import.meta.env.VITE_APP_NAME || 'filedrop';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
